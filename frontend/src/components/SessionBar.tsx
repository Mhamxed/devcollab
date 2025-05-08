import { useState, useEffect, useRef, useContext } from 'react';
import { Play, Save, Pause, RefreshCw, AlertTriangle, Code, ChevronDown, NotebookPen, Send } from 'lucide-react';
import Axios from 'axios';
import { UserContext } from '../App';
import { newSocket } from './Socket';
const API = import.meta.env.VITE_SERVER_URL;

export default function SessionControlBar({ 
    duration, 
    isTextAreaOpen, 
    setIsTextAreaOpen, 
    selectedLanguage, 
    setSelectedLanguage, 
    code, 
    setCode, 
    session, 
    notes,
    timeRemaining, 
    setTimeRemaining,
    handleChangeLanguage,
    isRunning, 
    setIsRunning,
    resetTimer,
    isOpen, 
    setIsOpen,
    executeCode
}) {
  const [isCodeRunning, setIsCodeRunning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);
  const { token } = useContext(UserContext)

  // Format seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Start/pause timer
  const toggleTimer = () => {
    if (!isRunning) {
       startTimerAPI() 
    } else {
        stopTimerAPI()
    }
    setIsRunning(!isRunning);
  };

  // Run code simulation
  const runCode = () => {
    setIsCodeRunning(true);
    executeCode(code)
    setIsCodeRunning(false)
  };

  // Save code simulation
  const saveCode = async () => {
    try {
        setIsSaving(true);
        const res = await Axios.patch(`${API}/api/sessions/${session._id}/save-code`, 
            { code, language: selectedLanguage, notes: notes },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        if (res.data.message) {
            alert(res.data.message)
        }
        setIsSaving(false)
    } catch(e) {
        console.error(e)   
    }
  };

  // call the API to start timer
  const startTimerAPI = async () => {
    try {
        const endTime = duration * 60 === timeRemaining ? Date.now() + (duration * 60 * 1000) : Date.now() + (timeRemaining * 1000)
        const res = await Axios.patch(`${API}/api/sessions/${session._id}/start-timer`, 
            { endTime: endTime },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        if (res.data.error) {
            alert(res.data.error)
        }
    } catch(e) {
        console.error(e)   
    }
  };

  // call the API to stop timer
  const stopTimerAPI = async () => {
    try {
        const res = await Axios.patch(`${API}/api/sessions/${session._id}/stop-timer`,
            {},
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        if (res.data.error) {
            alert(res.data.error)
        }
    } catch(e) {
        console.error(e)   
    }
  };

   // call the API to reset timer
   const resetTimerAPI = async () => {
    try {
        const endTime = new Date(Date.now()).toLocaleString() + (duration * 60 * 1000)
        const res = await Axios.patch(`${API}/api/sessions/${session._id}/reset-timer`,
            {
                endTime: endTime
            },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        if (res.data.error) {
            alert(res.data.error)
        }
    } catch(e) {
        console.error(e)   
    }
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      } 
    };
  }, [isRunning, timeRemaining, setTimeRemaining, setIsRunning]);

  const languages = [
    { id: 'javascript', name: 'javaScript' },
    { id: 'python', name: 'python' }
  ];

  return (
    <div className="bg-white border-t border-1 border-gray-200">
      <div className="mx-auto flex items-center py-4 justify-between px-4 sm:px-6 lg:px-6">
        <div className="flex items-center">
          {/* Left side: Timer section */}
            <div className={`flex items-center space-x-2 ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
              <div className="flex items-center justify-center w-8 h-8">
                {timeRemaining < 300 && <AlertTriangle className="h-5 w-5 animate-pulse" />}
              </div>
              <div className="text-2xl font-mono font-bold">{formatTime(timeRemaining)}</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTimer}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title={isRunning ? "Pause timer" : "Start timer"}
              >
                {isRunning ? (
                  <Pause className="h-5 w-5 text-gray-600" />
                ) : (
                  <Play className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={() => {
                    resetTimer()
                    resetTimerAPI()
                    newSocket.emit('reset-timer', session._id)
                }}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Reset timer"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Right side: Action buttons */}
          <div className="relative" ref={dropdownRef}>
                <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                >
                <Code className="mr-2 h-4 w-4 text-gray-500" />
                <span className="mr-2">
                    {languages.find(lang => lang.id === selectedLanguage)?.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {isLanguageDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <ul className="py-1">
                    {languages.map((language) => (
                        <li key={language.id}>
                        <button
                            className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 ${
                            selectedLanguage === language.id ? 'bg-gray-50 font-medium' : ''
                            }`}
                            onClick={() => {
                                setSelectedLanguage(language.id);
                                setCode(session.problemId.defaultCode[language.id])
                                handleChangeLanguage(language.id)
                                setIsLanguageDropdownOpen(false);
                            }}
                        >
                            {language.name}
                        </button>
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
            <div className="flex items-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}>
                    <Send className="mr-2 h-4 w-4"/>
                    Invite
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                onClick={() => setIsTextAreaOpen(!isTextAreaOpen)}>
                    <NotebookPen className="mr-2 h-4 w-4"/>
                    Notes
                </button>
                <button
                onClick={runCode}
                disabled={isCodeRunning}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isCodeRunning
                    ? 'bg-green-100 text-green-800 cursor-wait'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                }`}
                >
                {isCodeRunning ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running...
                    </>
                ) : (
                    <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Code
                    </>
                )}
                </button>
                
                <button
                onClick={saveCode}
                disabled={isSaving}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isSaving
                    ? 'bg-blue-100 text-blue-800 cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
                >
                {isSaving ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                    </>
                ) : (
                    <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                    </>
                )}
            </button>
          </div>
        </div>
      </div>
  );
}