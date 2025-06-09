import { useEffect, useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../components/AuthWrapper"
import { getStructurePlan ,getSubStructure } from "../data/fireStore"


import Loading from "../items/Loading"
import AlertMessage from "../items/AlertMessage"


export default function StudyPlan(){

    const [isLoad , setLoad ] = useState(false)
    const [alertType , setType ]  = useState("")
    const [alertMsg , setMsg] = useState("")
    const [isInputDisabled , setInputDis] = useState(false)
    const [currMainID , setMainId ]= useState("")

    const {currentUserID,studyPlanData } = useContext(AuthContext)

    const [planDetail , setPlanDetail ] = useState({   // หรือเป็นค่าที่ส่งมาจาก context  getDocs(collection(db,'users' , userid ,'studyPlan'))
        planName:"",
        planAllUnit:""
    })
    
    const [mainCatagory , setMainCat] = useState([])
    // ถ้ามี plan อยู่แล้วจาก context
    const fetchStrutureplan = async ()=>{
        setLoad(true)
        try{
            const data = await getStructurePlan(currentUserID , studyPlanData[0].id)
            const tmp = []
            data.forEach(d=>{
                tmp.push({
                    id:d.id,  // id ของ structure document
                    data:d.data()
                })
            })
            setMainId(tmp[0].id) // ในหน้าแรกของหมวดหมู่ย่อยแสดงของหมวดแรก
            setMainCat(tmp)
        }catch(err){
            setMsg(err.message)
            setType("error")
        }finally{
            setLoad(false)
            setTimeout(()=>{
                setMsg("");setType("")
            },2500)
        }
    }

    const [subCatagory , setSubCat ] = useState([])
    const fetchSubStructure = async () =>{
        setLoad(true)
        try{
            const dataSub = await getSubStructure ()
            let tmp = [] 
            dataSub.forEach(d=>{
                tmp.push({
                    id:d.id,
                    data:d.data()
                })
            })
            setSubCat(tmp)
            console.log(tmp)
        }catch(err){
            setMsg(err.message)
            setType("error")
        }finally{
            setLoad(false)
            setTimeout(()=>{
                setMsg("");setType("")
            },2500)
        }
    }

    useEffect(() => {
        setLoad(true)
        if (studyPlanData.length>0) { // ถ้ามีแผนการเรียน
            console.log(studyPlanData[0])
            setInputDis(true) // ถ้ามีแผนการเรียนจะไม่ให้พิมพ์แก้ไขได้ ถ้าจะแก้ต้องมี modal เปิดปิดมา เรื่องของการ update
            setPlanDetail({
                planName: studyPlanData[0].data.studyplanName,
                planAllUnit: Number(studyPlanData[0].data.allUnit)
            })
            fetchStrutureplan() // ถ้ามีแผนการเรียนให้เอา structure ออกมาด้วย
            fetchSubStructure() // เอาอันย่อยด้วย
        }
        setLoad(false)
    }, [studyPlanData])
    
    
    const ADDALLFIRSTTIME = async () =>{

    }

    return(
        <div className="container pt-5" style={{minHeight:'1000px'}}>
            <Loading status={false}/>
            <AlertMessage type={alertType} msg={alertMsg}/>
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary">แผนการเรียน</h1>
            </div>
            {!isLoad && <div>
                <form>
                    <div className="shadow-sm p-3">
                        <div className="display-6">รายละเอียด</div>
                        <div>
                            <label>ชื่อคณะสาขา</label>
                            <input disabled={isInputDisabled} value={planDetail.planName} type="text" onChange={(e)=>setPlanDetail((prev)=>({...prev , planName:e.target.value}))} />
                        </div>
                        <div>
                            <label>หน่วยกิตรวมตลอดหลักสูตร</label>
                            <input disabled={isInputDisabled} value={planDetail.planAllUnit} type="number" min={1} onChange={(e)=>setPlanDetail((prev)=>({...prev , planAllUnit:Number(e.target.value)}))} />
                        </div>
                    </div>
                    {  (planDetail.planName!=="" && planDetail.planAllUnit>0) &&
                    <div className="p-3 shadow-sm">
                       <div className="display-6">หมวดหมู่</div>
                        <button type="button"  className="btn btn-primary" 
                            onClick={()=>{
                                setMainCat((prev)=>[
                                    ...prev , 
                                    {
                                        id:`${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                                        data:{
                                            structureName:"",
                                            allUnit:""
                                        }
                                    }
                                ])
                            }}
                        >
                            เพิ่มหมวดหมู่{/*เพิ่มหมวดหมู่*/}
                        </button>
                       {mainCatagory.map((cat , i)=>
                        <div key={cat.id}>
                            {i+1} ชื่อหมวดหมู่ 
                            <input type="text"  
                            value={cat?.data?.structureName} 
                            disabled={isInputDisabled}
                            onChange={(e)=>{
                                setMainCat((prev) =>
                                    prev.map((c, idx) =>
                                        idx === i
                                        ? {
                                            ...c,
                                            data: {
                                                ...c.data,
                                                structureName: e.target.value,
                                            },
                                            }
                                        : c
                                    )
                                    );
                            }}
                            />
                            <input type="number"  
                            value={cat?.data?.allUnit} 
                            disabled={isInputDisabled}
                            onChange={(e)=>{
                                setMainCat((prev) =>
                                    prev.map((c, idx) =>
                                        idx === i
                                        ? {
                                            ...c,
                                            data: {
                                                ...c.data,
                                                allUnit:Number( e.target.value),
                                            },
                                            }
                                        : c
                                    )
                                    );
                            }}
                            />
                        </div>
                       )}
                    </div>
                    }
                    { mainCatagory.length>0 && 
                    <div className="p-3 shadow-sm">
                       <div className="display-6">หมวดหมู่ย่อย</div>
                       <div>
                            {mainCatagory.map(cat=>
                                <button onClick={()=>setMainId(cat.id)} type="button" className={`btn btn-outline-primary  ${currMainID === cat.id? 'active' : ""}`} key={cat.id}>{cat.data.structureName} {cat.data.allUnit} หน่วยกิต</button>
                            )}
                       </div>
                       <div>
                            {subCatagory.map((sub)=>{
                                if(currMainID===sub.data.mainId){
                                    return(
                                        <div>{sub.data.subName} : {sub.data.allUnit} หน่วยกิต</div>
                                    )
                                }
                            })}
                       </div>
                    </div>
                    }
                </form>
            </div>}
        </div>
    )
}