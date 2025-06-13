// components/AuthWrapper.jsx
import { useEffect, useState, createContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUserStudyplan  } from '../data/fireStore'
import { getStructurePlan, getSubStructure } from "../data/fireStore";

import { getAllClasses } from '../data/ClassData';

import { auth } from '../data/UserAuth'
import Loading from '../items/Loading'

const AuthContext = createContext()   // รวมทุกอย่างไว้ที่ context เพื่อประหยัดโควต้า firestore ส่วนการเพิ่มลบหรืออับเดตค่อยไปทำในแต่ละหน้า

export default function AuthWrapper({ children }) {
  const [currentUserID, setUID] = useState(null)
  const [currEmail , setCurrEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [studyPlanData , setPlanData ] = useState([]) // แผนการเรียนยังไงก็ต้องมีอันเดียวฉะนั้นใช้ index 0 เสมอ !!

  const navigate = useNavigate()
  const location = useLocation()

  const [mainCatagoryContext , setMainCat] = useState([]);
  const [subCatagoryContext , setSubCat] = useState([]);

  const [allClassContext , setAllClass] = useState([])

  const fetchUersStudyplan = async () =>{
          try{
              const data = await getUserStudyplan(currentUserID)
              const tmp=[]
              data.forEach(d=>tmp.push({id:d.id , data: d.data()}))            
              setPlanData(tmp) 
                          // ใช้ tmp ตรงนี้แทนรอ state update
              if (tmp.length > 0) {
                const main = await getStructurePlan(currentUserID, tmp[0].id)
                setMainCat(main)
              }
              const sub = await getSubStructure(currentUserID, tmp[0].id)
              setSubCat(sub)
              console.log(tmp)
          }catch(err){
              console.log(err.message)
          }
      }

      const fetchUserClasses = async () =>{
        try{
          const data = await getAllClasses(currentUserID)
          setAllClass(data)
          console.log("Get all classes from users")
        }catch(err){
          console.log(err.message)
        }
      }

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        setUID(user.uid)
        setCurrEmail(user.email)
      }else{
        setUID(null)
        setCurrEmail(null)
        setPlanData([])
        setMainCat([])
        setSubCat([])
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
    let hasFetched = false;
    if (currentUserID && !hasFetched) {
      fetchUserClasses()
      fetchUersStudyplan()
      hasFetched = true
    }
  }, [currentUserID]) // after login ถ้าไอดีไม่เปลี่ยน ไม่เรียกเพราะจะได้ประหยัดโควต้าการเรียก firestore
 
  if (loading) {
    return(
      <div><Loading status={loading} /></div>)
    }

  return (
    <AuthContext.Provider value={{fetchUserClasses, allClassContext , currentUserID, currEmail , navigate , studyPlanData  ,mainCatagoryContext  ,subCatagoryContext , fetchUersStudyplan}}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
