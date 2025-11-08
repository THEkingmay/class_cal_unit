import { app } from "./firebase";
import { createUserDocAfterRegistered } from "./fireStore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut ,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import { connectAuthEmulator } from "firebase/auth";

const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099"); 

const register = async (email, password) => {
  if (email === "" || password === "")
    throw new Error("Input email and password");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocAfterRegistered()
  } catch (err) {
    throw new Error(err.message);
  }
};

const login = async (email, password) => {
  if (email === "" || password === "")
    throw new Error("Input email and password");
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err)
    throw new Error(err.message);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("logout success")
  } catch (err) {
    throw new Error(err);
  }
};

const resetPassword = async (email)=>{
  if (!email) throw new Error("Please enter your email");
  try {
    await sendPasswordResetEmail(auth , email)
  } catch (err) {
    throw new Error(err);
  }
}
export { auth, register, login, logout ,resetPassword };
