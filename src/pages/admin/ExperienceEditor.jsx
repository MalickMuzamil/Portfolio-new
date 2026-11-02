import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBriefcase,
	faPlus,
	faEdit,
	faTrash,
	faArrowUp,
	faArrowDown,
	faTimes,
	faCheck,
} from "@fortawesome/free-solid-svg-icons";

const ExperienceEditor = ({ experiences, onChange }) => {
	const [editingIndex, setEditingIndex] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		company: "",
		title: "",
		date: "",
		description: "",
		benefits: [""],
	});

	const openAddModal = () => {
		setEditingIndex(null);
		setFormData({
			company: "",
			title: "",
			date: "",
			description: "",
			benefits: [""],
		});
		setIsModalOpen(true);
	};

	const openEditModal = (index) => {
		setEditingIndex(index);
		const item = experiences[index];
		setFormData({
			company: item.company || "",
			title: item.title || "",
			date: item.date || "",
			description: item.description || "",
			benefits: item.benefits && item.benefits.length > 0 ? [...item.benefits] : [""],
		});
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingIndex(null);
	};

	const handleSave = (e) => {
		e.preventDefault();
		const cleanedBenefits = formData.benefits.filter((b) => b && b.trim() !== "");
		const updatedItem = {
			...formData,
			benefits: cleanedBenefits,
		};

		if (editingIndex === null) {
			// Add new
			onChange([updatedItem, ...experiences]);
		} else {
			// Update existing
			const updatedList = [...experiences];
			updatedList[editingIndex] = updatedItem;
			onChange(updatedList);
		}
		closeModal();
	};

	const handleDelete = (index) => {
		if (window.confirm(`Are you sure you want to delete "${experiences[index].company}" experience?`)) {
			const updatedList = experiences.filter((_, i) => i !== index);
			onChange(updatedList);
		}
	};

	const handleMove = (index, direction) => {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= experiences.length) return;
		const updatedList = [...experiences];
		const temp = updatedList[index];
		updatedList[index] = updatedList[targetIndex];
		updatedList[targetIndex] = temp;
		onChange(updatedList);
	};

	// Bullets helpers
	const handleBenefitChange = (bIndex, value) => {
		const newBenefits = [...formData.benefits];
		newBenefits[bIndex] = value;
		setFormData({ ...formData, benefits: newBenefits });
	};

	const addBenefitField = () => {
		setFormData({ ...formData, benefits: [...formData.benefits, ""] });
	};

	const removeBenefitField = (bIndex) => {
		const newBenefits = formData.benefits.filter((_, i) => i !== bIndex);
		setFormData({ ...formData, benefits: newBenefits.length ? newBenefits : [""] });
	};

	return (
		<div className="experience-editor-container">
			<div className="admin-card">
				<div className="admin-card-header">
					<div>
						<h3 className="admin-card-title">
							<FontAwesomeIcon icon={faBriefcase} style={{ color: "var(--link-color)" }} />
							<span>Work Experience & CV Timeline ({experiences.length})</span>
						</h3>
						<span className="admin-card-subtitle">
							Roles displayed sequentially on your /experience page and home section
						</span>
					</div>
					<button type="button" className="admin-btn admin-btn-primary" onClick={openAddModal}>
						<FontAwesomeIcon icon={faPlus} />
						<span>Add Experience</span>
					</button>
				</div>

				<div className="experience-list">
					{experiences.map((item, index) => (
						<div key={index} className="admin-item-row">
							<div className="admin-item-main">
								<div className="admin-item-title">
									<span>{item.title}</span>
									<span style={{ color: "var(--link-color)", fontWeight: 600 }}>@ {item.company}</span>
								</div>
								<div className="admin-item-meta">
									<span>{item.date}</span> &bull; <span>{item.benefits ? item.benefits.length : 0} bullet points</span>
								</div>
							</div>

							<div className="admin-item-controls">
								<button
									type="button"
									className="admin-icon-btn"
									title="Move Up"
									disabled={index === 0}
									onClick={() => handleMove(index, -1)}
								>
									<FontAwesomeIcon icon={faArrowUp} />
								</button>
								<button
									type="button"
									className="admin-icon-btn"
									title="Move Down"
									disabled={index === experiences.length - 1}
									onClick={() => handleMove(index, 1)}
								>
									<FontAwesomeIcon icon={faArrowDown} />
								</button>
								<button
									type="button"
									className="admin-icon-btn"
									title="Edit"
									onClick={() => openEditModal(index)}
								>
									<FontAwesomeIcon icon={faEdit} />
								</button>
								<button
									type="button"
									className="admin-icon-btn delete"
									title="Delete"
									onClick={() => handleDelete(index)}
								>
									<FontAwesomeIcon icon={faTrash} />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Modal for Add / Edit */}
			{isModalOpen && (
				<div className="admin-modal-overlay">
					<div className="admin-modal">
						<div className="admin-card-header">
							<h3 className="admin-card-title">
								<FontAwesomeIcon icon={editingIndex === null ? faPlus : faEdit} style={{ color: "var(--link-color)" }} />
								<span>{editingIndex === null ? "Add New Experience" : "Edit Experience"}</span>
							</h3>
							<button type="button" className="admin-icon-btn" onClick={closeModal}>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</div>

						<form onSubmit={handleSave}>
							<div className="admin-form-row">
								<div className="admin-form-group">
									<label className="admin-label">Company Name</label>
									<input
										type="text"
										className="admin-input"
										value={formData.company}
										onChange={(e) => setFormData({ ...formData, company: e.target.value })}
										placeholder="e.g. PostEx"
										required
									/>
								</div>
								<div className="admin-form-group">
									<label className="admin-label">Job Title / Role</label>
									<input
										type="text"
										className="admin-input"
										value={formData.title}
										onChange={(e) => setFormData({ ...formData, title: e.target.value })}
										placeholder="e.g. Associate Software Engineer"
										required
									/>
								</div>
							</div>

							<div className="admin-form-group">
								<label className="admin-label">Date Range</label>
								<input
									type="text"
									className="admin-input"
									value={formData.date}
									onChange={(e) => setFormData({ ...formData, date: e.target.value })}
									placeholder="e.g. July 2026 — Present"
									required
								/>
							</div>

							<div className="admin-form-group">
								<label className="admin-label">Summary / Description</label>
								<textarea
									className="admin-textarea"
									rows={3}
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									placeholder="Brief overview of role and impact..."
									required
								/>
							</div>

							<div className="admin-form-group">
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
									<label className="admin-label" style={{ margin: 0 }}>
										Key Achievements & Bullets
									</label>
									<button
										type="button"
										className="admin-btn admin-btn-secondary"
										style={{ padding: "4px 10px", fontSize: 12 }}
										onClick={addBenefitField}
									>
										<FontAwesomeIcon icon={faPlus} />
										<span>Add Bullet</span>
									</button>
								</div>

								{formData.benefits.map((bullet, bIndex) => (
									<div key={bIndex} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
										<input
											type="text"
											className="admin-input"
											value={bullet}
											onChange={(e) => handleBenefitChange(bIndex, e.target.value)}
											placeholder={`Bullet achievement #${bIndex + 1}`}
										/>
										<button
											type="button"
											className="admin-icon-btn delete"
											onClick={() => removeBenefitField(bIndex)}
											title="Remove bullet"
										>
											<FontAwesomeIcon icon={faTrash} />
										</button>
									</div>
								))}
							</div>

							<div className="admin-modal-actions">
								<button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
									Cancel
								</button>
								<button type="submit" className="admin-btn admin-btn-primary">
									<FontAwesomeIcon icon={faCheck} />
									<span>Save Changes</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ExperienceEditor;

