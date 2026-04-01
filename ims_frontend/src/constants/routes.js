import { AUTH_ROUTES } from "../features/auth";
import {
  INVENTORY_ROUTES,
  itemDetailsPath,
  itemEditPath,
} from "../features/inventory";

export const ROUTES = {
  ...AUTH_ROUTES,
  ...INVENTORY_ROUTES,
};

export { itemDetailsPath, itemEditPath };
