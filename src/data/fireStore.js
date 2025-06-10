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
  console.log("TESt")
    try{
        const structurePlan = await getDocs(collection(db,'users',userId,'studyplan',planId,'structure'))
         const result = structurePlan.docs.map(doc => ({
          id: doc.id,
          data: doc.data(), // หรือแยกแบบละเอียดก็ได้
        }));
         console.log("get plan Structure  : " , result)
        return result;

      }catch(err){
        console.log(err.message)
    }
}
  const getSubStructure = async (userId, planId) => {
    try {
      const structDocs = await getDocs(collection(db, 'users', userId, 'studyplan', planId, 'structure'));
      const result = [];
      // ใช้ for...of แทน map เพื่อให้ await ทำงานได้
      for (const s of structDocs.docs) {
        const tmp = await getDocs(
          collection(db, 'users', userId, 'studyplan', planId, 'structure', s.id, 'subStructure')
        );

        tmp.forEach(t => {
          result.push({
            id: t.id,
            data: t.data(),
          });
        });
      }
      console.log("get all sub structure: ", result);
      return result;
    } catch (err) {
      console.log("Error getting subStructure:", err.message);
      return [];
    }
  };

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

const addMainStructureToPlan = async (userId, planId, mainCategory) => {
  if (!Array.isArray(mainCategory) || mainCategory.length === 0) return;
    // mainCat : {
    //  id ,
    //  data:{
    //          allUnit, 
    //         structureName
    //  }}
    try {
    await Promise.all(mainCategory.map(cat =>
      setDoc(doc(db, 'users', userId, 'studyplan', planId, 'structure', cat.id), cat.data)
    ));
    console.log("Added main structure");
  } catch (err) {
    console.error("Error adding main structure:", err);
    throw err;
  }
}
const addSubStructureToMain = async (userId, planId, subCategory) => {
  if (!Array.isArray(subCategory) || subCategory.length === 0) return;
    // subCat : {
    //     id ,
    //     data:{
    //         allUnit,
    //         mainId,
    //         subName
    //     }
    // }
   try {
    await Promise.all(subCategory.map(sub =>
      setDoc(doc(db, 'users', userId, 'studyplan', planId, 'structure', sub.data.mainId, 'subStructure', sub.id), sub.data)
    ));
    console.log("Added sub structure");
  } catch (err) {
    console.error("Error adding sub structure:", err);
    throw err;
  }
}

export {db, createUserDocAfterRegistered , addSubStructureToMain,  getUserStudyplan ,getStructurePlan, getSubStructure ,addUserStudyplanFields , addMainStructureToPlan  }