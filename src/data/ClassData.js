import { db } from "./fireStore";
import { setDoc , doc  ,deleteDoc, collection, getDocs , updateDoc } from "firebase/firestore";

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
        console.log("Get all Classes : "  , result)
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

const deleteClassId = async (userId, id) =>{
    try{
        await deleteDoc(doc(db, 'users', userId, 'classes',id))
        console.log("delete class id :  ", id)
    }catch(err){
        console.log(err.message)
        throw new Error(err)
    }
}

const updateClassInFirestore = async (userId, classId , newData)=>{
    try{
        await updateDoc(doc(db,'users',userId,'classes',classId) , newData)
        console.log("update data success")
    }catch(err){
        console.log(err.message)
        throw new Error(err)
    }
}

export {getAllClasses , addClassToCollection , deleteClassId ,  updateClassInFirestore }