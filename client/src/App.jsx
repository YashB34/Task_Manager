import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RoleSelect from "./pages/RoleSelect";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/role" element={<RoleSelect />} />
        <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
