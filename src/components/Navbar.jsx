import { Link } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { logout } from "../data/UserAuth";
import "./Navbar.css";

import { AuthContext } from "./AuthWrapper";
import { useContext } from "react";
import AlertMessage from "../items/AlertMessage";

export default function Navbar() {
  const [errMsg, setErrMsg] = useState("");
  const [currPage, setCurrPage] = useState("");
  const location = useLocation();

  const {currEmail} = useContext(AuthContext)

  useEffect(() => {
    if (location.pathname === "/dashboard") setCurrPage("dashboard");
    else if (location.pathname === "/studyplan") setCurrPage("studyplan");
    else if (location.pathname === "/classes") setCurrPage("classes");
    else setCurrPage("");
  }, [location.pathname]);

  const closeNavbar = () => {
    const menu = document.getElementById("navbarNav");
    const bsCollapse = bootstrap.Collapse.getInstance(menu);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setErrMsg(err.message);
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <AlertMessage type={"error"} msg={errMsg} />
      <div className="container-fluid">
        {/* โลโก้ หรือปุ่มกลับไปหน้าแดชบอร์ด */}
        <Link to="/dashboard" className="navbar-brand">
         <div className="d-flex  p-2 justify-content-center align-items-center"> <CiHome size={30} /><span className="small ms-2 text-light" >{currEmail}</span></div>
        </Link>

        {/* ปุ่ม toggle เมนูสำหรับมือถือ */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="สลับเมนู"
        >
          <RxHamburgerMenu size={25} />
        </button>

        {/* เมนูนำทาง */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item p-2 p-lg-0">
              <Link
                to="/dashboard"
                onClick={closeNavbar}
                className={`nav-link text-white hoverItem ${
                  currPage === "dashboard" ? "border-bottom" : ""
                }`}
              >
                แดชบอร์ด
              </Link>
            </li>
            <li className="nav-item p-2 p-lg-0">
              <Link
                to="/studyplan"
                onClick={closeNavbar}
                className={`nav-link text-white hoverItem ${
                  currPage === "studyplan" ? "border-bottom" : ""
                }`}
              >
                แผนการเรียน
              </Link>
            </li>
            <li className="nav-item p-2 p-lg-0">
              <Link
                to="/classes"
                onClick={closeNavbar}
                className={`nav-link text-white hoverItem ${
                  currPage === "classes" ? "border-bottom" : ""
                }`}
              >
                รายวิชา
              </Link>
            </li>
            <li
              onClick={() => {
                closeNavbar();
                handleLogout();
              }}
              className="nav-item ms-lg-3 p-2 p-lg-0"
              style={{ cursor: "pointer" }}
            >
              <a className="nav-link text-white ms-lg-3 hoverItem">ออกจากระบบ</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
