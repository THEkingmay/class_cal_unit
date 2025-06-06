import { Link } from "react-router-dom"
export default function Navbar(){
    return(
        <nav>
            <button><Link to={'/dashboard'}>Dashboard</Link></button>
            <button><Link to={'/studyplan'}>Studyplan</Link></button>
            <button><Link to={'/classes'}>Classes</Link></button>
        </nav>
    )
}