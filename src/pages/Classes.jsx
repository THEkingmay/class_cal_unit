import { useContext } from "react"
import { AuthContext } from "../components/AuthWrapper"
import { IoIosWarning } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";

export default function Classes(){
    const { navigate, studyPlanData } = useContext(AuthContext)

    
    return(
       <div className="container pt-5 ">
        <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary">วิชาเรียน</h1>
        
            {studyPlanData.length === 0 && (
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
            )}
        
        
        </div>
    </div>
    )
}