import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { User } from "./types/User"
import { UserContextType } from './types/UserContextType';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import NotFound from './components/404';
import Dashboard from './components/Dashboard';
import CodeEditor from './components/CodeEditor';
import CreateProblem from './components/CreateProblem';
import HomePage from './components/HomePage';
import CreateSession from './components/CreateSession';
export const UserContext = createContext<UserContextType | undefined>(undefined);

export default function App() {
  const [refreshUser, setRefreshUser] = useState<boolean>(false)

  const [user, setUser] = useState<User>(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : '{}';
  });
  const [token, setToken] = useState(() => {
    // Load user from localStorage on initial render
    const storedToken: string = localStorage.getItem("token") || "";
    return storedToken != "" ? storedToken : '{}';
  });


  useEffect(() => {
    const storedUser = localStorage.getItem("user") || '{}';
    const storedToken = localStorage.getItem("token") || "";
    setUser(JSON.parse(storedUser))
    setToken(storedToken)
  }, [refreshUser])

  return (
    <>
      <UserContext.Provider value={{
        user, 
        setUser, 
        token, 
        setToken, 
        refreshUser,
        setRefreshUser,
      }}>
          <Router>
            <Navbar user={user} />
            <Routes>
              <Route path="/" element={ <HomePage user={user}/> } />
              <Route path="/dashboard" element={ <Dashboard/> } />
              <Route path="/register" element={ <Register /> } />
              <Route path="/login" element={ <Login /> } />
              <Route path="/custom-problem" element={ <CreateProblem /> } />
              <Route path="/sessions/:id" element={ <CodeEditor/> } />
              <Route path="/create-session" element={ <CreateSession/> } />
              <Route path="*" element={ <NotFound/> } />
            </Routes>
          </Router>
      </UserContext.Provider>
    </>
  )
}