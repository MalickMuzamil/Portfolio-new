import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import AdminLogin from "./AdminLogin";
import RateLimitBadge from "./RateLimitBadge";
import HomeEditor from "./HomeEditor";
import ExperienceEditor from "./ExperienceEditor";
import ProjectsEditor from "./ProjectsEditor";
import HistoryRollback from "./HistoryRollback";

import initialInfo from "../../data/user";
import initialExperience from "../../data/experience";

import { serializeInfo, serializeExperience } from "../../utils/serializer";
import {
	fetchRepoFile,
	commitRepoFile,
	fetchCommitHistory,
	GITHUB_CONFIG,
} from "../../utils/github";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faBriefcase,
	faProjectDiagram,
	faHistory,
	faSignOutAlt,
	faArrowUpRightFromSquare,
	faCloudUploadAlt,
	faUndo,
	faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./styles/admin.css";

const Admin = () => {
	const {
		isAuthenticated,
		githubToken,
		adminUser,
		logout,
		recordAction,
		getRateLimitInfo,
	} = useAdmin();

	// Active tab
	const [activeTab, setActiveTab] = useState("home");

	// In-memory working draft state
	const [infoData, setInfoData] = useState(() => JSON.parse(JSON.stringify(initialInfo)));
	const [experienceData, setExperienceData] = useState(() =>
		JSON.parse(JSON.stringify(initialExperience))
	);

	// Committed baseline to detect changes
	const [baselineInfo, setBaselineInfo] = useState(() =>
		JSON.parse(JSON.stringify(initialInfo))
	);
	const [baselineExperience, setBaselineExperience] = useState(() =>
		JSON.parse(JSON.stringify(initialExperience))
	);

	// GitHub remote sync state
	const [remoteFileShas, setRemoteFileShas] = useState({
		userSha: null,
		experienceSha: null,
	});

	// Recent commits from GitHub for rate limit auditing
	const [recentCommits, setRecentCommits] = useState([]);

	// Publishing state
	const [isPublishing, setIsPublishing] = useState(false);
	const [publishStatusText, setPublishStatusText] = useState("");
	const [notification, setNotification] = useState(null);
	const [commitMessage, setCommitMessage] = useState("feat(portfolio): update portfolio content via Admin Dashboard");

	// Fetch latest file SHAs and recent commits from GitHub on login
	const syncWithGitHub = useCallback(async () => {
		if (!githubToken) return;
		try {
			// Fetch commit history to verify recent commit timestamps for rate limit
			const commits = await fetchCommitHistory(githubToken, "src/data", 10).catch(() => []);
			setRecentCommits(commits);

			// Fetch latest SHAs from main branch
			const userFile = await fetchRepoFile(githubToken, "src/data/user.js").catch(() => null);
			const expFile = await fetchRepoFile(githubToken, "src/data/experience.js").catch(() => null);

			setRemoteFileShas({
				userSha: userFile?.sha || null,
				experienceSha: expFile?.sha || null,
			});
		} catch (err) {
			console.warn("GitHub sync check:", err.message);
		}
	}, [githubToken]);

	useEffect(() => {
		if (isAuthenticated) {
			syncWithGitHub();
		}
	}, [isAuthenticated, syncWithGitHub]);

	// Rate limit calculation
	const rateLimitInfo = useMemo(() => {
		return getRateLimitInfo(recentCommits);
	}, [getRateLimitInfo, recentCommits]);

	// Dirty tracking
	const hasChanges = useMemo(() => {
		const infoChanged = JSON.stringify(infoData) !== JSON.stringify(baselineInfo);
		const expChanged = JSON.stringify(experienceData) !== JSON.stringify(baselineExperience);
		return infoChanged || expChanged;
	}, [infoData, baselineInfo, experienceData, baselineExperience]);

	// Discard unsaved changes
	const handleResetChanges = () => {
		if (window.confirm("Discard all unsaved edits and reset to your last saved version?")) {
			setInfoData(JSON.parse(JSON.stringify(baselineInfo)));
			setExperienceData(JSON.parse(JSON.stringify(baselineExperience)));
			setNotification({ type: "info", message: "Draft reverted to last saved state." });
		}
	};

	// Publish changes directly to GitHub
	const handlePublishToGitHub = async () => {
		if (!hasChanges) {
			alert("No changes detected to publish.");
			return;
		}

		if (!rateLimitInfo.isAllowed) {
			alert(`Rate limit reached! You can only push/revert 3 times per 10 minutes. Please wait for the cooldown.`);
			return;
		}

		setIsPublishing(true);
		setPublishStatusText("Connecting to GitHub...");
		setNotification(null);

		try {
			// 1. Fetch latest SHAs
			setPublishStatusText("Verifying latest repository commit...");
			const currentUserFile = await fetchRepoFile(githubToken, "src/data/user.js");
			const currentExpFile = await fetchRepoFile(githubToken, "src/data/experience.js");

			// 2. Serialize in-memory data
			setPublishStatusText("Generating clean JavaScript source code...");
			const userCode = serializeInfo(infoData);
			const expCode = serializeExperience(experienceData);

			const msg = commitMessage.trim() || "feat(portfolio): update portfolio content via Admin Dashboard";

			// 3. Commit src/data/user.js
			setPublishStatusText("Committing src/data/user.js to main branch...");
			await commitRepoFile(
				githubToken,
				"src/data/user.js",
				userCode,
				msg,
				currentUserFile.sha
			);

			// 4. Commit src/data/experience.js
			setPublishStatusText("Committing src/data/experience.js to main branch...");
			await commitRepoFile(
				githubToken,
				"src/data/experience.js",
				expCode,
				msg,
				currentExpFile.sha
			);

			// 5. Record write action for 10-minute rate limiting
			recordAction(Date.now());

			// 6. Update baseline
			setBaselineInfo(JSON.parse(JSON.stringify(infoData)));
			setBaselineExperience(JSON.parse(JSON.stringify(experienceData)));

			setNotification({
				type: "success",
				message: "Success! Pushed changes to GitHub 'main'. Vercel has initiated a live deployment (~45s).",
			});

			await syncWithGitHub();
		} catch (err) {
			console.error("Publish error:", err);
			setNotification({
				type: "error",
				message: `Deployment failed: ${err.message || "Could not push to GitHub."}`,
			});
		} finally {
			setIsPublishing(false);
			setPublishStatusText("");
		}
	};

	// Callback when rollback completes
	const handleRollbackComplete = async () => {
		setNotification({
			type: "success",
			message: "Rollback committed to GitHub! Refreshing page to align with restored version.",
		});
		await syncWithGitHub();
		setTimeout(() => {
			window.location.reload();
		}, 1500);
	};

	// If not authenticated, render Login view
	if (!isAuthenticated) {
		return <AdminLogin />;
	}

	return (
		<div className="admin-page-container">
			{/* Top Header */}
			<header className="admin-header">
				<div className="admin-header-content">
					<div className="admin-brand">
						<Link to="/" style={{ textDecoration: "none" }}>
							<h1 className="admin-brand-title">
								<span>Portfolio Admin</span>
								<span className="admin-badge">Live Sync</span>
							</h1>
						</Link>
						<span style={{ fontSize: 13, color: "var(--secondary-color)" }}>
							Logged in as <strong>{adminUser?.login || GITHUB_CONFIG.owner}</strong>
						</span>
					</div>

					<div className="admin-header-actions">
						<RateLimitBadge
							rateLimitInfo={rateLimitInfo}
							onWindowExpired={syncWithGitHub}
						/>

						<a
							href="https://muzamil-salee.vercel.app"
							target="_blank"
							rel="noopener noreferrer"
							className="admin-btn admin-btn-secondary"
						>
							<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
							<span>Live Site</span>
						</a>

						<button
							type="button"
							className="admin-btn admin-btn-secondary"
							onClick={logout}
							title="Log out and wipe in-memory token"
						>
							<FontAwesomeIcon icon={faSignOutAlt} />
							<span>Logout</span>
						</button>
					</div>
				</div>
			</header>

			{/* Navigation Tabs */}
			<nav className="admin-nav-tabs">
				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "home" ? "active" : ""}`}
					onClick={() => setActiveTab("home")}
				>
					<FontAwesomeIcon icon={faHome} />
					<span>Home & Bio</span>
				</button>

				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "experience" ? "active" : ""}`}
					onClick={() => setActiveTab("experience")}
				>
					<FontAwesomeIcon icon={faBriefcase} />
					<span>Experience & CV ({experienceData.length})</span>
				</button>

				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`}
					onClick={() => setActiveTab("projects")}
				>
					<FontAwesomeIcon icon={faProjectDiagram} />
					<span>Projects ({infoData.projects?.length || 0})</span>
				</button>

				<button
					type="button"
					className={`admin-tab-btn ${activeTab === "history" ? "active" : ""}`}
					onClick={() => setActiveTab("history")}
				>
					<FontAwesomeIcon icon={faHistory} />
					<span>History & Rollback</span>
				</button>
			</nav>

			{/* Notification Banner */}
			<div className="admin-content" style={{ marginBottom: 0, paddingBottom: 0 }}>
				{notification && (
					<div
						className={`admin-security-note ${
							notification.type === "error" ? "admin-alert-error" : ""
						}`}
						style={
							notification.type === "success"
								? { background: "rgba(16, 185, 129, 0.12)", borderColor: "rgba(16, 185, 129, 0.3)", color: "#10b981" }
								: {}
						}
					>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<span>
								{notification.type === "success" && <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 6 }} />}
								{notification.message}
							</span>
							<button
								type="button"
								style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold" }}
								onClick={() => setNotification(null)}
							>
								&times;
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Main Tab Panels */}
			<main className="admin-content">
				{activeTab === "home" && (
					<HomeEditor info={infoData} onChange={setInfoData} />
				)}

				{activeTab === "experience" && (
					<ExperienceEditor
						experiences={experienceData}
						onChange={setExperienceData}
					/>
				)}

				{activeTab === "projects" && (
					<ProjectsEditor
						projects={infoData.projects || []}
						onChange={(updatedProjects) =>
							setInfoData({ ...infoData, projects: updatedProjects })
						}
					/>
				)}

				{activeTab === "history" && (
					<HistoryRollback
						onRollbackComplete={handleRollbackComplete}
						rateLimitInfo={rateLimitInfo}
					/>
				)}
			</main>

			{/* Sticky Publish Footer */}
			<footer className="admin-sticky-footer">
				<div className="admin-sticky-footer-inner">
					<div className="admin-status-message">
						{hasChanges ? (
							<span style={{ color: "#f59e0b" }}>
								&bull; You have unsaved edits in memory.
							</span>
						) : (
							<span style={{ color: "var(--secondary-color)" }}>
								&bull; All changes are currently up to date with repository.
							</span>
						)}
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
						{hasChanges && (
							<button
								type="button"
								className="admin-btn admin-btn-secondary"
								onClick={handleResetChanges}
								disabled={isPublishing}
							>
								<FontAwesomeIcon icon={faUndo} />
								<span>Discard Changes</span>
							</button>
						)}

						<button
							type="button"
							className="admin-btn admin-btn-primary"
							onClick={handlePublishToGitHub}
							disabled={!hasChanges || !rateLimitInfo.isAllowed || isPublishing}
						>
							{isPublishing ? (
								<>
									<span className="spinner"></span>
									<span>{publishStatusText || "Publishing..."}</span>
								</>
							) : (
								<>
									<FontAwesomeIcon icon={faCloudUploadAlt} />
									<span>Publish & Push to GitHub</span>
								</>
							)}
						</button>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Admin;
