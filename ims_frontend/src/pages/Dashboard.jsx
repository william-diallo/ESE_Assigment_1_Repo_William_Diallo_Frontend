import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  console.log("DASHBOARD RENDERED");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => navigate("/add-item")}>Add Inventory Item</button>
        <button onClick={() => navigate("/search-items")}>Search Items</button>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
