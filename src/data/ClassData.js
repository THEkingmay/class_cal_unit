import { db } from "./fireStore";

// users/{userid}/classes/{classId}

// ฟังก์ชันทำงานเกี่ยว classes collection 
const getAllClasses = async (userId )=>{
    try{

        console.log("Get all Classes")
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}