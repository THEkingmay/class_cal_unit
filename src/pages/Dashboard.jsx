import { useContext } from "react";
import { AuthContext } from "../components/AuthWrapper";
import { IoIosWarning } from "react-icons/io";
import { FaChevronRight, FaGraduationCap, FaBookOpen, FaCheckCircle } from "react-icons/fa";

export default function Dashboard() {
  const { navigate, studyPlanData, allClassContext, mainCatagoryContext, subCatagoryContext } = useContext(AuthContext)

  const calAllUnitInMain = (mainId) => {
    const filterClassByMainId = allClassContext.filter(c => c.data.mainId === mainId);
    return filterClassByMainId.reduce((sum, item) => sum + item.data.unit, 0);
  }

  const calAllUnitBySubId = (subId) => {
    const filterClassBySubId = allClassContext.filter(c => c.data.subId === subId);
    return filterClassBySubId.reduce((sum, item) => sum + item.data.unit, 0);
  }

  const calculateProgress = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  return (
    <div className="container-fluid px-4 py-5">
      {/* Header Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-gradient rounded-circle mb-3" style={{width: '80px', height: '80px'}}>
              <FaGraduationCap size={40} className="text-white" />
            </div>
            <h1 className="display-5 fw-bold text-dark mb-2">แดชบอร์ดการเรียน</h1>
            <p className="lead text-muted">ติดตามความก้าวหน้าในการเรียนของคุณ</p>
          </div>
        </div>
      </div>

      {studyPlanData.length === 0 ? (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle mb-3" style={{width: '80px', height: '80px'}}>
                    <IoIosWarning size={40} className="text-warning" />
                  </div>
                  <h3 className="fw-bold text-dark mb-2">เริ่มต้นการเรียนของคุณ</h3>
                  <p className="text-muted fs-5 mb-4">
                    สร้างแผนการเรียนเพื่อเริ่มติดตามความก้าวหน้าและจัดการหลักสูตรของคุณ
                  </p>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button
                    className="btn btn-primary btn-lg rounded-pill px-4 py-3 fw-semibold shadow-sm"
                    onClick={() => navigate('/studyplan')}
                  >
                    <FaBookOpen className="me-2" />
                    สร้างแผนการเรียน
                    <FaChevronRight className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Study Plan Overview */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-gradient bg-primary text-white border-0 py-4">
                  <div className="row align-items-center">
                    <div className="col">
                      <h4 className="mb-1 fw-bold">
                        <FaGraduationCap className="me-2" />
                        {studyPlanData[0].data.planName}
                      </h4>
                      <p className="mb-0 opacity-75">แผนการเรียนหลักของคุณ</p>
                    </div>
                    <div className="col-auto d-md-flex gap-3">
                      <div className="bg-white text-primary bg-opacity-20 rounded-3 px-3 py-2">
                        <span className="fw-bold fs-5">{studyPlanData[0].data.planAllUnit}</span>
                        <small className="d-block opacity-75">หน่วยกิตรวม</small>
                      </div>
                      <div className="bg-white text-primary bg-opacity-20 rounded-3 px-3 py-2 mt-1 mt-md-0">
                        <span className="fw-bold fs-5">{allClassContext.reduce((sum , item)=> sum+item.data.unit , 0)}</span>
                        <small className="d-block opacity-75">หน่วยกิตเก็บแล้ว</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Categories Grid */}
          <div className="row g-4">
            {mainCatagoryContext.map(main => {
              const filterSubByMainId = subCatagoryContext.filter(sub => sub.data.mainId === main.id);
              const completedUnits = calAllUnitInMain(main.id);
              const totalUnits = main.data.allUnit;
              const progress = calculateProgress(completedUnits, totalUnits);
              
              return (
                <div key={main.id} className="col-12 col-xl-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                    <div className="card-header bg-light border-0 py-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="mb-0 fw-bold text-dark">
                          <FaBookOpen className="me-2 text-primary" />
                          {main.data.structureName}
                        </h5>
                        <span className="badge bg-primary bg-gradient rounded-pill px-3 py-2">
                          {progress}%
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="progress rounded-pill" style={{height: '8px'}}>
                          <div 
                            className="progress-bar bg-gradient" 
                            style={{width: `${progress}%`}}
                            role="progressbar"
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                          <small className="text-muted">
                            เก็บแล้ว {completedUnits} จาก {totalUnits} หน่วยกิต
                            {completedUnits-totalUnits>0 ? <span> หน่วยกิตที่เกินมาจะกลายเป็นวิชาเสรี {completedUnits-totalUnits} หน่วยกิต</span>:''}
                          </small>
                          <small className="text-success fw-semibold">
                            <FaCheckCircle className="me-1" />
                            {completedUnits}/{totalUnits} 
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        {filterSubByMainId.map(sub => {
                          const subCompleted = calAllUnitBySubId(sub.id);
                          const subTotal = sub.data.allUnit;
                          const subProgress = calculateProgress(subCompleted, subTotal);
                          
                          return (
                            <div key={sub.id} className="list-group-item border-0 py-3">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="fw-semibold text-dark">{sub.data.subName}</span>
                                <span className="badge bg-light text-dark rounded-pill">
                                  {subProgress}%
                                </span>
                              </div>
                              
                              <div className="progress rounded-pill mb-2" style={{height: '6px'}}>
                                <div 
                                  className="progress-bar bg-success bg-gradient" 
                                  style={{width: `${subProgress}%`}}
                                ></div>
                              </div>
                              
                              <div className="d-flex justify-content-between">
                                <small className="text-muted">
                                  เก็บแล้ว {subCompleted} หน่วยกิต
                                </small>
                                <small className="text-muted">
                                  ทั้งหมด {subTotal} หน่วยกิต
                                </small>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Stats */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 bg-light">
                <div className="card-body py-4">
                  <div className="row text-center g-4">
                    <div className="col-6 col-md-3">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px'}}>
                          <FaGraduationCap className="text-white" />
                        </div>
                        <span className="fw-bold fs-4 text-dark">{mainCatagoryContext.length}</span>
                        <small className="text-muted">หมวดวิชา</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-success bg-gradient rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px'}}>
                          <FaBookOpen className="text-white" />
                        </div>
                        <span className="fw-bold fs-4 text-dark">{subCatagoryContext.length}</span>
                        <small className="text-muted">หมวดวิชาย่อย</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-info bg-gradient rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px'}}>
                          <FaCheckCircle className="text-white" />
                        </div>
                        <span className="fw-bold fs-4 text-dark">{allClassContext.length}</span>
                        <small className="text-muted">วิชาทั้งหมด</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-warning bg-gradient rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px'}}>
                          <FaGraduationCap className="text-white" />
                        </div>
                        <span className="fw-bold fs-4 text-dark">
                          {allClassContext.reduce((sum, item) => sum + item.data.unit, 0)}
                        </span>
                        <small className="text-muted">หน่วยกิตที่เก็บ</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}