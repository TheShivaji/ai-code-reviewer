import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { setUser, setError, setLoading } from "../states/auth.slice";
import {
    getCurrentUser,
    login as loginApi,
    register as registerApi,
    logout as logoutApi
} from "../service/auth.api";
import { getAuthErrorMessage } from "../utils/getAuthErrorMessage";
import toast from "react-hot-toast";
import axios from "axios";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector((state) => state.auth);

    const handleAuthSuccess = (data) => {
        dispatch(setUser(data.user));
        if (data.message) {
            toast.success(data.message);
        } else {
            toast.success("Authentication successful!");
        }
    };

    const handleAuthError = (error) => {
        const errorMsg = getAuthErrorMessage(error);
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
    };

    const handleSignup = async (name, email, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await registerApi(name, email, password);
            if (res?.success) {
                handleAuthSuccess(res);
                return res.user;
            }
        } catch (error) {
            handleAuthError(error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async (email, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await loginApi(email, password);
            if (res?.success) {
                handleAuthSuccess(res);
                return res.user;
            }
        } catch (error) {
            handleAuthError(error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetCurrentUser = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const res = await getCurrentUser();
            if (res?.success) {
                dispatch(setUser(res.user));
                return res.user;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Expected, no toast
                dispatch(setUser(null));
                return;
            }
            handleAuthError(error);
        } finally {
            ;
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleLogout = async () => {
        dispatch(setLoading(true));
        try {
            await logoutApi();
            dispatch(setUser(null));
            toast.success("Logged out successfully");
        } catch (error) {
            handleAuthError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        loading: isLoading,
        error,
        handleLogin,
        handleSignup,
        handleGetCurrentUser,
        handleLogout
    };
};

export default useAuth;
