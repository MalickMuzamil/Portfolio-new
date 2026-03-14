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

					<div className="experience-main-container">

						<div className="experience-intro">

							<div className="experience-headline">
								My professional journey building scalable web applications.
							</div>

							<div className="experience-paragraph">
								I have worked on a variety of full stack and frontend development projects across logistics systems,
								CRM platforms, and enterprise dashboards. My experience includes building modern web applications
								using Angular, React, Next.js, Node.js, and Express.js while designing scalable APIs and responsive
								user interfaces. I focus on creating maintainable code, optimizing performance, and delivering
								production-ready features that support real business operations.
							</div>

						</div>

						<div className="experience-container">

							{experience.map((item, index) => (

								<div className="experience-item" key={index}>

									<div className="experience-dot"></div>

									<div className="experience-card">

										<div className="experience-header">

											<div className="experience-title">
												{item.title}
											</div>

											<div className="experience-date">
												{item.date}
											</div>

										</div>

										<div className="experience-company">
											{item.company}
										</div>

										<div className="experience-description">
											{item.description}
										</div>

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

		</React.Fragment>
	);
};

export default Experience;