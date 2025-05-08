import { useState } from "react"
import { useNavigate } from "react-router-dom"
const API = import.meta.env.VITE_SERVER_URL;
import Axios from "axios";

export default function Register() {
  const [firstname, setFirstname] = useState<string | null>("")
  const [lastname, setLastname] = useState<string | null>("")
  const [username, setUsername] = useState<string | null>("")
  const [password, setPassword] = useState<string | null>("")
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
        const res = await Axios.post(`${API}/api/auth/register`, { 
            firstname: firstname, 
            lastname: lastname, 
            username: username, 
            password: password 
        })
        const data = res.data
        if (data.message) {
          alert(data.message)
          navigate("/login")
        }
    } catch(err) {
        console.error(err)
    }
  }
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Register for an account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6" onSubmit={handleSignUp}>
              <div>
                <label htmlFor="firstname" className="block text-sm/6 font-medium text-gray-900">
                    First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm/6 font-medium text-gray-900">
                    Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    required
                    autoComplete="username"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Register
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Have an account?{' '}
              <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                Log in
              </a>
            </p>
          </div>
        </div>
      </>
    )
  }