import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import AddItemPage from "./pages/AddItemPage";
import SearchItemsPage from "./pages/SearchItemsPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import UpdateItemPage from "./pages/UpdateItemPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES, itemDetailsPath, itemEditPath } from "./constants/routes";

export default function App() {
  console.log("APP RENDERED");
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<Login />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />

          {/* Public registration route — no auth required */}
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* Public password reset routes — no auth required
          Users request a reset code, then confirm it with new password */}
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADD_ITEM}
            element={
              <ProtectedRoute>
                <AddItemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SEARCH_ITEMS}
            element={
              <ProtectedRoute>
                <SearchItemsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={itemDetailsPath(":itemId")}
            element={
              <ProtectedRoute>
                <ItemDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={itemEditPath(":itemId")}
            element={
              <ProtectedRoute>
                <UpdateItemPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
