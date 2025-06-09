import { getFirestore , setDoc , doc   ,addDoc , collection, getDocs , writeBatch , collectionGroup} from "firebase/firestore";
import { app } from "./firebase";
import { auth } from "./UserAuth";

import { connectFirestoreEmulator } from "firebase/firestore";

// โครงสร้าง firestore
// users/{userid}/studyplan/{studyplanid}/planStructure/{planStrutureId}/subStructure/{subStructureId}
//  studyplan มีอันเดียวเป็นหลักสูตรที่เรียน --> ชื่อหลักสูตร , collection structure
//  planStructure --> ขื่อหมวดหมู่หลัก ชื่อหมวดหมู่ย่อย หน่วยกิตย่อย 
//  
//  ถ้าหมวดหมู่ย่อยไม่มีให้เพิ่มหมวดหมู่ย่อยเป็นอันเดียวกับหมวดหมู่หลัก
// 
// 

// users/{usersid}/classes/...




const db = getFirestore(app)
connectFirestoreEmulator(db,'localhost',8080)

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
        console.log(err)
        throw new Error(err)
    }
}
const getStructurePlan = async (userId , planId) =>{
    try{
        const structurePlan = await getDocs(collection(db,'users',userId,'studyplan',planId,'structure'))
        console.log("get plan Structure")
        return structurePlan
    }catch(err){
        console.log(err.message)
    }
}
const getSubStructure = async ( ) =>{
    try{
        const data = await getDocs(collectionGroup(db,"subStructure"))
        console.log("get all sub structure")
        return data
    }catch(err){
        console.log(err.message)
    }
 }


const addUserStudyplanFields= async (userid , planData)=>{
    try{
        const plan = await addDoc(collection(db,'users',userid,'studyplan') ,  planData)  // {studyplanName : '....' , allUnit: ... } 
        console.log("add user's studyplan details")
        return plan.id
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}




export {createUserDocAfterRegistered , getUserStudyplan ,getStructurePlan, getSubStructure ,addUserStudyplanFields  }