import { auth, db } from "../firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

// Register
export async function registerUser(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date(),
    })

    console.log("User registered successfully!")
  } catch (error) {
    console.error("Error registering:", error.message)
  }
}

// Login
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("Logged in successfully!")
    return userCredential.user
  } catch (error) {
    console.error("Error logging in:", error.message)
  }
}

// Logout
export async function logoutUser() {
  try {
    await signOut(auth)
    console.log("Logged out successfully!")
  } catch (error) {
    console.error("Error logging out:", error.message)
  }
}