import { getFirestore , setDoc , doc   ,addDoc , collection, getDocs} from "firebase/firestore";
import { app } from "./firebase";
import { auth } from "./UserAuth";

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
       const data =  await getDocs(collection(db, 'users' , userid,'studyplan')) 
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

export {createUserDocAfterRegistered , getUserStudyplan}