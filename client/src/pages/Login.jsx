import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import bg from "../assets/login-bg.avif"; 

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      form
    );

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="login-container">

      {/* LEFT IMAGE */}
      <div
        className="login-left"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* RIGHT FORM */}
      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Welcome back 👋</h2>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Log In</button>

          <p className="signup">
            Don't have account?
            <span onClick={() => navigate("/signup")}> Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
}
