import { useContext, useState , useEffect } from "react"
import { AuthContext } from "../components/AuthWrapper"
import { IoIosWarning } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";

import Loading from "../items/Loading";
import AlertMessage from "../items/AlertMessage";

import { addClassToCollection , deleteClassId } from "../data/ClassData";

const checkHavePlan = (navigate) =>{
    return(
         <div className="alert alert-warning shadow-sm p-4 rounded-4">
                <div className="row align-items-center g-3">
                <div className="col-12 col-md-8 d-flex align-items-center">
                    <IoIosWarning size={28} className="me-2 text-warning" />
                    <div>
                    <h5 className="mb-1 fw-semibold">ยังไม่มีแผนการเรียน</h5>
                    <p className="mb-0 text-muted small">
                        คุณต้องเพิ่มสายการเรียนก่อนจึงจะสามารถใช้งานฟีเจอร์อื่น ๆ ได้
                    </p>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <button
                    className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center gap-2 py-2"
                    onClick={() => navigate('/studyplan')}
                    >
                    <span className="fw-medium">เพิ่มแผนการเรียน</span>
                    <FaChevronRight />
                    </button>
                </div>
                </div>
            </div>
    )
}

export default function Classes(){
    const [isLoad, setLoad] = useState(false);
    const [alertType, setType] = useState("");
    const [alertMsg, setMsg] = useState("");

    const { navigate, currentUserID  , fetchUserClasses, studyPlanData, allClassContext , mainCatagoryContext, subCatagoryContext } = useContext(AuthContext)
    
    const [allClass, setAllClass] = useState([])
    
    // Form inputs
    const [className, setClassName] = useState(''); // ชื่อวิชา
    const [classCode, setClassCode] = useState('');  // รหัสวิชา
    const [year, setYear] = useState(0); // เช่นปี 2568
    const [semester, setSemester] = useState(0); // 1 = เทอม1, 2 = เทอม2, 3 = summer
    const [unit , setUnit ] = useState(0)
    // Category data arrays
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    
    // Selected values
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    
    useEffect(()=>{
        setAllClass(allClassContext)
        console.log("set all class ")
    },[allClassContext])
    
    useEffect(()=>{
        let tmp = []
        mainCatagoryContext.forEach(main=>{
            tmp.push({
                id: main.id,
                data: {
                    structureName: main.data.structureName
                }
            })
        })
        setMainCategories(tmp)
    },[mainCatagoryContext])

    useEffect(()=>{
        let tmp = []
        subCatagoryContext.forEach(sub=>{
            tmp.push({
                id: sub.id,
                data: {
                    mainId: sub.data.mainId,
                    subName: sub.data.subName
                }
            })
        })
        setSubCategories(tmp)
    },[subCatagoryContext])

    // Reset subcategory when main category changes
    useEffect(() => {
        setSelectedSubCategoryId('');
    }, [selectedMainCategoryId]);

    // Filter subcategories based on selected main category
    const filteredSubCategories = subCategories.filter(sub => 
        sub.data.mainId === selectedMainCategoryId
    );

    // Reset form function
    const resetForm = () => {
        setClassName('');
        setClassCode('');
        setYear(0);
        setSemester(0);
        setUnit(0)
        setSelectedMainCategoryId('');
        setSelectedSubCategoryId('');
    };

    // Close modal function
    const closeModal = () => {
        const modalElement = document.getElementById('addClassModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    };
    
    const [deleteClass , setDeleteClass] = useState({
        id:'',
        name:'',
        code:''
    }) 
    const handleDelete = async (id) =>{
        console.log("Delete class doc id : " , id)
        try{
            setLoad(true)
            await deleteClassId(currentUserID , id)
            setMsg("ลบวิชาเรียนสำเร็จ")
            setType("success")
            fetchUserClasses()
        }catch(err){
            setMsg(err.msg)
            setType("error")
        }finally{
            setLoad(false)
            setTimeout(()=>{
                 setMsg("")
                setType("")
                setDeleteClass({
                    id:"",
                    name:'',
                    code:''
                })
            },3000)
        }

        closeModal()
    }


    const handleAddClass = (e) => {
        e.preventDefault(); // Prevent form submission
        setLoad(true);
        try {
                // Validation
                if (classCode === "" || className === "" || year === 0 || unit===0 || semester === 0 || selectedMainCategoryId === "") {
                    throw new Error("กรอกข้อมูลให้ครบ");
                }
                // Create new class data
                const newData = {
                    id:`${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    data: {
                        classCode,
                        className,
                        unit,
                        year, // เช่นปี 1 ปี 2 3 4 5 ... 
                        semester, // เทอมเช่น เทอม 1 เทอม 2 หรือ 3 คือซัมเมอร์
                        mainId: selectedMainCategoryId,
                        subId: selectedSubCategoryId || ''
                    }
                };
                console.log("เพิ่มรายวิชา: ", newData);
                addClassToCollection(currentUserID , newData)

                // Show success message
                setMsg(`เพิ่มรายวิชา ${newData.data.className} สำเร็จ`); // Fixed property access
                setType("success");
                
                // fetch class 
                fetchUserClasses()
                // Reset form and close modal
                resetForm();
                closeModal();
                
            } catch (err) {
                console.log(err.message);
                setMsg(err.message);
                setType("error");
            } finally {
                setLoad(false);
                // Clear alert after 3 seconds
                setTimeout(() => {
                    setMsg("");
                    setType("");
                }, 3000);
            }
        };

        const showClass = () => {
            const allYear = [...new Set(allClass.map(a => a.data.year))].sort();
            const allSemester = [1, 2, 3];
            const semesterNames = {
                1: "เทอม 1",
                2: "เทอม 2", 
                3: "ภาคเรียนฤดูร้อน"
            };

            return (
                <div>
                    <div className="mb-4">
                        <h5 className="fw-bold text-secondary">คุณมี {allClass.length} วิชา</h5>
                    </div>
                    
                    {allYear.map(year => (
                        <section key={year} className="mb-5">
                        <h6 className="text-primary fw-semibold mb-4 border-start border-4 border-primary ps-3 text-start fs-5">
                            ปีการศึกษา {year}
                        </h6>
                        <div className="row g-4">
                            {allSemester.map(semester => {
                            const classesInSemester = allClass.filter(a => a.data.year === year && a.data.semester === semester);
                            if (classesInSemester.length === 0) return null;

                            return (
                                <div key={`${year}-${semester}`} className="col-12 col-lg-4">
                                <div className="card shadow-sm rounded-3 h-100">
                                    <div className="card-header bg-primary text-white rounded-top">
                                    <h6 className="mb-0">
                                        {semesterNames[semester]} <span className="badge bg-light text-primary ms-2">{classesInSemester.length} วิชา</span>
                                    </h6>
                                    </div>
                                    <ul className="list-group list-group-flush d-flex justify-content-center">
                                    {classesInSemester.map(classItem => (
                                        <li key={classItem.id} className="list-group-item d-flex align-items-center justify-content-between">
                                            <div className="d-flex flex-column">
                                                <span className="fw-semibold text-start">{classItem.data.classCode}</span>
                                                <span className="text-muted">{classItem.data.className}  {'('+classItem.data.unit+')หน่วยกิต'}</span>
                                            </div>
                                            <div>
                                                <button type="button" className="btn btn-warning me-2">แก้ไข</button>
                                                <button 
                                                onClick={()=>setDeleteClass({id:classItem.id,name:classItem.data.className,code:classItem.data.classCode})} 
                                                type="button" 
                                                className="btn btn-danger"
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                                >ลบ</button>
                                            </div>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                </div>
                            );
                            })}
                        </div>
                        </section>
                    ))}

                    {/* delete modal */}
                    <div
                        className="modal fade"
                        id="deleteModal"
                        tabIndex="-1"
                        aria-labelledby="deleteModalLabel"
                        aria-hidden="true"
                        >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title" id="deleteModalLabel">
                                ยืนยันการลบวิชา
                                </h5>
                                <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                คุณแน่ใจหรือไม่ว่าต้องการลบวิชา{" "}
                                <strong>{deleteClass.name}</strong> ({deleteClass.code})?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                >
                                ยกเลิก
                                </button>
                                <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDelete(deleteClass.id)}
                                data-bs-dismiss="modal"
                                >
                                ลบวิชา
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                </div>
            );
            };



    return (
    <>
        <Loading status={isLoad} />
        <AlertMessage type={alertType} msg={alertMsg} />

        <div className="container py-5">
        <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-4">วิชาเรียน</h1>

            {studyPlanData.length === 0 ? (
            checkHavePlan(navigate)
            ) : (
            <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addClassModal"
                className="btn btn-outline-primary btn-lg mb-4"
            >
                เพิ่มรายวิชา
            </button>
            )}

            {allClass.length === 0 ? (
            <div className="alert alert-info shadow-sm p-4 rounded-4">
                <div className="fs-5">คุณยังไม่มีรายวิชาที่เพิ่ม</div>
            </div>
            ) : (
            <div className="p-3 shadow-sm rounded-4 bg-white">
                {showClass()}
            </div>
            )}
        </div>

        {/* modal เพิ่มรายวิชา */}
        <div
            className="modal fade"
            id="addClassModal"
            tabIndex="-1"
            aria-labelledby="addClassModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addClassModalLabel">
                            เพิ่มรายวิชา
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleAddClass}>
                            <div className="mb-3">
                                <label htmlFor="className" className="form-label">
                                    ชื่อวิชา <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="className"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    placeholder="กรอกชื่อวิชา"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="classCode" className="form-label">
                                    รหัสวิชา <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="classCode"
                                    value={classCode}
                                    onChange={(e) => setClassCode(e.target.value)}
                                    placeholder="กรอกรหัสวิชา"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="unit" className="form-label">
                                    หน่วยกิต <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="unit"
                                    value={unit}
                                    onChange={(e) => setUnit(parseInt(e.target.value) || 0)}
                                    placeholder="กรอกหน่วยกิต"
                                    min={1}
                                    required
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="year" className="form-label">
                                            ปีการศึกษา <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="year"
                                            value={year === 0 ? '' : year}
                                            onChange={(e) => setYear(parseInt(e.target.value) || 0)}
                                            placeholder="เช่น ปี 1 , 2 , 3 "
                                            min={1}
                                            max={10}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="semester" className="form-label">
                                            ภาคเรียน <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            id="semester"
                                            value={semester}
                                            onChange={(e) => setSemester(parseInt(e.target.value))}
                                            required
                                        >
                                            <option value={0}>เลือกภาคเรียน</option>
                                            <option value={1}>เทอม 1</option>
                                            <option value={2}>เทอม 2</option>
                                            <option value={3}>ภาคเรียนฤดูร้อน</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="mainCategoryId" className="form-label">
                                    หมวดหมู่หลัก <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    id="mainCategoryId"
                                    value={selectedMainCategoryId}
                                    onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                                    required
                                >
                                    <option value="">เลือกหมวดหมู่หลัก</option>
                                    {mainCategories.map(main => (
                                        <option key={main.id} value={main.id}>
                                            {main.data.structureName}
                                        </option>
                                    ))}
                                </select> 
                            </div>

                            {filteredSubCategories.length > 0 && (
                                <div className="mb-3">
                                    <label htmlFor="subCategoryId" className="form-label">
                                        หมวดหมู่ย่อย
                                    </label>
                                    <select
                                        className="form-select"
                                        id="subCategoryId"
                                        value={selectedSubCategoryId}
                                        onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                                    >
                                        <option value="">เลือกหมวดหมู่ย่อย</option>
                                        {filteredSubCategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.data.subName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            <div className="modal-footer px-0 pb-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isLoad}
                                >
                                    {isLoad ? 'กำลังเพิ่ม...' : 'เพิ่มรายวิชา'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </>
    );

}