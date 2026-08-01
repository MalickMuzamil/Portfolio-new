import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import SEO from "../data/seo";
import experience from "../data/experience";

import "./styles/experience.css";

const Experience = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "about");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Experience | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta name="keywords" content={currentSEO.keywords.join(", ")} />
			</Helmet>

			<div className="page-content">
				<NavBar active="experience" />

				<div className="content-wrapper">
					<div className="experience-logo-container">
						<div className="experience-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="experience-main-container" data-aos="fade-up">
						<div className="experience-intro" data-aos="fade-up" data-aos-delay="50">
							<div className="experience-headline">
								A practical path from frontend builds to end-to-end product delivery.
							</div>

							<div className="experience-paragraph">
								I've contributed to logistics systems, CRM platforms, and business-facing web applications across the full stack. My work has involved building responsive interfaces, developing scalable APIs, and shipping features that support daily operations and long-term product stability.
							</div>

							<div className="experience-container">
								{experience.map((item, index) => (
									<div
										className="experience-item"
										key={index}
										data-aos="fade-up"
										data-aos-delay={120 + index * 80}
									>
										<div className="experience-dot"></div>

										<div className="experience-card">
											<div className="experience-header">
												<div className="experience-title">{item.title}</div>
												<div className="experience-date">{item.date}</div>
											</div>

											<div className="experience-company">{item.company}</div>
											<div className="experience-description">{item.description}</div>

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
						</div>
						<div className="page-footer">
							<Footer />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Experience;