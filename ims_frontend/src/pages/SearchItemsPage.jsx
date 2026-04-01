import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchInventoryItems } from "../features/inventory";
import { ROUTES, itemDetailsPath, itemEditPath } from "../constants/routes";
import { hasUnsafeInputInObject } from "../utils/inputValidation";
import "../styles/SearchItemsPage.css";

export default function SearchItemsPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    description: "",
    search: "",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const buildQueryParams = () => {
    const query = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) {
        query[key] = value.trim();
      }
    });
    return query;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (hasUnsafeInputInObject(filters)) {
      setError("Search filters contain disallowed characters or patterns.");
      setLoading(false);
      return;
    }

    try {
      const queryParams = buildQueryParams();
      const response = await searchInventoryItems(queryParams);

      if (Array.isArray(response.data)) {
        setItems(response.data);
      } else if (Array.isArray(response.data?.results)) {
        setItems(response.data.results);
      } else {
        setItems([]);
      }
    } catch (err) {
      const data = err.response?.data;
      const errorMessage =
        (typeof data === "string" ? data : null) ||
        data?.detail ||
        data?.message ||
        (err.response?.status === 500
          ? "Server error (500): The backend crashed processing this request. Check the backend logs."
          : "Failed to fetch inventory items. Please try again.");
      setError(errorMessage);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      category: "",
      description: "",
      search: "",
    });
    setItems([]);
    setError("");
  };

  return (
    <div className="search-items-container">
      <div className="search-items-card">
        <h1>Search Inventory Items</h1>
        <p className="subtitle">
          Filter by name, category, description, or global search keyword
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSearch} className="search-items-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={filters.name}
                onChange={handleChange}
                placeholder="Contains item name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                placeholder="Contains category"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={filters.description}
                onChange={handleChange}
                placeholder="Contains description"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="search">Global Search</label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Semantic search query"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={clearFilters}
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              disabled={loading}
            >
              Back to Dashboard
            </button>
          </div>
        </form>

        <div className="results-section">
          <h2>Results ({items.length})</h2>

          {loading && <p className="info-text">Loading inventory items...</p>}

          {!loading && items.length === 0 && (
            <p className="info-text">No items found for the current filters.</p>
          )}

          {!loading && items.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.description || "-"}</td>
                      <td>{item.quantity ?? item.amount ?? "-"}</td>
                      <td>{item.category || "-"}</td>
                      <td>{item.status || "-"}</td>
                      <td>
                        <div className="button-group">
                          <button
                            type="button"
                            className="btn-secondary btn--small"
                            onClick={() => navigate(itemDetailsPath(item.id))}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn-secondary btn--small"
                            onClick={() => navigate(itemEditPath(item.id))}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
