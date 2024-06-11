import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth , googleProvider} from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlegoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/")
    }
    catch(err) {
      console.error("Google sign in error:", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Elite Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email"  onChange={e => setEmail(e.target.value)} placeholder="email" />
          <input type="password"  onChange={e => setPassword(e.target.value)} placeholder="password" />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
        <button onClick={handlegoogle}><img width="24" height="24" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo"/></button>
      </div>
    </div>
  );
};

export default Login;
