import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_SERVER_URL;
import Axios from "axios";
import { useUser } from "../hooks/useUser";

export default function Login() {
  const [username, setUsername] = useState<string | null>("")
  const [password, setPassword] = useState<string | null>("")
  const { refreshUser, setRefreshUser } = useUser()
  const Navigate = useNavigate()
  const handleLogIn = async (e) => {
    e.preventDefault()
    try {
        const res = await Axios.post(`${API}/api/auth/login`, { username, password }, 
            {   withCredentials: true, 
                validateStatus: function(status) {
                    return true
                } 
            })
        if (res.data.error) {
          alert(res.data.error)
        }
        
        if (res.data.message) {
          alert(res.data.message)
          const data = res.data
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          setRefreshUser(!refreshUser)
          Navigate("/")
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
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6" onSubmit={handleLogIn}>
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    required
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
                  Sign in
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Do not have an account?{' '}
              <a href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                register
              </a>
            </p>
          </div>
        </div>
      </>
    )
  }