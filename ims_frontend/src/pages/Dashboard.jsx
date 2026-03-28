import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  console.log("DASHBOARD RENDERED");
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}
