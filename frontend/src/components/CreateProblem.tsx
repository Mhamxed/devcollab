import { useContext, useState } from 'react';
import { ChevronDown, Save, Trash, Plus, Code } from 'lucide-react';
import { UserContext } from '../App';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_SERVER_URL;

export default function CreateProblem() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [selectedLanguage, setSelectedLanguage] = useState('javaScript');
  const [category, setCategory] = useState('Array')
  const [exampleCases, setExampleCases] = useState([
    { input: '', output: '', explanation: '' }
  ]);
  const [defaultCode, setDefaultCode] = useState({
    javascript: '// Your JavaScript starter code here\nfunction solution(input) {\n  // Write your code here\n  \n  return output;\n}',
    python: '# Your Python starter code here\ndef solution(input):\n    # Write your code here\n    \n    return output',
  });
  const [testCases, setTestCases] = useState([
    { input: '', expectedOutput: '', hidden: false }
  ]);
  const [selectedTab, setSelectedTab] = useState('details');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token } = useContext(UserContext)
  const navigate = useNavigate()

  const addExampleCase = () => {
    setExampleCases([...exampleCases, { input: '', output: '', explanation: '' }]);
  };

  const updateExampleCase = (index: number, field: string, value: string) => {
    const updatedCases = [...exampleCases];
    updatedCases[index][field] = value;
    setExampleCases(updatedCases);
  };

  const removeExampleCase = (index: number) => {
    if (exampleCases.length > 1) {
      const updatedCases = [...exampleCases];
      updatedCases.splice(index, 1);
      setExampleCases(updatedCases);
    }
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', hidden: false }]);
  };

  const addConstraint = () => {
    setConstraints([...constraints, '']);
  };

  const addtag = () => {
    setTags([...tags, '']);
  };

  const updateTestCase = (index: number, field: string, value: string) => {
    const updatedCases = [...testCases];
    updatedCases[index][field] = field === 'hidden' ? !updatedCases[index].hidden : value;
    setTestCases(updatedCases);
  };

  const updateConstraint = (index: number, value: string) => {
    const updatedConstraints = [...constraints];
    updatedConstraints[index] = value;
    setConstraints(updatedConstraints);
  };

  const updatetags = (index: number, value: string) => {
    const updatedtags = [...tags];
    updatedtags[index] = value;
    setTags(updatedtags);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      const updatedCases = [...testCases];
      updatedCases.splice(index, 1);
      setTestCases(updatedCases);
    }
  };

  const removeConstraints = (index: number) => {
    if (constraints.length > 1) {
        const updatedConstraints = [...constraints];
        updatedConstraints.splice(index, 1);
        setConstraints(updatedConstraints);
      }
  }

  const removeTags = (index: number) => {
    if (tags.length > 1) {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const res = await Axios.post(`${API}/api/problems`, {
            title,
            difficulty,
            category,
            description,
            constraints,
            exampleCases,
            defaultCode,
            testCases,
            tags
            }, 
            {   headers: {
                Authorization: `Bearer ${token}`
            },
                withCredentials: true, 
                validateStatus: function(status) {
                    return true
                } 
            })
        const data = res.data
        if (data.error) {
            alert(data.error)
        }

        if (data.message) {
          alert(data.message)
        }
    } catch(err) {
        console.error(err)
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Problem</h1>

        <div className="bg-white shadow rounded-lg">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('details')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Problem Details
            </button>
            <button
              onClick={() => setSelectedTab('description')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'description'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setSelectedTab('examples')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'examples'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Example Cases
            </button>
            <button
              onClick={() => setSelectedTab('starter')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'starter'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Starter Code
            </button>
            <button
              onClick={() => setSelectedTab('test')}
              className={`px-6 py-4 text-sm font-medium ${
                selectedTab === 'test'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Test Cases
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Problem Details */}
            {selectedTab === 'details' && (
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Problem Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a descriptive title for the problem"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                      Difficulty Level*
                    </label>
                    <div className="relative mt-1">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <span className={`${
                          difficulty === 'Easy' ? 'text-green-600' : 
                          difficulty === 'Medium' ? 'text-yellow-600' : 
                          difficulty === 'Hard' ? 'text-red-600' : ""
                        } font-medium`}>
                          {difficulty}
                        </span>
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </button>
                      
                      {dropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md">
                          <ul className="py-1">
                            {['Easy', 'Medium', 'Hard'].map((level) => (
                              <li key={level}>
                                <button
                                  type="button"
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                    difficulty === level ? 'font-medium bg-gray-50' : ''
                                  }`}
                                  onClick={() => {
                                    setDifficulty(level);
                                    setDropdownOpen(false);
                                  }}
                                >
                                  <span className={`${
                                    level === 'Easy' ? 'text-green-600' : 
                                    level === 'Medium' ? 'text-yellow-600' : 
                                    level === 'Hard' ? 'text-red-600' : ""
                                  } font-medium`}>
                                    {level}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category*
                    </label>
                    <select name="category" id="category"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)
                      }}>
                      <option value="Array">Array</option>
                      <option value="String">String</option>
                      <option value="Tree">Tree</option>
                      <option value="Linked List">Linked List</option>
                      <option value="Trie">Trie</option>
                      <option value="Graph">Graph</option>
                      <option value="Heap">Heap</option>
                      <option value="Dynamic Programming">Dynamic Programming</option>
                    </select>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                    <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                    <button
                    type="button"
                    onClick={addtag}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Tag
                  </button>
                </div>

                {tags && tags.map((tag, index) => {
                    return (
                        <div key={index}>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                                {`tag ${index + 1}`}
                            </label>
                            <div className='flex justify-between items-center gap-2'>
                                <input
                                    id="tags"
                                    value={tag}
                                    onChange={(e) => updatetags(index, e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Dynamic Programming"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeTags(index)}
                                    className="text-red-600 hover:text-red-800"
                                    disabled={tags.length === 1}
                                >
                                    <Trash className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )
                })}
              </div>
            )}

            {/* Problem Description */}
            {selectedTab === 'description' && (
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Problem Description*
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the problem in detail. You can use Markdown syntax."
                    required
                  />
                </div>
                {/* Constriants section */}
                <div className='flex justify-between items-center'>
                    <h3 className="text-lg font-medium text-gray-900">Constraints</h3>
                    <button
                    type="button"
                    onClick={addConstraint}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Constraint
                  </button>
                </div>

                {constraints && constraints.map((constraint, index) => {
                    return (
                        <div key={index}>
                            <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">
                                {`Constraint ${index + 1}`}
                            </label>
                            <div className='flex justify-between items-center gap-2'>
                                <input
                                    id="constraints"
                                    value={constraint}
                                    onChange={(e) => updateConstraint(index, e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 1 ≤ n ≤ 10^5"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeConstraints(index)}
                                    className="text-red-600 hover:text-red-800"
                                    disabled={constraints.length === 1}
                                >
                                    <Trash className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )
                })}
              </div>
            )}

            {/* Example Cases */}
            {selectedTab === 'examples' && (
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Example Cases</h3>
                  <button
                    type="button"
                    onClick={addExampleCase}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Example
                  </button>
                </div>

                {exampleCases.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between">
                      <h4 className="text-md font-medium text-gray-900">Example {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeExampleCase(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={exampleCases.length === 1}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Input*</label>
                        <textarea
                          rows={3}
                          value={example.input}
                          onChange={(e) => updateExampleCase(index, 'input', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Example input"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Output*</label>
                        <textarea
                          rows={3}
                          value={example.output}
                          onChange={(e) => updateExampleCase(index, 'output', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Expected output"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Explanation</label>
                        <textarea
                          rows={3}
                          value={example.explanation}
                          onChange={(e) => updateExampleCase(index, 'explanation', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Explanation of the example"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Starter Code */}
            {selectedTab === 'starter' && (
              <div className="p-6 space-y-6">
                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${selectedLanguage == 'javaScript' ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700" }`}
                    onClick={() => setSelectedLanguage('javaScript')}
                  >
                    JavaScript
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${selectedLanguage == 'python' ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700" }`}
                    onClick={() => setSelectedLanguage('python')}
                  >
                    Python
                  </button>
                </div>

                {selectedLanguage === 'javaScript' && <div>
                  <label htmlFor="defaultCode" className="block text-sm font-medium text-gray-700">
                    JavaScript Starter Code
                  </label>
                  <div className="mt-1 relative border border-gray-300 rounded-md bg-gray-50">
                    <div className="p-2 bg-gray-100 border-b border-gray-200 flex items-center">
                      <Code className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-xs font-medium text-gray-600">JavaScript</span>
                    </div>
                    <textarea
                      id="defaultCode"
                      rows={12}
                      value={defaultCode.javascript}
                      onChange={(e) => setDefaultCode({...defaultCode, javascript: e.target.value})}
                      className="block w-full p-3 bg-gray-50 font-mono text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      spellCheck="false"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Provide starter code that candidates will begin with. Include function signatures, comments, etc.
                  </p>
                </div>}
                {selectedLanguage === 'python' && <div>
                  <label htmlFor="defaultCode" className="block text-sm font-medium text-gray-700">
                    Python Starter Code
                  </label>
                  <div className="mt-1 relative border border-gray-300 rounded-md bg-gray-50">
                    <div className="p-2 bg-gray-100 border-b border-gray-200 flex items-center">
                      <Code className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-xs font-medium text-gray-600">Python</span>
                    </div>
                    <textarea
                      id="defaultCode"
                      rows={12}
                      value={defaultCode.python}
                      onChange={(e) => setDefaultCode({...defaultCode, python: e.target.value})}
                      className="block w-full p-3 bg-gray-50 font-mono text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      spellCheck="false"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Provide starter code that candidates will begin with. Include function signatures, comments, etc.
                  </p>
                </div>}
              </div>
            )}

            {/* Test Cases */}
            {selectedTab === 'test' && (
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Test Cases</h3>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Test Case
                  </button>
                </div>

                {testCases.map((test, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between">
                      <h4 className="text-md font-medium text-gray-900">Test Case {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={testCases.length === 1}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Input*</label>
                        <textarea
                          rows={3}
                          value={test.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Test input"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expected Output*</label>
                        <textarea
                          rows={3}
                          value={test.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Expected output"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSubmit}
              >
                <Save className="mr-2 h-4 w-4" /> Save Problem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}