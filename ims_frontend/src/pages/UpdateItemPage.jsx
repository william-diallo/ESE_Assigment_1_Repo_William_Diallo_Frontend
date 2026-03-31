import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInventoryItem, updateInventoryItem } from "../services/api";
import "../styles/UpdateItemPage.css";

function normalizeError(err, fallback) {
  const data = err.response?.data;
  const categoryOptions = [
    "Electronics - Home Appliances",
    "Electronics - Games",
    "Electronics - Misc",
    "Food - Fruits and Vegetables",
    "Food - Bakery",
    "Food - Misc",
    "Home",
  ];

  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;

  if (typeof data === "object") {
    const firstValue = Object.values(data)[0];
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return String(firstValue[0]);
    }
    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return fallback;
}

export default function UpdateItemPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      setError("");

      try {
        const response = await getInventoryItem(itemId);
        const item = response.data;

        setFormData({
          name: item.name || "",
          description: item.description || "",
          category: item.category || "",
          quantity: String(item.quantity ?? item.amount ?? ""),
        });
      } catch (err) {
        setError(
          normalizeError(err, "Unable to load item for editing. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    const quantityValue = parseInt(formData.quantity, 10);
    if (Number.isNaN(quantityValue)) {
      setError("Quantity must be a valid integer.");
      return;
    }

    if (quantityValue < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      quantity: quantityValue,
    };

    setSaving(true);
    try {
      await updateInventoryItem(itemId, payload);
      navigate(`/items/${itemId}`, {
        state: { successMessage: "Item updated successfully." },
      });
    } catch (err) {
      setError(normalizeError(err, "Failed to update item. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="update-item-container">
        <div className="update-item-card">
          <p>Loading item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="update-item-container">
      <div className="update-item-card">
        <h1>Update Inventory Item</h1>
        <p className="subtitle">Only admin users can update inventory items.</p>

        {error && <div className="error-message">{error}</div>}

        <form className="update-item-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={saving}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Item"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/items/${itemId}`)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
