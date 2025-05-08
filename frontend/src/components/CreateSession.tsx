import { useContext, useEffect, useState } from 'react';
import { Search, ChevronDown, Plus, X, Code, Check } from 'lucide-react';
import { IProblem } from '../types/Problem';
import Axios from 'axios';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_SERVER_URL;

export default function CreateSession() {
  const [sessionTitle, setSessionTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState([]);
  const [showProblemSelector, setShowProblemSelector] = useState(false);
  const [availableProblems, setAvailableProblems] = useState<IProblem[]>([])
  const [language, setLanguage] = useState('python')
  const { token } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    const getAllProblems = async () => {
      try {
          const res = await Axios.get(`${API}/api/problems`,
              { withCredentials: true, 
              headers: {
                  Authorization: `Bearer ${token}`
              }})
  
  
          if (res.data.error) {
              alert(res.data.error)
          }
  
          if (res.data.message) {
              alert(res.data.message)
          }
  
          setAvailableProblems(res.data.problems)
      } catch(e) {
          console.error(e)
      }
    }
    getAllProblems()
  }, [token])

  // Filter problems based on search query
  const filteredProblems = availableProblems.filter((problem) => 
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addProblem = (problem) => {
    if (!selectedProblem.some((p: IProblem) => p._id === problem._id)) {
      setSelectedProblem([...selectedProblem, problem]);
      setShowProblemSelector(false)
    }
  };

  const removeProblem = (problemId: string) => {
    setSelectedProblem(selectedProblem.filter((p: IProblem) => p._id !== problemId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const res = await Axios.post(`${API}/api/sessions`,{
            sessionTitle,
            duration,
            language,
            selectedProblem,
            }, 
            {   headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true, 
          })

        if (res.data.error) {
            alert(res.data.error)
        }

        if (res.data.message) {
          alert(res.data.message)
          navigate("/dashboard")
        }
    } catch(e) {
        console.error(e)
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Session</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Session Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Session Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Software Engineer - Round 1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1">
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Duration (minutes)*
                            </label>
                            <div className='grid grid-cols-2 items-center gap-3'>
                                <input
                                    type="number"
                                    id="duration"
                                    min="0"
                                    step="15"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <span className="text-sm text-gray-500">Set the duration to 0 for a freestyle session</span>
                            </div>
                        </div>
                  </div>
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Programming Language*
                    </label>
                    <select name="language" id="language" 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="Python">python</option>
                        <option value="JavaScript">javaScript</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Problem Selection */}
              <div className="pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Problem Selection (Optional)</h2>
                
                {/* Selected Problems List */}
                {selectedProblem.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Problems:</h3>
                    <div className="space-y-2">
                      {selectedProblem.map((problem: IProblem) => (
                        <div 
                          key={problem._id} 
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md"
                        >
                          <div className="flex items-center">
                            <Code className="h-5 w-5 text-blue-500 mr-2" />
                            <div>
                              <span className="font-medium">{problem.title}</span>
                              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                                problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeProblem(problem._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Problem Button */}
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowProblemSelector(!showProblemSelector)}
                  >
                    {showProblemSelector ? (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" /> Hide Problem Selector
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Add Problems
                      </>
                    )}
                  </button>
                  <span className="ml-3 text-sm text-gray-500">You can add only add one problem or leave empty for a freestyle session</span>
                </div>

                {/* Problem Selector */}
                {showProblemSelector && (
                  <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Search problems by title or tag..."
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {filteredProblems.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {filteredProblems.map((problem) => (
                            <li 
                              key={problem._id} 
                              className="hover:bg-gray-50"
                            >
                              <div className="flex items-center justify-between px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{problem.title}</p>
                                  <div className="flex items-center mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {problem.difficulty}
                                    </span>
                                    <div className="ml-2 flex flex-wrap">
                                      {problem.tags.map(tag => (
                                        <span key={tag} className="text-xs text-gray-500 mr-2">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addProblem(problem)}
                                    disabled={selectedProblem.length >= 1 || selectedProblem.some(p => p._id === problem._id) }

                                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                                        selectedProblem.some(p => p._id === problem._id)
                                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    } ${
                                        selectedProblem.length >= 1 ? 'cursor-not-allowed' : ''
                                    }`}
                                >
                                  {selectedProblem.some(p => p._id === problem._id) ? (
                                    <span className="flex items-center">
                                      <Check className="h-4 w-4 mr-1" /> Selected
                                    </span>
                                  ) : (
                                    'Select'
                                  )}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No problems found matching your search.
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Showing {filteredProblems.length} of {availableProblems.length} problems
                      </span>
                      <a href="/custom-problem" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Create new problem
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}