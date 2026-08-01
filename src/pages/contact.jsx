import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import emailjs from "@emailjs/browser";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/contact.css";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const [statusMessage, setStatusMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "contact");

	// Replace these with your EmailJS credentials
	const SERVICE_ID = "service_q12z6ws";
	const TEMPLATE_ID_OWNER = "template_9a3v036";
	const TEMPLATE_ID_CONFIRM = "template_emga1kh";
	const PUBLIC_KEY = "IhUnYU45kPjCq5Hpr";

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!formData.name || !formData.email || !formData.message) {
			setStatusMessage("Please fill in all fields before sending.");
			return;
		}

		setIsSubmitting(true);
		setStatusMessage("Sending message...");

		const ownerTemplateParams = {
			owner_email: INFO.main.email,
			from_name: formData.name,
			from_email: formData.email,
			message: formData.message,
			reply_to: formData.email,
		};

		const confirmTemplateParams = {
			to_name: formData.name,
			to_email: formData.email,
			from_name: INFO.main.title,
			owner_email: INFO.main.email,
		};

		emailjs
			.send(
				SERVICE_ID,
				TEMPLATE_ID_OWNER,
				ownerTemplateParams,
				PUBLIC_KEY
			)
			.then(() => {
				return emailjs.send(
					SERVICE_ID,
					TEMPLATE_ID_CONFIRM,
					confirmTemplateParams,
					PUBLIC_KEY
				);
			})
			.then(() => {
				setStatusMessage(
					"Your message has been sent! You'll receive a confirmation email shortly."
				);

				setFormData({
					name: "",
					email: "",
					message: "",
				});
			})
			.catch((error) => {
				console.error(error);
				setStatusMessage(
					"Something went wrong. Please try again later."
				);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return (
		<>
			<Helmet>
				<title>{`Contact | ${INFO.main.title}`}</title>

				<meta
					name="description"
					content={currentSEO.description}
				/>

				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="contact" />

				<div className="content-wrapper">
					<div className="contact-logo-container">
						<div className="contact-logo">
							<Logo width={46} />
						</div>
					</div>

					<div
						className="contact-container"
						data-aos="fade-up"
					>
						<div
							className="contact-left"
							data-aos="fade-right"
							data-aos-delay="80"
						>
							<div className="title contact-title">
								Let’s connect and build something meaningful.
							</div>

							<div className="subtitle contact-subtitle">
								Thank you for your interest in getting in touch
								with me. I welcome your feedback, questions, and
								suggestions. If you have a specific question or
								comment, please feel free to email me directly at{" "}
								<a href={`mailto:${INFO.main.email}`}>
									{INFO.main.email}
								</a>
								. I make an effort to respond to all messages
								within 24 hours, although it may take longer
								during busy periods.

								<br />
								<br />

								You can also use the contact form to send me a
								message. If you prefer social media, connect
								with me on{" "}
								<a
									href={INFO.socials.linkedin}
									target="_blank"
									rel="noreferrer"
								>
									LinkedIn
								</a>
								.
							</div>
						</div>

						<div
							className="contact-right"
							data-aos="fade-left"
							data-aos-delay="140"
						>
							<form
								className="contact-form"
								onSubmit={handleSubmit}
							>
								<label
									htmlFor="contact-name"
									className="sr-only"
								>
									Your Name
								</label>

								<input
									id="contact-name"
									name="name"
									type="text"
									placeholder="Your Name"
									value={formData.name}
									onChange={handleChange}
									required
								/>

								<label
									htmlFor="contact-email"
									className="sr-only"
								>
									Your Email
								</label>

								<input
									id="contact-email"
									name="email"
									type="email"
									placeholder="Your Email"
									value={formData.email}
									onChange={handleChange}
									required
								/>

								<label
									htmlFor="contact-message"
									className="sr-only"
								>
									Your Message
								</label>

								<textarea
									id="contact-message"
									name="message"
									rows="5"
									placeholder="Your Message"
									value={formData.message}
									onChange={handleChange}
									required
								/>

								<button
									type="submit"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Sending..."
										: "Send Message"}
								</button>

								{statusMessage && (
									<div className="form-status">
										{statusMessage}
									</div>
								)}
							</form>
						</div>
					</div>

					<div className="socials-container">
						<div className="contact-socials">
							<Socials />
						</div>
					</div>

					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
};

export default Contact;