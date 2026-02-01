import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 
import bg from "../assets/login-bg.avif";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );

      alert("Account created successfully ✅");

      navigate("/");
    } catch (err) {
      alert("Signup failed ❌");
    }
  };

  return (
     <div className="login-container">
    
          {/* LEFT IMAGE */}
          <div
            className="login-left"
            style={{ backgroundImage: `url(${bg})` }}
          />

      {/* RIGHT SIDE */}
      <div className="login-right">
        <form className="login-card" onSubmit={handleSignup}>
          <h2>Create your account 🚀</h2>
          <p className="sub">Get started with task management</p>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>

          <p className="signup">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}
