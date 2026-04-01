import apiClient from "./apiClient";

export function createInventoryItem(itemData) {
  return apiClient.post("/inventory/items/", itemData);
}

export function searchInventoryItems(filters = {}) {
  return apiClient.get("/inventory/items/", { params: filters });
}

export function getInventoryItem(itemId) {
  return apiClient.get(`/inventory/items/${itemId}/`);
}

export function deleteInventoryItem(itemId) {
  return apiClient.delete(`/inventory/items/${itemId}/`);
}

export function updateInventoryItem(itemId, fields) {
  return apiClient.patch(`/inventory/items/${itemId}/`, fields);
}
