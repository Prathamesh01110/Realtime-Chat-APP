import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false); // Reset error state
  
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
  
    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
  
      // Ensure the user is authenticated
      if (!res.user) {
        throw new Error('User is not authenticated');
      }
  
      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress, if needed
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload error:", error);
          setErr(true);
          setLoading(false);
        },
        async () => {
          // Handle successful uploads on complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Update profile
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
  
          try {
            // Create user on Firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
  
            // Create empty user chats on Firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
  
            navigate("/");
          } catch (firestoreErr) {
            console.error("Firestore error:", firestoreErr);
            setErr(true);
            setLoading(false);
          }
  
          setLoading(false);
        }
      );
    } catch (authErr) {
      console.error("Error creating user:", authErr);
      setErr(true);
      setLoading(false);
    }
  };
  

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Elite Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
