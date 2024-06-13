import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile , signInWithPopup} from "firebase/auth";
import { auth, db, storage , googleProvider } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc,getDoc  } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import ReactImage from '../img/React.png';


const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });

        await setDoc(doc(db, "userChats", user.uid), {});
      }

      navigate("/");
    } catch (err) {
      console.error("Google sign in error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false); // Reset error state

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



//Styles

 
  



  return (
    <div style={formContainer}>
      <div style={formWrapper}>
        <span style={logo}>Elite Chat</span>
        <span style={title}>Register</span>
        <form style={form} onSubmit={handleSubmit}>
          <input required type="text" style={input} onChange={e => setDisplayName(e.target.value)} placeholder="display name" />
          <input required type="email" style={input} onChange={e => setEmail(e.target.value)} placeholder="email" />
          <input required type="password" style={input} onChange={e => setPassword(e.target.value)} placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label style={label} htmlFor="file">
            <img style={labelImg} src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button style={button} disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p style={paragraph}>
          You do have an account? <Link to="/login">Login</Link>
        </p>
        <button onClick={handleGoogleSignIn}><img width="24" height="24" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo"/></button>
      </div>
    </div>
  );
};

export default Register;





//Styles
const formContainer = {
  backgroundImage: `url(${ReactImage})`,
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const formWrapper = {
  backgroundColor: 'white',
  padding: '20px 60px',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'center',
};

const logo = {
  color: '#5d5b8d',
  fontWeight: 'bold',
  fontSize: '24px',
};

const title = {
  color: '#5d5b8d',
  fontSize: '12px',
};

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const input = {
  padding: '15px',
  border: 'none',
  width: '250px',
  borderBottom: '1px solid #a7bcff',
};

const button = {
  backgroundColor: '#7b96ec',
  color: 'white',
  padding: '10px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
};

const label = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#8da4f1',
  fontSize: '12px',
  cursor: 'pointer',
};

const labelImg = {
  width: '32px',
};

const paragraph = {
  color: '#5d5b8d',
  fontSize: '12px',
  marginTop: '10px',
};