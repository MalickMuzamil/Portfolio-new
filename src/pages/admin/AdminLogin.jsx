import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { verifyGitHubToken, GITHUB_CONFIG } from "../../utils/github";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faShieldHalved, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AdminLogin = () => {
	const { login } = useAdmin();
	const [email, setEmail] = useState(GITHUB_CONFIG.adminEmail);
	const [token, setToken] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Email is required.");
			return;
		}

		if (email.trim().toLowerCase() !== GITHUB_CONFIG.adminEmail.toLowerCase()) {
			setError(`Access denied. Only authorized administrator (${GITHUB_CONFIG.adminEmail}) can log in.`);
			return;
		}

		if (!token.trim()) {
			setError("GitHub Personal Access Token is required.");
			return;
		}

		setIsLoading(true);

		try {
			const userData = await verifyGitHubToken(token, email);
			login(token.trim(), email.trim(), userData);
		} catch (err) {
			setError(err.message || "Failed to authenticate with GitHub.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="admin-page-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
			<div className="admin-login-box">
				<img
					src="/homepage.png"
					alt="Muzamil Saleem"
					className="admin-login-avatar"
					onError={(e) => {
						e.target.src = "/logo.png";
					}}
				/>
				<h2 className="admin-brand-title" style={{ justifyContent: "center", marginBottom: 6 }}>
					Portfolio Admin Login
				</h2>
				<p style={{ color: "var(--secondary-color)", fontSize: 13, marginBottom: 24 }}>
					Secure management for <strong>{GITHUB_CONFIG.owner}/{GITHUB_CONFIG.repo}</strong>
				</p>

				{error && <div className="admin-alert-error">{error}</div>}

				<form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
					<div className="admin-form-group">
						<label className="admin-label">Authorized Email</label>
						<input
							type="email"
							className="admin-input"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={GITHUB_CONFIG.adminEmail}
							required
							autoComplete="off"
						/>
					</div>

					<div className="admin-form-group">
						<label className="admin-label">GitHub Fine-Grained Token (PAT)</label>
						<input
							type="password"
							className="admin-input"
							value={token}
							onChange={(e) => setToken(e.target.value)}
							placeholder="github_pat_11..."
							required
							autoComplete="off"
						/>
						<span style={{ fontSize: 11, color: "var(--secondary-color)", marginTop: 4, display: "block" }}>
							Requires repository permission: <code>Contents: Read and write</code>
						</span>
					</div>

					<button
						type="submit"
						className="admin-btn admin-btn-primary"
						style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<span className="spinner"></span>
								<span>Verifying GitHub Token...</span>
							</>
						) : (
							<>
								<FontAwesomeIcon icon={faLock} />
								<span>Authenticate & Open Dashboard</span>
							</>
						)}
					</button>
				</form>

				<div className="admin-security-note">
					<div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--primary-color)", marginBottom: 4 }}>
						<FontAwesomeIcon icon={faShieldHalved} style={{ color: "var(--link-color)" }} />
						<span>Zero-LocalStorage Security</span>
					</div>
					This session is kept purely in browser memory (RAM). Nothing is stored in <code>localStorage</code> or cookies. Refreshing or closing this tab completely clears your credentials.
				</div>

				<div style={{ marginTop: 24 }}>
					<Link to="/" style={{ color: "var(--secondary-color)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
						<FontAwesomeIcon icon={faArrowLeft} />
						<span>Back to Portfolio</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
