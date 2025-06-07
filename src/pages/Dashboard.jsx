import { useEffect , useState} from "react"
import { getUserStudyplan } from "../data/fireStore"
import Loading from "../items/Loading"
import { useContext } from "react"
import { AuthContext } from "../components/AuthWrapper"

export default function Dashbord(){

    const [isLoad , setLoad ] = useState(false)
    const {currentUserID , navigate} = useContext(AuthContext)
    const [studyPlanData , setPlanData ] = useState([])


    const fetchUersStudyplan = async () =>{
        try{
            setLoad(true)
            const data = await getUserStudyplan(currentUserID)
            const tmp=[]
            data.forEach(d=>tmp.push({id:d.id , data: d.data()}))            
            setPlanData(tmp)
        }catch(err){
            console.log(err.message)
        }finally{
            setLoad(false)
        }
    }

    useEffect(()=>{
     fetchUersStudyplan()
    },[])

    return(
        <div className="container p-4 ">
            {!isLoad && 
            <div>
                <div className="display-3 text-center">Dashboard</div>

            </div>
            }
            <Loading status={isLoad}/>
        </div>
    )
}