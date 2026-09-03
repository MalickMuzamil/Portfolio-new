import React, { useState } from "react";
import Project from "./project";
import INFO from "../../data/user";

import "./styles/allProjects.css";

const FILTERS = [
	{ label: "All", value: "all" },
	{ label: "Data Engineering", value: "data-engineering" },
	{ label: "Full Stack", value: "full-stack" },
];

const AllProjects = ({ limit }) => {
	const [activeFilter, setActiveFilter] = useState("all");

	const allProjects = limit
		? INFO.projects.slice(0, limit)
		: INFO.projects;

	const filteredProjects =
		activeFilter === "all"
			? allProjects
			: allProjects.filter((p) => p.category === activeFilter);

	return (
		<div>
			{/* Filter Buttons - only show on full projects page (no limit) */}
			{!limit && (
				<div className="projects-filter-bar">
					{FILTERS.map((f) => (
						<button
							key={f.value}
							className={`projects-filter-btn${activeFilter === f.value ? " active" : ""}`}
							onClick={() => setActiveFilter(f.value)}
						>
							{f.label}
							<span className="projects-filter-count">
								{f.value === "all"
									? allProjects.length
									: allProjects.filter((p) => p.category === f.value).length}
							</span>
						</button>
					))}
				</div>
			)}

			<div className="all-projects-container">
				{filteredProjects.map((project, index) => (
					<div
						className="all-projects-project"
						key={`${activeFilter}-${index}`}
						style={{ animationDelay: `${index * 60}ms` }}
					>
						<Project
							logo={project.logo}
							stackIcons={project.stackIcons}
							title={project.title}
							description={project.description}
							benefits={project.benefits}
							linkText={project.linkText}
							link={project.link}
						/>
					</div>
				))}
			</div>

			{filteredProjects.length === 0 && (
				<div className="projects-empty-state">
					No projects found in this category.
				</div>
			)}
		</div>
	);
};

export default AllProjects;