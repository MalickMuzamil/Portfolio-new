import React from "react";
import defaultTechStack from "../../data/techStack";
import "./style/techstack.css";

const TechStack = ({ items = defaultTechStack, title = "Tech Stack & Tools" }) => {
	if (!items || items.length === 0) return null;

	return (
		<section className="techstack-section" aria-label={title}>
			{title && <h2 className="techstack-heading">{title}</h2>}
			<div className="techstack-grid">
				{items.map((item, index) => (
					<div className="techstack-card" key={index}>
						<div className="techstack-icon-wrapper">
							<img
								src={item.icon}
								alt={`${item.title} icon`}
								className="techstack-icon-img"
								loading="lazy"
							/>
						</div>
						<span className="techstack-name">{item.title}</span>
					</div>
				))}
			</div>
		</section>
	);
};

export default TechStack;
