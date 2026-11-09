import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { verifyGitHubToken, GITHUB_CONFIG } from "../../utils/github";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
		<div className="admin-page-container admin-login-wrapper">
			{/* Ambient Aura Background Orbs */}
			<div className="admin-aura-orb admin-aura-orb-1" aria-hidden="true" />
			<div className="admin-aura-orb admin-aura-orb-2" aria-hidden="true" />
			<div className="admin-aura-orb admin-aura-orb-3" aria-hidden="true" />

			<div className="admin-login-box">
				<div className="admin-login-avatar-wrapper">
					<img
						src="/homepage.png"
						alt="Muzamil Saleem"
						className="admin-login-avatar"
						onError={(e) => {
							e.target.src = "/logo.png";
						}}
					/>
					<span className="admin-login-avatar-glow" aria-hidden="true" />
				</div>
				<h2 className="admin-brand-title admin-login-title">
					Portfolio Admin
				</h2>
				<p className="admin-login-subtitle">
					Sign in to manage your portfolio content
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
						<label className="admin-label">GitHub Token (PAT)</label>
						<input
							type="password"
							className="admin-input"
							value={token}
							onChange={(e) => setToken(e.target.value)}
							placeholder="Enter GitHub Personal Access Token"
							required
							autoComplete="off"
						/>
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
								<span>Verifying Access...</span>
							</>
						) : (
							<>
								<FontAwesomeIcon icon={faLock} />
								<span>Sign In</span>
							</>
						)}
					</button>
				</form>

				<div style={{ marginTop: 28 }}>
					<Link to="/" style={{ color: "var(--admin-text-muted)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
						<FontAwesomeIcon icon={faArrowLeft} />
						<span>Back to Portfolio</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
