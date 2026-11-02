import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faProjectDiagram,
	faPlus,
	faEdit,
	faTrash,
	faArrowUp,
	faArrowDown,
	faTimes,
	faCheck,
	faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

const AVAILABLE_TECH_ICONS = [
	{ name: "Python", path: "/techstack/python.svg" },
	{ name: "Apache Spark", path: "/techstack/spark.svg" },
	{ name: "Databricks", path: "/techstack/databricks.svg" },
	{ name: "AWS", path: "/techstack/aws.svg" },
	{ name: "Azure", path: "/techstack/azure.svg" },
	{ name: "SQL", path: "/techstack/sql.svg" },
	{ name: "React", path: "/techstack/react.svg" },
	{ name: "Next.js", path: "/techstack/nextjs.svg" },
	{ name: "Angular", path: "/techstack/angular.svg" },
	{ name: "Node.js", path: "/techstack/nodejs.svg" },
	{ name: "Express.js", path: "/techstack/express.svg" },
	{ name: "MongoDB", path: "/techstack/mongodb.svg" },
	{ name: "MySQL", path: "/techstack/mysql.svg" },
	{ name: "Tailwind CSS", path: "/techstack/tailwindcss.svg" },
	{ name: "Bootstrap", path: "/techstack/bootstrap.svg" },
	{ name: "Git", path: "/techstack/git.svg" },
	{ name: "Postman", path: "/techstack/postman.svg" },
	{ name: "JavaScript", path: "/techstack/javascript-icon.svg" },
	{ name: "HTML", path: "/techstack/html.svg" },
	{ name: "CSS", path: "/techstack/css.svg" },
];

