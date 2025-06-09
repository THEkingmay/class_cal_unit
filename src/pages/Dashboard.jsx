import { useContext } from "react"
import { AuthContext } from "../components/AuthWrapper"
import { IoIosWarning } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";

export default function Dashboard() {
  const { navigate, studyPlanData } = useContext(AuthContext)
  
  return (
    <div className="container pt-5 ">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">แดชบอร์ด</h1>
        <p className="text-muted fs-5">สรุปภาพรวมแผนการเรียนของคุณ</p>
      </div>

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

      { studyPlanData.length>0 && 
        <div className="card shadow-sm border-0 rounded-4 ">
        <div className="card-body">
          <h5 className="card-title">เนื้อหาหลักในแดชบอร์ด</h5>
          <p className="card-text text-muted">
            แผนการเรียน ไอดี : {studyPlanData[0].id || ""}<br/>
            ชื่อแผนการเรียน : {studyPlanData[0].data.studyplanName || ""}<br/>
            หน่วยกิตรวม : {studyPlanData[0].data.allUnit || ""}<br/>
            <br/>
            (ตรงนี้เมจะใส่เนื้อหาวิเคราะห์แผนการเรียน เช่น จำนวนหน่วยกิต คอร์สที่ต้องเรียน เป็นต้น)
          </p>
        </div>
      </div>}
    </div>
  )
}
