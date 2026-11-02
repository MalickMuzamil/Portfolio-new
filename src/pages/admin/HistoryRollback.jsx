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

				{/* Notice Banner */}
				<div className="admin-security-note" style={{ marginBottom: 20 }}>
					<FontAwesomeIcon icon={faExclamationTriangle} style={{ color: "#f59e0b", marginRight: 6 }} />
					<strong>Safety Limit Rules:</strong> You can rollback to any of the last{" "}
					<strong>{GITHUB_CONFIG.maxRollbackCommits} commits</strong>. Every rollback or push counts toward your shared rate limit (max 3 actions per 10 minutes).
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
									className="admin-item-row"
									style={{
										borderLeft: isCurrentHead ? "3px solid var(--link-color)" : "1px solid rgba(120, 120, 140, 0.15)",
									}}
								>
									<div className="admin-item-main">
										<div className="admin-item-title">
											<span style={{ fontSize: 14 }}>{c.message}</span>
											{isCurrentHead && (
												<span className="admin-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
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

						<div
							style={{
								background: "rgba(120, 120, 140, 0.08)",
								padding: "12px 16px",
								borderRadius: 8,
								margin: "12px 0",
								border: "1px solid rgba(120, 120, 140, 0.2)",
							}}
						>
							<div style={{ fontWeight: 600, marginBottom: 4 }}>"{selectedCommit.message}"</div>
							<div style={{ fontSize: 12, color: "var(--secondary-color)" }}>
								Commit SHA: <code>{selectedCommit.sha}</code> &bull; {formatRelativeTime(selectedCommit.date)}
							</div>
						</div>

						<div className="admin-security-note">
							<strong>What happens next:</strong>
							<ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
								<li>Files <code>src/data/user.js</code> and <code>src/data/experience.js</code> will be restored to that snapshot.</li>
								<li>A new revert commit will be pushed directly to GitHub <code>main</code>.</li>
								<li>Vercel will immediately begin a live production redeployment (~45s).</li>
								<li>This action will use 1 of your 3 allowed operations for the 10-minute window.</li>
							</ul>
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
