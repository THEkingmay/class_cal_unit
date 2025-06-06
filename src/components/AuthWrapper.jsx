// components/AuthWrapper.jsx
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../data/UserAuth'
import Loading from '../items/Loading'

export default function AuthWrapper({ children }) {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && location.pathname !== '/loginRegister') {
        navigate('/loginRegister')   // ถ้ายังไม่ล็อกอินให้เรียกหน้านี้เท่านั้น
      }else if(user && location.pathname ==='/loginRegister'){
        navigate('/dashboard')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [navigate, location.pathname])

  if (loading) return <Loading />

  return <>{children}</>
}
