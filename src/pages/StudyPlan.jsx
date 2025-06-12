import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthWrapper";
import {  addUserStudyplanFields , addMainStructureToPlan , addSubStructureToMain} from "../data/fireStore";

import Loading from "../items/Loading";
import AlertMessage from "../items/AlertMessage";

export default function StudyPlan() {
    const [isLoad, setLoad] = useState(false);
    const [alertType, setType] = useState("");
    const [alertMsg, setMsg] = useState("");
    const [isInputDisabled, setInputDis] = useState(false);
    const [currMainID, setCurrMainId] = useState("");

    const { currentUserID, studyPlanData , fetchUersStudyplan , mainCatagoryContext , subCatagoryContext } = useContext(AuthContext);

    const [planDetail, setPlanDetail] = useState({
        planName: "",
        planAllUnit: 0,
    });

    const [mainCatagory, setMainCat] = useState([]);
    const [subCatagory, setSubCat] = useState([]);

    const handleMainCatagoryInput = (index, field, value) => {
        const newMainCat = [...mainCatagory];
        const updatedValue = field === "allUnit" ? Number(value || 0) : value;
        newMainCat[index].data[field] = updatedValue;

        // คำนวณหน่วยกิตรวม
        const totalMainUnit = newMainCat.reduce((sum, item) => sum + Number(item.data.allUnit || 0), 0);

        if (totalMainUnit > planDetail.planAllUnit) {
            newMainCat[index].data['allUnit'] = 0
            setMainCat(newMainCat);
            setType("error");
            setMsg("หน่วยกิตรวมของหมวดหมู่หลักเกินจากแผนการเรียนแล้ว");
            setTimeout(() => {
                setType(""); setMsg("");
            }, 3000);
            return;
        }

        setMainCat(newMainCat);
    };
    const [tmpSubStruct, setTmpSub] = useState({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        data: {
            allUnit: 0,
            mainId: "",
            subName: ""
        }
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTmpSub(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: name === "allUnit" ? Number(value || 0) : value
            }
        }));
    };
    const submitAddSub = () => {
        const { allUnit, mainId, subName } = tmpSubStruct.data;

        if (!allUnit || !mainId || !subName.trim()) {
            setType('error');
            setMsg("กรุณากรอกข้อมูลให้ครบ");
            setTimeout(() => { setType(""); setMsg(""); }, 3000);
            return;
        }

        const mainAllUnit = mainCatagory.find(m => m.id === mainId)?.data?.allUnit || 0;
        const arraySameMain = subCatagory.filter(s => s.data.mainId === mainId);
        const totalUnit = arraySameMain.reduce((sum, s) => sum + Number(s.data.allUnit || 0), allUnit);

        if (totalUnit > mainAllUnit) {
            setType('error');
            setMsg("หน่วยกิตรวมเกิน");
            setTimeout(() => { setType(""); setMsg(""); }, 3000);
            return;
        }

        setSubCat(prev => [...prev, tmpSubStruct]);
        setCurrMainId(mainId);
        setTmpSub({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            data: {
                allUnit: 0,
                mainId: "",
                subName: ""
            }
        });

        const modalElement = document.getElementById('subStructModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        setType('success');
        setMsg("เพิ่มหมวดหมู่ย่อยแล้ว");
        setTimeout(() => { setType(""); setMsg(""); }, 3000);
    };
    const SaveAllAtFirsttime = async (e)=>{
        e.preventDefault()
        console.log(planDetail.planAllUnit===0 , planDetail.planName , mainCatagory.length===0)
        if(planDetail.planAllUnit===0 || planDetail.planName==='' || mainCatagory.length===0){
            setMsg("กรอกข้อมูลหลักสูตรให้ครบ")
            setType("error")
            setTimeout(()=>{
                setMsg("")
                setType("")
            },3000)
            return
        }
        try{
            setLoad(true)
              // เพิ่ม planDetail ได้ planId
            // เพิ่ม structure ด้วย planId ทีไ่ด้ โดยในช่องแต่ช่องของ mainCatagoty ที่มี id , data 
            // เพิ่ม subStruc ด้วย structId ที่อยู่ใน field ของ data และมี subId ใน id  
            // จากนั้นไปเรียก fetchPlan อีกครั้งนึงเพื่อรีเฟรช ใน AuthContext

            const planId= await addUserStudyplanFields(currentUserID , planDetail)
            await addMainStructureToPlan(currentUserID , planId , mainCatagory)
            await addSubStructureToMain(currentUserID , planId , subCatagory)

            fetchUersStudyplan() // โหลดใหม่อีกครั้งหลังบันทึกแล้ว

            setMsg("บันทึกทั้งหมดสำเร็จ")
            setType("success")
        }catch(err){
            setMsg(err.message)
            setType("error")
        }finally{
            setLoad(false)
            setTimeout(()=>{
                setMsg("")
                setType("")
            },3000)
        }
    }

    
    useEffect(() => {
        setLoad(true);
        if (studyPlanData.length > 0) {
            setInputDis(true);
            setPlanDetail({
                planName: studyPlanData[0].data.planName,
                planAllUnit: Number(studyPlanData[0].data.planAllUnit || 0),
            });
        }
        setLoad(false);
    }, [studyPlanData]);
    useEffect(() => {
        setMainCat(mainCatagoryContext);
    }, [mainCatagoryContext]);

    useEffect(() => {
        setSubCat(subCatagoryContext);
    }, [subCatagoryContext]);

    const [selMainIdToDelete , setMainDel] = useState({
        id:'',
        name:''
    })
    const handleDeleteMainCat = () =>{
        const newMain = []
        mainCatagory.forEach(main=>{
            if(main.id!==selMainIdToDelete.id)newMain.push(main)
        })
        const newSub = [] 
        subCatagory.forEach(sub => {
            if(sub.mainId!==selMainIdToDelete.id)newSub.push(sub)
        })
        
        setMainCat(newMain)
        setSubCat(newSub)

        setMainDel({
            id:'',name:''
        })

        const modalElement = document.getElementById('deleteMain');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    }


    return (
        <div className="container pt-5">
            <Loading status={isLoad} />
            <AlertMessage type={alertType} msg={alertMsg} />

            <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary">แผนการเรียน</h1>
            </div>

            {!isLoad && (
            <form>
                {/* รายละเอียดแผน */}
                <div className="shadow-sm p-4 mb-4 bg-white rounded">
                <h2 className="h4 mb-3">รายละเอียด</h2>
                <div className="mb-3">
                    <label className="form-label">ชื่อคณะสาขา</label>
                    <input
                    disabled={isInputDisabled}
                    value={planDetail.planName}
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                        setPlanDetail((prev) => ({ ...prev, planName: e.target.value }))
                    }
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">หน่วยกิตรวมตลอดหลักสูตร</label>
                    <input
                    disabled={isInputDisabled}
                    value={planDetail.planAllUnit}
                    type="number"
                    min={1}
                    className="form-control"
                    onChange={(e) =>
                        setPlanDetail((prev) => ({
                        ...prev,
                        planAllUnit: Number(e.target.value || 0),
                        }))
                    }
                    />
                </div>
                </div>

                {/* หมวดหมู่หลัก */}
                {planDetail.planName !== "" && planDetail.planAllUnit > 0 && (
                <div className="shadow-sm p-4 mb-4 bg-white rounded">
                    <h2 className="h4 mb-3">หมวดหมู่</h2>
                    <p className="text-muted mb-3">
                    คุณสามารถเพิ่มหน่วยกิตของหมวดหมู่รวมกันได้ไม่เกิน{' '}
                    <strong>{planDetail.planAllUnit}</strong> หน่วยกิต
                    </p>
                    {studyPlanData.length===0 && <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={() => {
                        const newCat = {
                        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                        data: {
                            structureName: '',
                            allUnit: 0,
                        },
                        };
                        setMainCat((prev) => [...prev, newCat]);
                        if (mainCatagory.length === 0) setCurrMainId(newCat.id);
                    }}
                    >
                    เพิ่มหมวดหมู่
                    </button>}

                    {mainCatagory.map((cat, i) => (
                    <div key={cat.id} className="border p-3 mb-3 rounded bg-light">
                        <div className="mb-2">
                        <label className="form-label">
                            {i + 1}. ชื่อหมวดหมู่หลัก
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={cat.data.structureName}
                            disabled={isInputDisabled}
                            onChange={(e) =>
                            handleMainCatagoryInput(i, 'structureName', e.target.value)
                            }
                        />
                        </div>
                        <div>
                        <label className="form-label">หน่วยกิตรวม</label>
                        <input
                            type="number"
                            className="form-control"
                            min={0}
                            value={cat.data.allUnit}
                            disabled={isInputDisabled}
                            onChange={(e) =>
                            handleMainCatagoryInput(i, 'allUnit', e.target.value)
                            }
                        />
                        </div>
                        {studyPlanData.length===0 && <div className="mt-2 text-end">
                            <button 
                                className="btn btn-danger "
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteMain"
                                onClick={()=>setMainDel({
                                    id:cat.id,
                                    name:cat.data.structureName
                                })}
                            >ลบหมวดหมู่หลัก
                            </button>
                        </div>}
                    </div>
                    ))}
                </div>
                )}

                {/* หมวดหมู่ย่อย */}
                {mainCatagory.length > 0 && (
                <div className="shadow-sm p-4 mb-4 bg-white rounded">
                    <h2 className="h4 mb-3">หมวดหมู่ย่อย</h2>

                    {studyPlanData.length===0 && <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#subStructModal"
                    className="btn btn-outline-secondary mb-3"
                    >
                    เพิ่มหมวดหมู่ย่อยในหมวดหมู่หลัก
                    </button>}

                    <div className="mb-3">
                    {mainCatagory.map((cat) =>
                        cat.data.allUnit > 0 && cat.data.structureName ? (
                        <button
                            key={cat.id}
                            onClick={() => setCurrMainId(cat.id)}
                            type="button"
                            className={`btn btn-sm btn-outline-primary me-2 mb-2 ${
                            currMainID === cat.id ? 'active' : ''
                            }`}
                        >
                            {cat.data.structureName} ({cat.data.allUnit} หน่วยกิต)
                        </button>
                        ) : null
                    )}
                    </div>

                    <div>
                    {subCatagory?.length > 0 &&
                        subCatagory.map(
                        (sub) =>
                            sub.data.mainId === currMainID && (
                            <div
                                key={sub.id}
                                className="border p-3 mb-2 rounded bg-light"
                            >
                                <div>ชื่อหมวดหมู่ย่อย: {sub.data.subName}</div>
                                <div>จำนวนหน่วยกิต: {sub.data.allUnit}</div>
                            </div>
                            )
                        )}
                    </div>
                </div>
                )}

                {/* ปุ่มบันทึก */}
                {studyPlanData.length === 0 && (
                <div className="text-end">
                    <button
                    className="btn btn-success"
                    onClick={(e) => SaveAllAtFirsttime(e)}
                    >
                    บันทึกทั้งหมด
                    </button>
                </div>
                )}
            </form>
            )}

            {/* Modal */}
            <div
            className="modal fade"
            id="subStructModal"
            tabIndex="-1"
            aria-labelledby="subStructModalLabel"
            aria-hidden="true"
            >
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="subStructModalLabel">
                    เพิ่มหมวดหมู่ย่อย
                    </h5>
                    <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                    <label className="form-label">ชื่อหมวดหมู่ย่อย</label>
                    <input
                        type="text"
                        className="form-control"
                        name="subName"
                        value={tmpSubStruct.data.subName}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="mb-3">
                    <label className="form-label">หน่วยกิตหมวดหมู่ย่อย</label>
                    <input
                        type="number"
                        min={0}
                        name="allUnit"
                        className="form-control"
                        value={tmpSubStruct.data.allUnit}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="mb-3">
                    <label className="form-label">อยู่ในหมวดหมู่หลัก</label>
                    <select
                        className="form-select"
                        name="mainId"
                        value={tmpSubStruct.data.mainId}
                        onChange={handleChange}
                    >
                        <option value="">-- กรุณาเลือกหมวดหมู่หลัก --</option>
                        {mainCatagory.map(
                        (cat) =>
                            cat.data.structureName !== '' &&
                            cat.data.allUnit > 0 && (
                            <option key={cat.id} value={cat.id}>
                                {cat.data.structureName}
                            </option>
                            )
                        )}
                    </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    >
                    ปิด
                    </button>
                    <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitAddSub}
                    >
                    บันทึก
                    </button>
                </div>
                </div>
            </div>
            </div>
            

            {/*modal delete main catagory*/}
            <div
                className="modal fade"
                id="deleteMain"
                tabIndex="-1"
                aria-labelledby="deleteMain"
                aria-hidden="true"
                >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header  bg-danger text-white">
                        <h5 className="modal-title">
                        ลบหมวดหมู่หลัก
                        </h5>
                        <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            คุณต้องการจะลบหมวดหมู่หลัก {selMainIdToDelete.name} ใช่ไหม ?
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        >
                        ปิด
                        </button>
                        <button
                        type="button"
                        className="btn btn-danger ps-4 pe-4"
                        onClick={handleDeleteMainCat}
                        >
                        ลบ
                        </button>
                    </div>
                    </div>
                </div>
                </div>

        </div>
        );

}
