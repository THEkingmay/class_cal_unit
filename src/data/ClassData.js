import { db } from "./fireStore";
import { setDoc , doc   ,addDoc , collection, getDocs } from "firebase/firestore";

// users/{userid}/classes/{classId}
//  class : {
//          id,
//           data:{
//                  className ,
//                  classCode ,
//                  year , 
//                  semester,
//                  หมวดหมู่หลัก , 
//                  หมวดหมู่ย่อย
//             } 
//    }
// 
// 
// 
// 
 

// ฟังก์ชันทำงานเกี่ยว classes collection 
const getAllClasses = async (userId) => {
    try {
        const allClass = await getDocs(collection(db, 'users', userId, 'classes'))
        const result = allClass.docs.map(d => {
            return {
                id: d.id,
                data: d.data()
            }
        })
        console.log("Get all Classes")
        return result
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
const addClassToCollection = async (userId , newDoc)=>{
    try{
        await setDoc(doc(db, 'users', userId, 'classes',newDoc.id) , newDoc.data)
        console.log("add class to collection success")
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}


export {getAllClasses , addClassToCollection}