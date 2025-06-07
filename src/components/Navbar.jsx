import { Link } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect , useState } from "react";
import { useLocation } from "react-router-dom";
import { logout } from "../data/UserAuth";
import './Navbar.css'

import AlertMessage from "../items/AlertMessage";

export default function Navbar() {
    const [errMsg , setErrMsg] = useState("")
    const [currPage , setCurrpage] = useState("")
    const location = useLocation()
    useEffect(()=>{
        if(location.pathname==='/dashboard')setCurrpage("dashboard")
        else if(location.pathname==='/studyplan')setCurrpage("studyplan")
        else if(location.pathname==='/classes')setCurrpage("classes")
        else setCurrpage("")
    },[location.pathname])

    const closeNavbar = () => {
       const menu = document.getElementById("navbarNav");
        const bsCollapse = bootstrap.Collapse.getInstance(menu);
        if (bsCollapse) {
        bsCollapse.hide();
        }
    };

    const handleLogout = async () =>{
        try{
            await logout()
        }catch(err){
            setErrMsg(err)
            setTimeout(()=>{setErrMsg("")},3000)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <AlertMessage type={'error'} msg={errMsg}/>
            <div className="container-fluid">
                {/* โลโก้หรือปุ่มกลับหน้า Dashboard */}
                <Link to="/dashboard" className="navbar-brand">
                    <CiHome size={30} />
                </Link>

                {/* ปุ่ม toggle menu บน mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <RxHamburgerMenu size={25} />
                </button>

                {/* เมนู */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto ">
                        <li className="nav-item p-2 p-lg-0">
                            <Link to="/dashboard" onClick={closeNavbar} className={`nav-link text-white hoverItem ${currPage==='dashboard'?'border-bottom':''}`}>Dashboard</Link>
                        </li>
                        <li className="nav-item  p-2 p-lg-0">
                            <Link to="/studyplan" onClick={closeNavbar} className={`nav-link text-white hoverItem  ${currPage==='studyplan'?'border-bottom':''}`}>Studyplan</Link>
                        </li>
                        <li className="nav-item  p-2 p-lg-0">
                            <Link to="/classes" onClick={closeNavbar} className={`nav-link text-white hoverItem p- ${currPage==='classes'?'border-bottom':''}`}>Classes</Link>
                        </li>
                        <li onClick={()=>{closeNavbar(); handleLogout()}} className="nav-item ms-lg-3 p-2 p-lg-0" style={{cursor:'pointer'}}>
                            <a className="nav-link text-white ms-lg-3 hoverItem">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
