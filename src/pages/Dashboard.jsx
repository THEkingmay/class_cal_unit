import { useContext } from "react"
import { AuthContext } from "../components/AuthWrapper"

export default function Dashbord(){

    const {navigate , studyPlanData} = useContext(AuthContext)

    return(
        <div className="container p-4 ">
            <div>
                <div className="display-3 text-center">Dashboard</div>
                { studyPlanData.length===0 && (
                        <div>
                            You need to add your studyplan fisrt
                        </div>
                )}
            </div>
        </div>
    )
}