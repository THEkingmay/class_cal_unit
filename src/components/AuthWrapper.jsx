// components/AuthWrapper.jsx
import { useEffect, useState, createContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useLocation } from 'react-router-dom'

import { auth } from '../data/UserAuth'
import Loading from '../items/Loading'

const AuthContext = createContext()   // รวมทุกอย่างไว้ที่ context เพื่อประหยัดโควต้า firestore

export default function AuthWrapper({ children }) {
  const [currentUserID, setUID] = useState(null)
  const [loading, setLoading] = useState(true)
  const [studyPlanData , setPlanData ] = useState([]) // แผนการเรียนยังไงก็ต้องมีอันเดียวฉะนั้นใช้ index 0 เสมอ !!

  const navigate = useNavigate()
  const location = useLocation()

  const fetchUersStudyplan = async () =>{
          try{
              const data = await getUserStudyplan(currentUserID)
              const tmp=[]
              data.forEach(d=>tmp.push({id:d.id , data: d.data()}))            
              setPlanData(tmp)
          }catch(err){
              console.log(err.message)
          }
      }

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        setUID(user.uid)
      }else{
        setUID(null)
        setPlanData([])
      }
      if (!user && location.pathname !== '/loginRegister') {
        navigate('/loginRegister')
      } else if (user && location.pathname === '/loginRegister') {
        navigate('/dashboard')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [navigate, location.pathname])

  useEffect(() => {
    if (currentUserID) {
      fetchUersStudyplan()
    }
  }, [currentUserID])

  if (loading) {
    return(
      <div><Loading status={loading} /></div>)
    }

  return (
    <AuthContext.Provider value={{ currentUserID , navigate , studyPlanData , fetchUersStudyplan}}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
