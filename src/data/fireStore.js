import { getFirestore , setDoc , doc   ,addDoc , collection, getDocs} from "firebase/firestore";
import { app } from "./firebase";
import { auth } from "./UserAuth";

// โครงสร้าง firestore
// users/{userid}/studyplan/{studyplanid}/planStructure/{planStrutureid}/subPlanStructure/{subPalanStructureID}
//  studyplan มีอันเดียวเป็นหลักสูตรที่เรียน --> ชื่อหลักสูตร , collection structure
//   structure เป็นโครงสร้างหลักสูตรมีหลายโครสร้างเช่น หมวดศึกษาทั่วไป 30หน่วยกิต , หมวดวิชาเฉพาะ 88 หน่วย...
//  subStructure เป็นตัวอธิบายในหมวดนั้นๆ เช่น หมวดศึกษาทั่วไป 30 มี -> หมวดA 10 , B 20 , C 5 ,D 5 ประมาณนี้
// 
// 
// 

// users/{usersid}/classes/...




const db = getFirestore(app)

const createUserDocAfterRegistered = async () =>{
    try{
        await setDoc(doc(db, 'users' , auth.currentUser.uid),{}) // add nothing for the first time 
        console.log("Created user after registered")
    }catch(err){
        throw new Error(err)
    }
}

const getUserStudyplan = async (userid) => {
    try{
       const data =  await getDocs(collection(db, 'users' , userid , 'studyplan')) 
        console.log("get studyplan")
        return data
    }catch(err){
        throw new Error(err)
    }
}
const addUserStudyplanDetail = async (userid)=>{

}
const updateUserStudyplan = async (userid)=>{

}

const getUserClasses = async (userid) =>{

}

export {createUserDocAfterRegistered , getUserStudyplan , getUserClasses}