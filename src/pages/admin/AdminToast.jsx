import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckCircle,
	faExclamationCircle,
	faInfoCircle,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAdmin } from "../../context/AdminContext";

const toastIcons = {
	success: faCheckCircle,
	error: faExclamationCircle,
	info: faInfoCircle,
};

const AdminToast = () => {
	const { toast, dismissToast } = useAdmin();

	useEffect(() => {
		if (!toast) return undefined;
		const timeout = window.setTimeout(dismissToast, 4500);
		return () => window.clearTimeout(timeout);
	}, [toast, dismissToast]);

	if (!toast) return null;

	return (
		<div className="admin-toast-viewport">
			<div
				className={`admin-toast admin-toast-${toast.type}`}
				role={toast.type === "error" ? "alert" : "status"}
				aria-live={toast.type === "error" ? "assertive" : "polite"}
			>
				<span className="admin-toast-icon" aria-hidden="true">
					<FontAwesomeIcon icon={toastIcons[toast.type] || toastIcons.info} />
				</span>
				<div className="admin-toast-copy">
					<strong className="admin-toast-title">{toast.title}</strong>
					<span className="admin-toast-message">{toast.message}</span>
				</div>
				<button
					type="button"
					className="admin-toast-close"
					onClick={dismissToast}
					aria-label="Dismiss notification"
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
		</div>
	);
};

export default AdminToast;
