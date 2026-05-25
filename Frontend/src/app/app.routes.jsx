import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hook/useAuth.js";
import { Login } from "../features/auth/pages/Login.jsx";
import { Register } from "../features/auth/pages/Register.jsx";
import { Dashboard } from "../features/chat/pages/Dashboard.jsx";
import { History } from "../features/chat/pages/History.jsx";
import { SharedReview } from "../features/chat/pages/SharedReview.jsx";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
                <div className='flex gap-1.5'>
                    {[0, 150, 300].map(d => (
                        <span key={d} className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'
                            style={{ animationDelay: `${d}ms` }} />
                    ))}
                </div>
            </div>
        );
    }
    return user ? children : <Navigate to='/login' replace />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return !user ? children : <Navigate to='/dashboard' replace />;
};

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
