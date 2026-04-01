export const INVENTORY_ROUTES = {
  DASHBOARD: "/dashboard",
  ADD_ITEM: "/add-item",
  SEARCH_ITEMS: "/search-items",
};

export function itemDetailsPath(itemId) {
  return `/items/${itemId}`;
}

export function itemEditPath(itemId) {
  return `/items/${itemId}/edit`;
}
