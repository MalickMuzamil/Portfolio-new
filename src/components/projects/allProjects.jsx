import React from "react";
import Project from "./project";
import INFO from "../../data/user";

import "./styles/allProjects.css";

const AllProjects = ({ limit }) => {

	const projects = limit
		? INFO.projects.slice(0, limit)
		: INFO.projects;

	return (
		<div className="all-projects-container">
			{projects.map((project, index) => (
				<div
					className="all-projects-project"
					key={index}
					data-aos="fade-up"
					data-aos-delay={80 + index * 80}
				>
					<Project
						logo={project.logo}
						title={project.title}
						description={project.description}
						benefits={project.benefits}
						linkText={project.linkText}
						link={project.link}
					/>
				</div>
			))}
		</div>
	);
};

export default AllProjects;