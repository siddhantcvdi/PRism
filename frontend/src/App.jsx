import { Route, Routes, useNavigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";



function App() {
  const nav = useNavigate();
  const {isSignedIn} = useAuth();
  useEffect(()=>{
    if(isSignedIn)
      nav('/dashboard')
    else
      nav('/')
  },[isSignedIn])
  return (
    <div className="w-full h-screen bg-neutral">
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </div>
  )
}

export default App