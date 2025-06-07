// components/AuthWrapper.jsx
import { useEffect, useState, createContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useLocation } from 'react-router-dom'

import { auth } from '../data/UserAuth'
import Loading from '../items/Loading'

const AuthContext = createContext()

export default function AuthWrapper({ children }) {
  const [currentUserID, setUID] = useState(null)
  const [loading, setLoading] = useState(true)


  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const id = user ? user.uid : null
      setUID(id)

      if (!user && location.pathname !== '/loginRegister') {
        navigate('/loginRegister')
      } else if (user && location.pathname === '/loginRegister') {
        navigate('/dashboard')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate, location.pathname])

  if (loading) {
    return(
      <div><Loading status={loading} /></div>)
    }

  return (
    <AuthContext.Provider value={{ currentUserID , navigate }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
