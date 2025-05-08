import { useContext, useEffect, useState } from 'react';
import { User, Code, Search, PlusCircle, Tag, BarChart2, ChevronDown, Star, Trash, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { UserContext } from '../App';
import { CodingProblemsState, IProblem } from '../types/Problem';
import { ISession, SessionState } from '../types/Session';
const API = import.meta.env.VITE_SERVER_URL;

export default function Dashboard() {
  // Main state management
  const [activeMainTab, setActiveMainTab] = useState('problems');
  const [activeProblemTab, setActiveProblemTab] = useState('all');
  const [selectedProblem, setSelectedProblem] = useState<IProblem | null>(null);
  const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [activeSessionTab, setActiveSessionTab] = useState('all');
  const [refreshProblems, setRefreshProblems] = useState<boolean>(false)
  const [refreshSessions, setRefreshSessions] = useState<boolean>(false)
  const { token } = useContext(UserContext)
  const [codingProblems, setCodingProblems] = useState<CodingProblemsState>({
        all: [],
        favorites: [],
        custom: []
    })

  const [sessions, setSessions] = useState<SessionState>({
    all: [],
    favorites: []
  })

  const getAllProblems = async () => {
    try {
      const res = await Axios.get(`${API}/api/problems`,
          { withCredentials: true, 
          headers: {
              Authorization: `Bearer ${token}`
          },
          validateStatus: function(status) {
              return true
          }})
          if (res.data.error) {
              alert(res.data.error)
          }
  
          if (res.data.message) {
              alert(res.data.message)
          }
  
          setCodingProblems((problems) => ({
              ...problems,
              all: res.data.problems,
              custom: problems.all.filter((problem) => problem.isCustom === true),
              favorites: problems.all.filter((problem) => problem.isFavorite === true),
          }))
    } catch(e) {
      console.error(e)
    }
  }

  const getAllSessions = async () => {
    try {
      const res = await Axios.get(`${API}/api/sessions`,
          { withCredentials: true, 
          headers: {
              Authorization: `Bearer ${token}`
          },
          validateStatus: function(status) {
              return true
          }})
          if (res.data.error) {
              alert(res.data.error)
          }
  
          if (res.data.message) {
              alert(res.data.message)
          }
  
          setSessions((sessions) => ({
              ...sessions,
              all: res.data.sessions,
              favorites: sessions.all.filter((session) => session.isFavorite === true),
          }))
    } catch(e) {
      console.error(e)
    }
  }
 // get all the problems
  useEffect(() => {
    const id = selectedProblem?._id
    getAllProblems()
    const problem = codingProblems.all.filter(problem => problem._id === id)
    setSelectedProblem(problem[0])
  }, [refreshProblems])

  // get all the sessions
  useEffect(() => {
    getAllSessions()
  }, [refreshSessions])

  // refresh every time the problems tab changes
  useEffect(() => {
    setCodingProblems((problems) => ({
        ...problems,
        custom: problems.all.filter((problem) => problem.isCustom === true),
        favorites: problems.all.filter((problem) => problem.isFavorite === true),
    }))
  }, [activeProblemTab])

  // refresh every time the sessions tab changes
  useEffect(() => {
    setSessions((sessions) => ({
        ...sessions,
        favorites: sessions.all.filter((session) => session.isFavorite === true),
    }))
  }, [activeSessionTab])

  //toggle problem favorite
  const handleProblemFavorite = async (problemId: string, isFavorite: boolean) => {
    try {
        const res = await Axios.put(`${API}/api/problems/${problemId}/favorite`,
            { isFavorite },
            { withCredentials: true, 
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: function(status) {
                return true
            }})
        if (res.data.error) {
            alert(res.data.error)
        }
        setRefreshProblems(!refreshProblems)
    } catch(e) {
        console.error(e)
    }
  }

  //toggle session favorite
  const handleSessionFavorite = async (sessionId: string, isFavorite: boolean) => {
    try {
        const res = await Axios.put(`${API}/api/sessions/${sessionId}/favorite`,
            { isFavorite },
            { withCredentials: true, 
            headers: {
                Authorization: `Bearer ${token}`
            },
            validateStatus: function(status) {
                return true
            }})
        if (res.data.error) {
            alert(res.data.error)
        }
        setRefreshSessions(!refreshSessions)
    } catch(e) {
        console.error(e)
    }
  }

  const handleSelectProblem = (problem: IProblem) => {
    setSelectedProblem(problem);
  };

  // delete a problem if it's a custom one
  const handleDeletProblem = async (problemId: string) => {
    try {
        const res = await Axios.delete(`${API}/api/problems/${problemId}`, 
            { withCredentials: true, 
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        )

        if (res.data.error) {
            alert(res.data.error)
        }

        if (res.data.message) {
            alert(res.data.message)
            setRefreshProblems(!refreshProblems)
        }
    } catch(e) {
        console.error(e)
    }
  }

  // delete a session
  const handleDeleteSession = async (sessionId: string) => {
    try {
        const res = await Axios.delete(`${API}/api/sessions/${sessionId}`, 
            { withCredentials: true, 
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        )

        if (res.data.error) {
            alert(res.data.error)
        }

        if (res.data.message) {
            alert(res.data.message)
            setRefreshSessions(!refreshSessions)
        }
    } catch(e) {
        console.error(e)
    }
  }

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white">
        <div className="p-4">
          <nav>
            <ul className="space-y-2">
              <li 
                className={`p-2 hover:bg-blue-600 rounded cursor-pointer ${activeMainTab === 'problems' ? 'bg-blue-500' : ''}`}
                onClick={() => setActiveMainTab('problems')}
              >
                <div className="flex items-center">
                  <Code className="mr-3" size={18} />
                  <span>Coding Problems</span>
                </div>
              </li>
              <li className={`p-2 hover:bg-blue-600 rounded cursor-pointer ${activeMainTab === 'sessions' ? 'bg-blue-500' : ''}`}
              onClick={() => setActiveMainTab('sessions')}>
                <div className="flex items-center">
                  <User className="mr-3" size={18} />
                  <span>Sessions</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      {activeMainTab === 'problems' && <div className="flex-1 overflow-auto">
        <main className="p-6">
            <>
              {/* Problems Tab Content */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveProblemTab('all')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeProblemTab === 'all'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      All Problems
                    </button>
                    <button
                      onClick={() => setActiveProblemTab('favorites')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeProblemTab === 'favorites'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Favorites
                    </button>
                    <button
                      onClick={() => setActiveProblemTab('custom')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeProblemTab === 'custom'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Custom Problems
                    </button>
                  </nav>
                </div>
              </div>

              {/* Search and filter tools */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64 relative">
                  <input
                    type="text"
                    placeholder="Search problems..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowDifficultyFilter(!showDifficultyFilter)}
                    className="px-4 py-2 border rounded-md bg-white flex items-center gap-2"
                  >
                    <BarChart2 size={16} />
                    <span>Difficulty</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showDifficultyFilter && (
                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 right-0">
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="easy" className="mr-2" />
                          <label htmlFor="easy" className="text-green-500">Easy</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="medium" className="mr-2" />
                          <label htmlFor="medium" className="text-yellow-500">Medium</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="hard" className="mr-2" />
                          <label htmlFor="hard" className="text-red-500">Hard</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowTagFilter(!showTagFilter)}
                    className="px-4 py-2 border rounded-md bg-white flex items-center gap-2"
                  >
                    <Tag size={16} />
                    <span>Tags</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showTagFilter && (
                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 right-0">
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="array" className="mr-2" />
                          <label htmlFor="array">Array</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="string" className="mr-2" />
                          <label htmlFor="string">String</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="tree" className="mr-2" />
                          <label htmlFor="tree">Tree</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="linkedlist" className="mr-2" />
                          <label htmlFor="linkedlist">Linked List</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="dp" className="mr-2" />
                          <label htmlFor="dp">Dynamic Programming</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {activeProblemTab === 'custom' && (
                <Link to={"/custom-problem"}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700">
                    <PlusCircle size={16} />
                    <span>Create Problem</span>
                  </button>
                </Link>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Problems List */}
                <div className="lg:col-span-1">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h2 className="text-lg font-medium">
                        {activeProblemTab === 'all' && 'All Problems'}
                        {activeProblemTab === 'favorites' && 'Favorite Problems'}
                        {activeProblemTab === 'custom' && 'Custom Problems'}
                      </h2>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                        {codingProblems[activeProblemTab as keyof typeof codingProblems] && codingProblems[activeProblemTab as keyof typeof codingProblems].length} problems
                      </span>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {codingProblems[activeProblemTab as keyof typeof codingProblems] && codingProblems[activeProblemTab as keyof typeof codingProblems].map((problem: IProblem) => (
                        <li key={problem._id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${
                            selectedProblem?._id === problem._id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleSelectProblem(problem)}
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{problem.title}</p>
                              <div className="flex gap-2 mt-1">
                                <span className={`text-sm ${difficultyColor(problem.difficulty)}`}>
                                  {problem.difficulty}
                                </span>
                                <span className="text-sm text-gray-500">
                                  • {problem.category}
                                </span>
                              </div>
                            </div>
                            {activeProblemTab !== 'favorites' && (
                              <Star className={`${problem.isFavorite ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`} fill={`${problem.isFavorite ? "oklch(85.2% 0.199 91.936)" : "white"}`} size={18} 
                              onClick={() => handleProblemFavorite(problem._id, problem.isFavorite)}/>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {problem.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Problem Details */}
                <div className="lg:col-span-2">
                  {selectedProblem ? (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-medium">{selectedProblem.title}</h2>
                            <div className="flex gap-3 mt-1">
                              <span className={`${difficultyColor(selectedProblem.difficulty)}`}>
                                {selectedProblem.difficulty}
                              </span>
                              <span className="text-gray-600">
                                {selectedProblem.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-gray-500 hover:text-yellow-500">
                              <Star  size={18} className={`${selectedProblem.isFavorite ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`} fill={`${selectedProblem.isFavorite ? "oklch(85.2% 0.199 91.936)" : "white"}`} onClick={() => handleProblemFavorite(selectedProblem._id, selectedProblem.isFavorite)}/>
                            </button>
                            {selectedProblem.isCustom && <button
                                type="button"
                                className="inline-flex items-center cursor-pointer px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => handleDeletProblem(selectedProblem._id)}
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </button>}
                          </div>
                        </div>

                        <div className="mt-6">
                          <h3 className="text-lg font-medium">Problem Description</h3>
                          <div className="mt-2 prose max-w-none">
                            {selectedProblem && (
                              <div>
                                <p>{selectedProblem.description}</p>
                                
                                {selectedProblem.exampleCases && <div>
                                        {selectedProblem.exampleCases.map((exampleCase, index) => {
                                        return (
                                            <div key={index}>
                                                <h4 className="text-base font-medium mt-4">{`Example ${index + 1}:`}</h4>
                                                <pre className="bg-gray-50 p-2 rounded mt-2 whitespace-pre-wrap break-words overflow-x-auto text-sm">
                                                    <p><strong>Input:</strong>{ exampleCase.input }</p>
                                                    <p><strong>Output:</strong>{ exampleCase.output }</p>
                                                    {exampleCase.Explanation && <p className="break-words whitespace-normal"><strong>Explanation:</strong>{ exampleCase.Explanation }</p>}
                                                </pre>
                                            </div>
                                        )
                                    })}
                                    </div>}
                                
                                <h4 className="text-base font-medium mt-4">Constraints:</h4>
                                {selectedProblem && <ul className="list-disc pl-5 mt-2">
                                    {selectedProblem.constraints.map((constraint, index) => {
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

                        <div className="mt-8 border-t pt-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Problem Statistics</h3>
                          </div>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4">
                              <p className="text-sm text-gray-500">Used in Interviews</p>
                              <p className="mt-1 text-xl font-semibold">{selectedProblem.usage} times</p>
                            </div>
                            <div className="border rounded-lg p-4">
                              <p className="text-sm text-gray-500">Last Used</p>
                              <p className="mt-1 text-xl font-semibold">{selectedProblem.lastUsed}</p>
                            </div>
                            <div className="border rounded-lg p-4">
                              <p className="text-sm text-gray-500">Avg. Completion Rate</p>
                              <p className="mt-1 text-xl font-semibold">
                                {selectedProblem.difficulty === 'Easy' ? '78%' : 
                                 selectedProblem.difficulty === 'Medium' ? '52%' : '31%'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Use in Interview
                          </button>
                          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                            Preview Solution
                          </button>
                          {activeProblemTab === 'custom' && (
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                              Edit Problem
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-64">
                      <p className="text-gray-500">Select a problem to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </>
        </main>
    </div>}

    {activeMainTab === 'sessions' && <div className="flex-1 overflow-auto">
        <main className="p-6">
            <>
              {/* Problems Tab Content */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveSessionTab('all')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeSessionTab === 'all'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      All Sessions
                    </button>
                    <button
                      onClick={() => setActiveSessionTab('favorites')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeSessionTab === 'favorites'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Favorites
                    </button>
                  </nav>
                </div>
              </div>

              {/* Search and filter tools */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64 relative">
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                <div>
                  <Link to={"/create-session"}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700">
                      <PlusCircle size={16} />
                      <span>Create Session</span>
                    </button>
                  </Link>
                  {showDifficultyFilter && (
                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 right-0">
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="easy" className="mr-2" />
                          <label htmlFor="easy" className="text-green-500">Easy</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="medium" className="mr-2" />
                          <label htmlFor="medium" className="text-yellow-500">Medium</label>
                        </div>
                      </div>
                      <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center">
                          <input type="checkbox" id="hard" className="mr-2" />
                          <label htmlFor="hard" className="text-red-500">Hard</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1">
                {/* Sessions List */}
                <div className="lg:col-span-1">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h2 className="text-lg font-medium">
                        {activeSessionTab === 'all' && 'All Sessions'}
                        {activeSessionTab === 'favorites' && 'Favorite Sessions'}
                      </h2>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                        {sessions[activeSessionTab as keyof typeof sessions] && sessions[activeSessionTab as keyof typeof sessions].length} sessions
                      </span>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {sessions[activeSessionTab as keyof typeof sessions] && sessions[activeSessionTab as keyof typeof sessions].map((session: ISession) => (
                        <li key={session._id}
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{session.sessionTitle}</p>
                              <div className="flex gap-2 mt-1">
                              </div>
                            </div>
                            <div className='flex gap-2 items-center'>
                              {activeSessionTab !== 'favorites' && (
                                <Star className={`${session.isFavorite ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`} fill={`${session.isFavorite ? "oklch(85.2% 0.199 91.936)" : "white"}`} size={18} 
                                onClick={() => handleSessionFavorite(session._id, session.isFavorite)}/>
                              )}
                              <button
                                  type="button"
                                  className="inline-flex items-center cursor-pointer px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  onClick={() => handleDeleteSession(session._id)}
                              >
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                              </button>
                              <Link to={`/sessions/${session._id}/code`}>
                                <button className="inline-flex gap-2 items-center cursor-pointer px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Rocket size={18} />
                                    Launch session
                                </button>
                            </Link>
                            </div>
                          </div>
                          {session.problemId && <div className="flex justify-between">
                            <div>
                              <div className='flex gap-1 items-center'>
                                <h2 className='font-medium'>Problem</h2>
                                <p>•</p>
                                <p>{session.problemId.title}</p>
                              </div>
                              <div className="flex gap-2 mt-1">
                                <span className={`text-sm ${difficultyColor(session.problemId.difficulty)}`}>
                                  {session.problemId.difficulty}
                                </span>
                                <span className="text-sm text-gray-500">
                                  • {session.problemId.category}
                                </span>
                              </div>
                            </div>
                          </div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
        </main>
      </div>}    
    </div>
  );
}