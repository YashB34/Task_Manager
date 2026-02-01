import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RoleSelect.css";

export default function RoleSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location.state; 

  const chooseRole = async (role) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          ...userData,
          role,
        }
      );

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      alert("Something went wrong...");
    }
  };

  return (
    <div className="role-container">

      <h2>Choose your role</h2>
      <p>Select how you want to use Task Manager</p>

      <div className="role-boxes">

        <div className="role-card admin" onClick={() => chooseRole("admin")}>
          <h3>Admin</h3>
          <p>Create & manage all tasks</p>
        </div>

        <div className="role-card user" onClick={() => chooseRole("user")}>
          <h3>User</h3>
          <p>Work on assigned tasks</p>
        </div>

      </div>
    </div>
  );
}