const ProjectsEditor = ({ projects = [], onChange }) => {
	const [activeFilter, setActiveFilter] = useState("all");
	const [editingIndex, setEditingIndex] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		category: "full-stack",
		description: "",
		logo: "/techstack/react.svg",
		stackIcons: ["/techstack/react.svg"],
		linkText: "View on GitHub",
		link: "https://github.com/MalickMuzamil",
	});

	const openAddModal = () => {
		setEditingIndex(null);
		setFormData({
			title: "",
			category: "full-stack",
			description: "",
			logo: "/techstack/react.svg",
			stackIcons: ["/techstack/react.svg"],
			linkText: "View on GitHub",
			link: "https://github.com/MalickMuzamil",
		});
		setIsModalOpen(true);
	};

	const openEditModal = (realIndex) => {
		setEditingIndex(realIndex);
		const p = projects[realIndex];
		setFormData({
			title: p.title || "",
			category: p.category || "full-stack",
			description: p.description || "",
			logo: p.logo || "/techstack/react.svg",
			stackIcons: p.stackIcons && p.stackIcons.length > 0 ? [...p.stackIcons] : [],
			linkText: p.linkText || "View on GitHub",
			link: p.link || "",
		});
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingIndex(null);
	};

	const handleSave = (e) => {
		e.preventDefault();
		const updatedProject = { ...formData };

		if (editingIndex === null) {
			onChange([updatedProject, ...projects]);
		} else {
			const updatedList = [...projects];
			updatedList[editingIndex] = updatedProject;
			onChange(updatedList);
		}
		closeModal();
	};

	const handleDelete = (realIndex) => {
		if (window.confirm(`Are you sure you want to delete "${projects[realIndex].title}"?`)) {
			const updatedList = projects.filter((_, i) => i !== realIndex);
			onChange(updatedList);
		}
	};

	const handleMove = (realIndex, direction) => {
		const targetIndex = realIndex + direction;
		if (targetIndex < 0 || targetIndex >= projects.length) return;
		const updatedList = [...projects];
		const temp = updatedList[realIndex];
		updatedList[realIndex] = updatedList[targetIndex];
		updatedList[targetIndex] = temp;
		onChange(updatedList);
	};

	const toggleStackIcon = (iconPath) => {
		const exists = formData.stackIcons.includes(iconPath);
		if (exists) {
			setFormData({
				...formData,
				stackIcons: formData.stackIcons.filter((p) => p !== iconPath),
			});
		} else {
			setFormData({
				...formData,
				stackIcons: [...formData.stackIcons, iconPath],
			});
		}
	};

	const filteredProjects = projects.map((p, originalIndex) => ({ ...p, originalIndex })).filter((p) => {
		if (activeFilter === "all") return true;
		return p.category === activeFilter;
	});

	return (
		<div className="projects-editor-container">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">
							<FontAwesomeIcon icon={faProjectDiagram} style={{ color: "var(--link-color)" }} />
							<span>Projects Showcase ({projects.length})</span>
						</h3>
						<span className="admin-card-subtitle">
							Projects displayed on /projects and the homepage grid
						</span>
					</div>

					<button type="button" className="admin-btn admin-btn-primary" onClick={openAddModal}>
						<FontAwesomeIcon icon={faPlus} />
						<span>Add New Project</span>
					</button>
				</div>

				{/* Filter Tabs */}
				<div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
					<button
						type="button"
						className={`tech-badge-toggle ${activeFilter === "all" ? "selected" : ""}`}
						onClick={() => setActiveFilter("all")}
					>
						All ({projects.length})
					</button>
					<button
						type="button"
						className={`tech-badge-toggle ${activeFilter === "data-engineering" ? "selected" : ""}`}
						onClick={() => setActiveFilter("data-engineering")}
					>
						Data Engineering ({projects.filter((p) => p.category === "data-engineering").length})
					</button>
					<button
						type="button"
						className={`tech-badge-toggle ${activeFilter === "full-stack" ? "selected" : ""}`}
						onClick={() => setActiveFilter("full-stack")}
					>
						Full Stack ({projects.filter((p) => p.category === "full-stack").length})
					</button>
				</div>

				{/* Project List */}
				<div className="projects-list">
					{filteredProjects.map((p) => (
						<div key={p.originalIndex} className="admin-item-row">
							<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
								<img
									src={p.logo || "/techstack/react.svg"}
									alt=""
									style={{ width: 28, height: 28, objectFit: "contain" }}
									onError={(e) => {
										e.target.style.display = "none";
									}}
								/>
							</div>

							<div className="admin-item-main">
								<div className="admin-item-title">
									<span>{p.title}</span>
									<span className="admin-badge" style={{ fontSize: 10 }}>
										{p.category}
									</span>
								</div>
								<div className="admin-item-meta" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
									<span>{p.linkText || "Link"}</span>
									{p.link && (
										<a
											href={p.link}
											target="_blank"
											rel="noopener noreferrer"
											style={{ color: "var(--link-color)", textDecoration: "none" }}
										>
											<FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: 11 }} />
										</a>
									)}
									<span>&bull;</span>
									<div style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
										{p.stackIcons?.slice(0, 5).map((icon, i) => (
											<img key={i} src={icon} alt="" style={{ width: 14, height: 14 }} />
										))}
										{p.stackIcons?.length > 5 && (
											<span style={{ fontSize: 10 }}>+{p.stackIcons.length - 5}</span>
										)}
									</div>
								</div>
							</div>

							<div className="admin-item-controls">
								<button
									type="button"
									className="admin-icon-btn"
									title="Move Up"
									disabled={p.originalIndex === 0}
									onClick={() => handleMove(p.originalIndex, -1)}
								>
									<FontAwesomeIcon icon={faArrowUp} />
								</button>
								<button
									type="button"
									className="admin-icon-btn"
									title="Move Down"
									disabled={p.originalIndex === projects.length - 1}
									onClick={() => handleMove(p.originalIndex, 1)}
								>
									<FontAwesomeIcon icon={faArrowDown} />
								</button>
								<button
									type="button"
									className="admin-icon-btn"
									title="Edit"
									onClick={() => openEditModal(p.originalIndex)}
								>
									<FontAwesomeIcon icon={faEdit} />
								</button>
								<button
									type="button"
									className="admin-icon-btn delete"
									title="Delete"
									onClick={() => handleDelete(p.originalIndex)}
								>
									<FontAwesomeIcon icon={faTrash} />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Modal for Add / Edit Project */}
			{isModalOpen && (
				<div className="admin-modal-overlay">
					<div className="admin-modal">
						<div className="admin-card-header">
							<h3 className="admin-card-title">
								<FontAwesomeIcon
									icon={editingIndex === null ? faPlus : faEdit}
									style={{ color: "var(--link-color)" }}
								/>
								<span>{editingIndex === null ? "Add New Project" : "Edit Project"}</span>
							</h3>
							<button type="button" className="admin-icon-btn" onClick={closeModal}>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>

						<form onSubmit={handleSave}>
							<div className="admin-form-group">
								<label className="admin-label">Project Title</label>
								<input
									type="text"
									className="admin-input"
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									placeholder="e.g. Medallion Lakehouse Architecture"
									required
								/>
							</div>

							<div className="admin-form-row">
								<div className="admin-form-group">
									<label className="admin-label">Category</label>
									<select
										className="admin-select"
										value={formData.category}
										onChange={(e) => setFormData({ ...formData, category: e.target.value })}
									>
										<option value="data-engineering">Data Engineering</option>
										<option value="full-stack">Full Stack</option>
									</select>
								</div>

								<div className="admin-form-group">
									<label className="admin-label">Main Icon Logo</label>
									<select
										className="admin-select"
										value={formData.logo}
										onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
									>
										{AVAILABLE_TECH_ICONS.map((tech) => (
											<option key={tech.path} value={tech.path}>
												{tech.name} ({tech.path.replace("/techstack/", "")})
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="admin-form-group">
								<label className="admin-label">Description</label>
								<textarea
									className="admin-textarea"
									rows={3}
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									placeholder="What does this project do and what problems does it solve?..."
									required
								/>
							</div>

							<div className="admin-form-group">
								<label className="admin-label">
									Select Stack Icons ({formData.stackIcons.length} chosen)
								</label>
								<div className="tech-picker-grid">
									{AVAILABLE_TECH_ICONS.map((tech) => {
										const selected = formData.stackIcons.includes(tech.path);
										return (
											<button
												key={tech.path}
												type="button"
												className={`tech-badge-toggle ${selected ? "selected" : ""}`}
												onClick={() => toggleStackIcon(tech.path)}
											>
												<img src={tech.path} alt="" />
												<span>{tech.name}</span>
											</button>
										);
									})}
								</div>
							</div>

							<div className="admin-form-row">
								<div className="admin-form-group">
									<label className="admin-label">Link Label Text</label>
									<input
										type="text"
										className="admin-input"
										value={formData.linkText}
										onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
										placeholder="e.g. View on GitHub or View Project"
										required
									/>
								</div>

								<div className="admin-form-group">
									<label className="admin-label">Target URL</label>
									<input
										type="url"
										className="admin-input"
										value={formData.link}
										onChange={(e) => setFormData({ ...formData, link: e.target.value })}
										placeholder="https://github.com/..."
										required
									/>
								</div>
							</div>

							<div className="admin-modal-actions">
								<button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
									Cancel
								</button>
								<button type="submit" className="admin-btn admin-btn-primary">
									<FontAwesomeIcon icon={faCheck} />
									<span>Save Project</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProjectsEditor;
