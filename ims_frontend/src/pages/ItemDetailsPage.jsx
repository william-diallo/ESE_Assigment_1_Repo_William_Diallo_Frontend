import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteInventoryItem, getInventoryItem } from "../services/api";
import "../styles/ItemDetailsPage.css";

export default function ItemDetailsPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      setError("");

      try {
        const response = await getInventoryItem(itemId);
        setItem(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail ||
          "Unable to load item details. The item may not exist.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      await deleteInventoryItem(itemId);
      setSuccessMessage("Item deleted successfully.");

      setTimeout(() => {
        navigate("/search-items");
      }, 800);
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        "Failed to delete item. Please try again.";
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="item-details-container">
        <div className="item-details-card">
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="item-details-container">
        <div className="item-details-card">
          <h1>Item Details</h1>
          <div className="error-message">{error}</div>
          <button className="btn-secondary" onClick={() => navigate("/search-items")}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-details-container">
      <div className="item-details-card">
        <h1>Inventory Item Details</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {item && (
          <div className="details-grid">
            <div className="detail-row">
              <span className="label">ID</span>
              <span className="value">{item.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Name</span>
              <span className="value">{item.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Description</span>
              <span className="value">{item.description || "-"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Quantity</span>
              <span className="value">{item.quantity ?? item.amount ?? "-"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Category</span>
              <span className="value">{item.category || "-"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status</span>
              <span className="value">{item.status || "-"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Created At</span>
              <span className="value">{item.created_at || "-"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Updated At</span>
              <span className="value">{item.updated_at || "-"}</span>
            </div>
            <div className="detail-row">
              <span className="label">Created By</span>
              <span className="value">{item.created_by || "-"}</span>
            </div>
          </div>
        )}

        <div className="actions-row">
          <button className="btn-secondary" onClick={() => navigate("/search-items")}> 
            Back to Search
          </button>
          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={deleting || !item}
          >
            {deleting ? "Deleting..." : "Delete Item"}
          </button>
        </div>

        <p className="hint-text">
          Note: Deletion is allowed only for admin/staff users. If you are not
          authorized, the API returns a 403 response.
        </p>
      </div>
    </div>
  );
}
