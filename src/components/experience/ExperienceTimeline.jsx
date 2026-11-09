import React from "react";
import defaultExperience from "../../data/experience";

const ExperienceTimeline = ({ items = defaultExperience }) => {
	if (!items || items.length === 0) return null;

	return (
		<div className="experience-container">
			{items.map((item, index) => (
				<div
					className="experience-item"
					key={index}
					data-aos="fade-up"
					data-aos-delay={120 + index * 80}
				>
					<div className="experience-dot" aria-hidden="true"></div>

					<div className="experience-card">
						<div className="experience-header">
							<h3 className="experience-title">{item.title}</h3>
							<span className="experience-date">{item.date}</span>
						</div>

						<div className="experience-company">{item.company}</div>
						<p className="experience-description">{item.description}</p>

						{item.benefits && item.benefits.length > 0 && (
							<ul className="experience-benefits">
								{item.benefits.map((benefit, benefitIndex) => (
									<li key={benefitIndex}>{benefit}</li>
								))}
							</ul>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default ExperienceTimeline;

