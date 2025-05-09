import Editor from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { UserContext } from "../App";
import { ISession } from "../types/Session";
import SessionControlBar from "./SessionBar";
import ChatWindow from "./Chat";
import { newSocket } from './Socket';
import { ChatMessage } from '../../../backend/src/models/session'
import { User } from "../types/User";
import InviteModal from "./InviteModal";
import CodeExecutionResults from "./CodeExecutionResults";
const API = import.meta.env.VITE_SERVER_URL;
const RAPID_X_API = import.meta.env.RAPID_X_API
type ResultStatus = 'success' | 'error' | 'warning' | 'loading' | 'idle';

function CodeEditor() {
    const { id } = useParams()
    const [session, setSession] = useState<ISession | null>(null)
    const [isTextAreaOpen, setIsTextAreaOpen] = useState<boolean>(false)
    const [notes, setNotes] = useState<string>('')
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [code, setCode] = useState(session?.code)
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [isMinimized, setIsMinimized] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isConnected, setIsConnected] = useState(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isExecutionResultOpen, setIsExecutionResultOpen] = useState<boolean>(false);
    const [output, setOutput] = useState<string>('');
    const [status, setStatus] = useState<ResultStatus>('idle');
    const { token, user } = useContext(UserContext)
    const navigate = useNavigate()

    const difficultyColor = (difficulty: string) => {
        switch (difficulty) {
        case 'Easy': return 'text-green-500';
        case 'Medium': return 'text-yellow-500';
        case 'Hard': return 'text-red-500';
        default: return 'text-gray-500';
        }
    };

    useEffect(() => {
        const getSessionById = async () => {
            try {
                const res = await Axios.get(`${API}/api/sessions/${id}`, 
                    { withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                if (res.data.error) {
                    alert(res.data.error)
                    return
                }
                if (res.data.message) alert(res.data.message)
                setSession(res.data.session)
                if (res.data.session.problemId.defaultCode) {
                    if (res.data.session.language) {
                        setSelectedLanguage(res.data.session.language)
                    }
                    if (res.data.session.code) {
                        setCode(res.data.session.code)
                    } else {
                        setCode(res.data.session.problemId.defaultCode[res.data.session.language])
                    }
                }
    
                if (res.data.session.notes) setNotes(res.data.session.notes)
                if (res.data.session.duration) setTimeRemaining(res.data.session.duration * 60)
                if (res.data.session.chatHistory)  setMessages(res.data.session.chatHistory)
                if (res.data.session.timerRunning)  {
                    const endTime = res.data.session.endTime
                    const target = (new Date(endTime)).getTime();
                    const timeRemaining =  Math.floor((target - Date.now()) / 1000);
                    setIsRunning(true)
                    setTimeRemaining(timeRemaining)
                }
            } catch(e) {
                console.error(e)
            }
        }
        getSessionById()
    }, [id, token])

    // execute code 
    const executeCode = async (code: string) => {
        try {
            const options = {
                method: 'POST',
                url: 'https://judge0-ce.p.rapidapi.com/submissions',
                params: {
                  base64_encoded: 'false',
                  wait: 'true',
                  fields: '*'
                },
                headers: {
                  'x-rapidapi-key': '1b309bc055msh92aa1f6ed29508fp1bb49ejsn80525cdc01c1',
                  'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                  'Content-Type': 'application/json'
                },
                data: {
                  language_id: selectedLanguage === 'javascript' ? 63 : 71,
                  source_code: code,
                  stdin: ''
                }
              };
            const response = await Axios.request(options)
            if (response.data.stderr !== null) {
                setOutput(response.data.stderr)
                setStatus('error')
            }

            if (response.data.stdout !== null) {
                setOutput(response.data.stdout)
                setStatus('success')
            }
              
        } catch(e) {
            console.error(e)
        }
    }

    // connect to the socket.IO
    useEffect(() => {
    if (!user) {
        navigate("/");
        return;
    }

    // Connect if not connected
    if (!newSocket.connected) {
        newSocket.connect();
    }
    // Clean up on unmount
    return () => {
        newSocket.disconnect();
    };
    }, [navigate, user, session]);

    useEffect(() => {
        if (isRunning) {
            newSocket.emit('start-timer', session?._id)
        } else {
            newSocket.emit('stop-timer', session?._id)
        }
    }, [isRunning, session?._id])

    // connect to the socket.IO server
    useEffect(() => {
        const leaveRoom = () => {
            newSocket.emit('leaveRoom', { sessionId: session?._id, user });
        };  

        if (!session || !user || !newSocket) return
      
        newSocket.on('connect', () => {
          console.log("connected to the server");
          setIsConnected(true);
        });

        if (isConnected && session && user && newSocket) {
            newSocket.emit('joinRoom', { sessionId: session._id, user: user, timeRemaining: timeRemaining });
        }

        newSocket.on('connect_error', (error) => {
            console.error('Connection failed:', error.message);
          });

        newSocket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`Reconnect attempt #${attemptNumber}`);
        });
        
        newSocket.on('reconnect', () => {
            console.log('Successfully reconnected!');
        });
        
        newSocket.on('reconnect_failed', () => {
            console.error('Failed to reconnect after max attempts');
        });

        newSocket.on('start-timer', () => {
            setIsRunning(true)
          });

        newSocket.on('reset-timer', () => {
            if (!isRunning) {
                resetTimer()
                setIsRunning(false)
            }
        });

        newSocket.on('stop-timer', () => {
            setIsRunning(false)
        })

        newSocket.on('time-remaining', timeRemaining => {
            if (!isRunning) {
                setTimeRemaining(timeRemaining)
                setIsRunning(true)
            }
        });

        newSocket.on('reset-timer', () => {
            resetTimer()
        })
      
        newSocket.on('message', (message: ChatMessage) => {
          setMessages(prevMessages => [...prevMessages, message]);
          
          if (isMinimized) {
            setUnreadCount(prev => prev + 1);
          }
        });
      
        newSocket.on('roomUsers', users => {
            setUsers(users);
        });

        newSocket.on('language', language => {
            setSelectedLanguage(language);
            if (session.language === language && session.code !== '') {
                setCode(session.code)
            } else {
                setCode(session.problemId.defaultCode[language])
            }
        });

        newSocket.on('code', code => {
            setCode(code);
        });

        newSocket.on('notes', notes => {
            setNotes(notes);
        });

        newSocket.on('disconnect', () => {
          leaveRoom()
          console.log('Disconnected from server');
          setIsConnected(false);
        });
      
        newSocket.on('error', (error) => {
          console.error('newSocket error:', error);
        });
      
        return () => {
          newSocket.off('connect');
          newSocket.off('message');
          newSocket.off('language');
          newSocket.off('code');
          newSocket.off('timer-started');
          newSocket.off('notes');
          newSocket.off('roomUsers');
          newSocket.off('disconnect');
          newSocket.off('error');
        };
      }, [session, user, isConnected]);

    const handleChangeLanguage = (language: string) => {
        newSocket.emit('language-change', ({ sessionId: session?._id, language: language }));
    }

    const handleCodeChange = (code: string | undefined) => {
        newSocket.emit('code-change', ({ sessionId: session?._id, code: code }));
    }

    const handleNotesChange = (notes: string) => {
        newSocket.emit('notes-change', ({ sessionId: session?._id, notes: notes }));
    }

    // Reset timer to original value
    const resetTimer = () => {
       if (session?.duration) {
        setTimeRemaining(session.duration * 60);
        setIsRunning(false);
       }
    };

    return (
        <>
        {<div className={`flex flex-col ${isOpen ? "blur-sm" : ""}`}>
            {isConnected &&  <>
            <SessionControlBar 
                duration={session?.duration} 
                isTextAreaOpen={isTextAreaOpen} 
                setIsTextAreaOpen={setIsTextAreaOpen} 
                selectedLanguage={selectedLanguage} 
                setSelectedLanguage={setSelectedLanguage}
                session={session}
                setCode={setCode}
                code={code}
                notes={notes}
                timeRemaining={timeRemaining}
                setTimeRemaining={setTimeRemaining}
                handleChangeLanguage={handleChangeLanguage}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                resetTimer={resetTimer}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                executeCode={executeCode}
            />
            <div className="flex w-[100%] h-[670px] overflow-scroll">
               {session && <Editor
                height={"100%"}
                width={"100%"}
                language={selectedLanguage}
                value={code}
                onChange={(newValue) => {
                    setCode(newValue)
                    handleCodeChange(newValue)
                    }
                }
                theme="vs-dark"
                options={{
                    padding: { top: 16, bottom: 16 }
                }}
                />}
                {!isTextAreaOpen && <div className="w-1/2 overflow-scroll mb-15">
                    {session?.problemId && (
                    <div className="bg-white p-4">
                        <div className="p-2">
                        <div className="flex justify-between items-start">
                            <div>
                            <h2 className="text-xl font-medium">{session?.problemId.title}</h2>
                            <div className="flex gap-3 mt-1">
                                <span className={`${difficultyColor(session?.problemId.difficulty)}`}>
                                {session?.problemId.difficulty}
                                </span>
                                <span className="text-gray-600">
                                {session?.problemId.category}
                                </span>
                            </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium">Problem Description</h3>
                            <div className="mt-2 prose max-w-none">
                            {session?.problemId && (
                                <div>
                                <p>{session?.problemId.description}</p>
                                
                                {session?.problemId.exampleCases && <div>
                                        {session?.problemId.exampleCases.map((exampleCase, index: number) => {
                                        return (
                                            <div key={index}>
                                                <h4 className="text-base font-medium mt-4">{`Example ${index + 1}:`}</h4>
                                                <pre className="bg-gray-50 p-2 rounded mt-2 whitespace-pre-wrap break-words overflow-x-auto text-sm">
                                                    <p><strong>Input:</strong>{ exampleCase.input }</p>
                                                    <p><strong>Output:</strong>{ exampleCase.output }</p>
                                                    {exampleCase.Explanation && <p className="break-words"><strong>Explanation:</strong>{ exampleCase.Explanation }</p>}
                                                </pre>
                                            </div>
                                        )
                                    })}
                                    </div>}
                                
                                <h4 className="text-base font-medium mt-4">Constraints:</h4>
                                {session?.problemId && <ul className="list-disc pl-5 mt-2">
                                    {session?.problemId.constraints.map((constraint: string, index: number) => {
                                        return (
                                            <li key={index}>
                                                {constraint}
                                            </li>
                                        )
                                    })}
                                </ul>}
                                </div>
                            )}
                            </div>
                        </div>
                        </div>
                    </div>
                    )}
                </div>}
                {(!session?.problemId || isTextAreaOpen) && (
                    <textarea onChange={(e) => {
                        setNotes(e.target.value)
                        handleNotesChange(e.target.value)
                    }}
                        className="w-full h-full resize-none p-2"
                        placeholder="Paste problem statement or notes here..."
                        value={notes}
                    />)}
                <ChatWindow  
                session={session} 
                user={user} 
                socket={newSocket}
                messages={messages} 
                newMessage={newMessage} 
                setNewMessage={setNewMessage} 
                isMinimized={isMinimized} 
                setIsMinimized={setIsMinimized}
                users={users} 
                unreadCount={unreadCount} 
                setUnreadCount={setUnreadCount}
                />
            </div>
            <CodeExecutionResults 
            isExecutionResultOpen={isExecutionResultOpen} 
            setIsExecutionResultOpen={setIsExecutionResultOpen}
            output={output}
            status={status}/>
            </>}
            {!isConnected && (
                <div className="inset-0">
                    <div className="text-center font-medium">
                        ...connecting
                    </div>
                </div>
            )}
        </div>}
        {isOpen && <InviteModal sessioId={session?._id} isOpen={isOpen} setIsOpen={setIsOpen}/>}
        </>
    )
}

export default CodeEditor;