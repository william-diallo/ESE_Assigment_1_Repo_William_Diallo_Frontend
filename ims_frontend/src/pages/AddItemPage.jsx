import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { hasUnsafeInput } from "../utils/inputValidation";
import "../styles/AddItemPage.css";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const categoryOptions = [
    "Electronics - Home Appliances",
    "Electronics - Games",
    "Electronics - Misc",
    "Food - Fruits and Vegetables",
    "Food - Bakery",
    "Food - Misc",
    "Home",
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Item name is required");
      setLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      setLoading(false);
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError("Please enter a valid quantity");
      setLoading(false);
      return;
    }

    if (hasUnsafeInput(formData.name) || hasUnsafeInput(formData.description)) {
      setError("Input contains disallowed characters or patterns");
      setLoading(false);
      return;
    }

    try {
      // Map frontend field names to backend field names
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        category: formData.category.trim(),
      };

      const response = await api.post("/inventory/items/", payload);

      // Success - redirect to dashboard or items list
      navigate("/dashboard", {
        state: { message: `Item "${response.data.name}" created successfully!` },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to create item. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <div className="add-item-card">
        <h1>Add New Inventory Item</h1>
        <p className="subtitle">Create a new item in the inventory</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-item-form">
          <div className="form-group">
            <label htmlFor="name">Item Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description (optional)"
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Select a category</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group info-text">
            <small>
              <strong>Note:</strong> The item will be created by{" "}
              <strong>{user?.email}</strong>
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating Item..." : "Create Item"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
