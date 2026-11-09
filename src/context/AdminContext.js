import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";
import { calculateRateLimitStatus, GITHUB_CONFIG } from "../utils/github";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
	// PURE IN-MEMORY STATE: Never stored in localStorage or sessionStorage
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [adminUser, setAdminUser] = useState(null);
	const [githubToken, setGithubToken] = useState("");
	const [adminEmail, setAdminEmail] = useState("");
	const [toast, setToast] = useState(null);
	const toastId = useRef(0);

	// In-memory sliding window action timestamps for push/revert
	const [inMemoryActions, setInMemoryActions] = useState([]);

	// Record a write operation (push or revert)
	const recordAction = useCallback((timestamp = Date.now()) => {
		setInMemoryActions((prev) => {
			const cutoff = Date.now() - GITHUB_CONFIG.rateLimitWindowMs;
			return [...prev.filter((ts) => ts > cutoff), timestamp];
		});
	}, []);

	// Login: sets state in memory only
	const login = useCallback((token, email, userData) => {
		setGithubToken(token);
		setAdminEmail(email);
		setAdminUser(userData);
		setIsAuthenticated(true);
	}, []);

	// Logout: instantly purges all in-memory credentials
	const logout = useCallback(() => {
		setGithubToken("");
		setAdminEmail("");
		setAdminUser(null);
		setIsAuthenticated(false);
		setInMemoryActions([]);
	}, []);

	const showToast = useCallback((type, title, message) => {
		toastId.current += 1;
		setToast({ id: toastId.current, type, title, message });
	}, []);

	const dismissToast = useCallback(() => {
		setToast(null);
	}, []);

	// Compute current rate limit
	const getRateLimitInfo = useCallback(
		(recentCommits = []) => {
			return calculateRateLimitStatus(inMemoryActions, recentCommits);
		},
		[inMemoryActions]
	);

	const contextValue = useMemo(
		() => ({
			isAuthenticated,
			adminUser,
			githubToken,
			adminEmail,
			inMemoryActions,
			toast,
			login,
			logout,
			showToast,
			dismissToast,
			recordAction,
			getRateLimitInfo,
		}),
		[
			isAuthenticated,
			adminUser,
			githubToken,
			adminEmail,
			inMemoryActions,
			toast,
			login,
			logout,
			showToast,
			dismissToast,
			recordAction,
			getRateLimitInfo,
		]
	);

	return (
		<AdminContext.Provider value={contextValue}>
			{children}
		</AdminContext.Provider>
	);
};

export const useAdmin = () => {
	const context = useContext(AdminContext);
	if (!context) {
		throw new Error("useAdmin must be used within an AdminProvider");
	}
	return context;
};
