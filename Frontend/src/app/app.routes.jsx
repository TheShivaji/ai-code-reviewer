import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../features/auth/pages/Login.jsx";
import { Register } from "../features/auth/pages/Register.jsx";
import { Dashboard } from "../features/chat/pages/Dashboard.jsx";
import { History } from "../features/chat/pages/History.jsx";
import { SharedReview } from "../features/chat/pages/SharedReview.jsx";
import { ProtectedRoute } from "../features/auth/components/Protected.jsx";
import { PublicRoute } from "../features/auth/components/Public.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/login",
        element: <PublicRoute><Login /></PublicRoute>
    },
    {
        path: "/register",
        element: <PublicRoute><Register /></PublicRoute>
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },
    {
        path: "/history",
        element: <ProtectedRoute><History /></ProtectedRoute>
    },
    {
        path: "/shared/:shareToken",
        element: <SharedReview />
    }
]);
