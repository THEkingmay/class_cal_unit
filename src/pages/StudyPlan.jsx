import { useEffect, useState } from "react"

export default function StudyPlan(){
    const [planDetail , setPlanDetail ] = useState({   // หรือเป็นค่าที่ส่งมาจาก context  getDocs(collection(db,'users' , userid ,'studyPlan'))
        planName:"",
        planAllUnit:""
    })
    const [mainCatagory , setMainCatagory] = useState([])  // หรือเป็นค่าที่ส่งมาจาก context getDocs(collection(db,'users', userid ,'studyPlan' , studyplanId , 'planStructure'))
    const [numOfMain , setNumMain] = useState("")

    const [subCatagory , setSubCatatory ] = useState([]) // หรือเป็นค่าทีส่งมาจาก context ? ใช้ collectionGroup ต้องใส่ไอดีของ planStructureId ไว้เพื่อบอกว่าเป็นหมวดไหน

    useEffect(()=>{
        const timer = setTimeout(()=>{
           let tmp = []
           for(let i=0 ; i< Number(numOfMain) ; i++){
                tmp.push({
                    name:'',
                    allUnit:''
                })
           }
           setMainCatagory(tmp)
        },2000 )

        return ()=>clearTimeout(timer)
    },[numOfMain])

    return(
        <div className="container pt-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary">แผนการเรียน</h1>
            </div>
            <div>
                <form>
                    <div className="shadow-sm p-3">
                        <div className="display-6">รายละเอียด</div>
                        <div>
                            <label>ชื่อคณะสาขา</label>
                            <input value={planDetail.planName} type="text" onChange={(e)=>setPlanDetail((prev)=>({...prev , planName:e.target.value}))} />
                        </div>
                        <div>
                            <label>หน่วยกิตรวมตลอดหลักสูตร</label>
                            <input value={planDetail.planAllUnit} type="number" min={1} onChange={(e)=>setPlanDetail((prev)=>({...prev , planAllUnit:e.target.value}))} />
                        </div>
                    </div>
                    { (planDetail.planAllUnit && planDetail.planName) &&
                        <div className="shadow-sm p-3">
                            <div>หมวดหมู่วิชา</div> 
                            <div>
                                <label >จำนวนหมวดหมู่หลัก</label>
                                <input type="number" onChange={(e)=>setNumMain(e.target.value)} value={numOfMain} />
                            </div>
                            {mainCatagory.length>0 &&
                                <div>
                                    {mainCatagory.map((cat, i) => (
                                    <div key={i} className="mb-3 border rounded p-2">
                                        <div>หมวดหมู่ที่ {i + 1}</div>
                                        <input
                                        type="text"
                                        placeholder="ชื่อหมวดหมู่"
                                        value={cat.name}
                                        onChange={(e) =>
                                            setMainCatagory((prev) =>
                                            prev.map((c, idx) =>
                                                idx === i ? { ...c, name: e.target.value } : c
                                            )
                                            )
                                        }
                                        />
                                        <input
                                        type="number"
                                        min={0}
                                        placeholder="จำนวนหน่วยกิตในหมวดนี้"
                                        value={cat.allUnit}
                                        onChange={(e) =>
                                            setMainCatagory((prev) =>
                                            prev.map((c, idx) =>
                                                idx === i ? { ...c, allUnit: e.target.value } : c
                                            )
                                            )
                                        }
                                        />
                                    </div>
                                    ))}
                                </div>
                            }
                    </div>}
                </form>
            </div>
        </div>
    )
}