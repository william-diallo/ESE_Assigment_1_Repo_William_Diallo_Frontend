import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  console.log("DASHBOARD RENDERED");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div className="page-card page-card--wide">
        <p className="page-kicker">Inventory Management</p>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome, {user?.email}. Choose the inventory task you want to perform.
        </p>

        <div className="dashboard-grid">
          <section className="dashboard-tile">
            <h2>Create items</h2>
            <p>Add new inventory records with quantity, description, and category.</p>
            <button className="btn" onClick={() => navigate("/add-item")}>
              Add Inventory Item
            </button>
          </section>

          <section className="dashboard-tile">
            <h2>Search inventory</h2>
            <p>Filter existing stock, inspect details, and open edit actions.</p>
            <button
              className="btn-secondary"
              onClick={() => navigate("/search-items")}
            >
              Search Items
            </button>
          </section>

          <section className="dashboard-tile">
            <h2>Session</h2>
            <p>Sign out of the current account when you are finished working.</p>
            <button className="btn-danger" onClick={logout}>
              Logout
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
