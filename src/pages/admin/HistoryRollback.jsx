import React, { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../../context/AdminContext";
import { fetchCommitHistory, revertToCommit, GITHUB_CONFIG } from "../../utils/github";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHistory,
	faUndo,
	faSync,
	faExclamationTriangle,
	faArrowUpRightFromSquare,
	faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const HistoryRollback = ({ onRollbackComplete, rateLimitInfo }) => {
	const { githubToken, recordAction } = useAdmin();
	const [commits, setCommits] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [selectedCommit, setSelectedCommit] = useState(null);
	const [isRollingBack, setIsRollingBack] = useState(false);

	const loadHistory = useCallback(async () => {
		if (!githubToken) return;
		setIsLoading(true);
		setError("");
		try {
			const list = await fetchCommitHistory(githubToken, "src/data", 10);
			setCommits(list);
		} catch (err) {
			setError(err.message || "Failed to load commit history.");
		} finally {
			setIsLoading(false);
		}
	}, [githubToken]);

	useEffect(() => {
		loadHistory();
	}, [loadHistory]);

	const handleRollback = async () => {
		if (!selectedCommit) return;

		// Verify rate limit
		if (!rateLimitInfo.isAllowed) {
			setError(`Rate limit active! You cannot revert right now. Please wait for the 10-minute cooldown.`);
			setSelectedCommit(null);
			return;
		}

		setIsRollingBack(true);
		setError("");
		setSuccessMsg("");

		try {
			const results = await revertToCommit(
				githubToken,
				selectedCommit.sha,
				selectedCommit.message
			);

			const failed = results.filter((r) => !r.success);
			if (failed.length > 0) {
				throw new Error(`Failed to restore some files: ${failed.map((f) => f.path).join(", ")}`);
			}

			// Record action for the 10-minute rate limiter
			recordAction(Date.now());

			setSuccessMsg(
				`Successfully rolled back to commit ${selectedCommit.shortSha}! GitHub has received the revert commit and Vercel is redeploying.`
			);
			setSelectedCommit(null);

			// Reload history & inform parent
			await loadHistory();
			if (onRollbackComplete) {
				onRollbackComplete();
			}
		} catch (err) {
			setError(err.message || "Rollback failed.");
		} finally {
			setIsRollingBack(false);
		}
	};

	const formatRelativeTime = (isoString) => {
		const diffMs = Date.now() - new Date(isoString).getTime();
		const diffMins = Math.floor(diffMs / 60000);
		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
	};

	return (
		<div className="history-rollback-container">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">
							<FontAwesomeIcon icon={faHistory} style={{ color: "var(--link-color)" }} />
							<span>Version History & Safe Rollback</span>
						</h3>
						<span className="admin-card-subtitle">
							Direct commit history from GitHub branch <strong>{GITHUB_CONFIG.branch}</strong>. Reverting creates an instant restore commit.
						</span>
					</div>

					<button
						type="button"
						className="admin-btn admin-btn-secondary"
						onClick={loadHistory}
						disabled={isLoading}
					>
						<FontAwesomeIcon icon={faSync} className={isLoading ? "spinner" : ""} />
						<span>Refresh</span>
					</button>
				</div>

				{/* Safety Notice */}
				<div className="admin-security-note" style={{ marginBottom: 20 }}>
					<FontAwesomeIcon icon={faExclamationTriangle} style={{ color: "#fbbf24", marginRight: 8 }} />
					<span>Instant snapshot rollback is available for the last <strong>{GITHUB_CONFIG.maxRollbackCommits} commits</strong>.</span>
				</div>

				{error && <div className="admin-alert-error">{error}</div>}

				{successMsg && (
					<div
						className="admin-security-note"
						style={{
							background: "rgba(16, 185, 129, 0.1)",
							borderColor: "rgba(16, 185, 129, 0.3)",
							color: "#10b981",
							marginBottom: 16,
						}}
					>
						<FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 6 }} />
						{successMsg}
					</div>
				)}

				{isLoading && commits.length === 0 ? (
					<div style={{ textAlign: "center", padding: 30, color: "var(--secondary-color)" }}>
						<span className="spinner" style={{ marginRight: 8 }}></span>
						Fetching commit history from GitHub...
					</div>
				) : commits.length === 0 ? (
					<div style={{ textAlign: "center", padding: 30, color: "var(--secondary-color)" }}>
						No recent commits found for data files.
					</div>
				) : (
					<div className="commit-list">
						{commits.map((c, index) => {
							const isWithinLimit = index > 0 && index <= GITHUB_CONFIG.maxRollbackCommits;
							const isCurrentHead = index === 0;

							return (
								<div
									key={c.sha}
									className={`admin-item-row ${isCurrentHead ? "admin-commit-current" : ""}`}
								>
									<div className="admin-item-main">
										<div className="admin-item-title">
											<span style={{ fontSize: 14 }}>{c.message}</span>
											{isCurrentHead && (
												<span className="admin-badge" style={{ background: "rgba(16, 185, 129, 0.18)", color: "#34d399", borderColor: "rgba(16, 185, 129, 0.4)" }}>
													Current Live Version
												</span>
											)}
										</div>
										<div className="admin-item-meta" style={{ display: "flex", gap: 10, marginTop: 4 }}>
											<code>{c.shortSha}</code>
											<span>by {c.authorName}</span>
											<span>&bull;</span>
											<span>{formatRelativeTime(c.date)}</span>
											<a
												href={c.htmlUrl}
												target="_blank"
												rel="noopener noreferrer"
												style={{ color: "var(--link-color)", marginLeft: 6 }}
												title="View commit on GitHub"
											>
												<FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: 11 }} />
											</a>
										</div>
									</div>

									<div className="admin-item-controls">
										{isCurrentHead ? (
											<span style={{ fontSize: 12, color: "var(--secondary-color)", paddingRight: 8 }}>
												Head
											</span>
										) : isWithinLimit ? (
											<button
												type="button"
												className="admin-btn admin-btn-secondary"
												style={{ padding: "6px 12px", fontSize: 13 }}
												disabled={!rateLimitInfo.isAllowed || isRollingBack}
												onClick={() => setSelectedCommit(c)}
											>
												<FontAwesomeIcon icon={faUndo} />
												<span>Revert to this</span>
											</button>
										) : (
											<span
												style={{
													fontSize: 11,
													color: "var(--secondary-color)",
													background: "rgba(120, 120, 140, 0.1)",
													padding: "4px 8px",
													borderRadius: 4,
												}}
											>
												Beyond safe limit ({GITHUB_CONFIG.maxRollbackCommits})
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Confirmation Modal */}
			{selectedCommit && (
				<div className="admin-modal-overlay">
					<div className="admin-modal">
						<div className="admin-card-header">
							<h3 className="admin-card-title">
								<FontAwesomeIcon icon={faUndo} style={{ color: "var(--link-color)" }} />
								<span>Confirm Rollback</span>
							</h3>
						</div>

						<p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--primary-color)" }}>
							Are you sure you want to revert your portfolio to commit:
						</p>

						<div className="admin-commit-preview-box">
							<div style={{ fontWeight: 600, marginBottom: 4, color: "#ffffff" }}>"{selectedCommit.message}"</div>
							<div style={{ fontSize: 12, color: "var(--secondary-color)" }}>
								Commit SHA: <code>{selectedCommit.sha}</code> &bull; {formatRelativeTime(selectedCommit.date)}
							</div>
						</div>

						<div className="admin-security-note">
							Restores <code>user.js</code> and <code>experience.js</code> to this commit and triggers a Vercel production deployment.
						</div>

						<div className="admin-modal-actions">
							<button
								type="button"
								className="admin-btn admin-btn-secondary"
								onClick={() => setSelectedCommit(null)}
								disabled={isRollingBack}
							>
								Cancel
							</button>
							<button
								type="button"
								className="admin-btn admin-btn-danger"
								onClick={handleRollback}
								disabled={isRollingBack}
							>
								{isRollingBack ? (
									<>
										<span className="spinner"></span>
										<span>Reverting & Pushing...</span>
									</>
								) : (
									<>
										<FontAwesomeIcon icon={faUndo} />
										<span>Confirm & Deploy Rollback</span>
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default HistoryRollback;
