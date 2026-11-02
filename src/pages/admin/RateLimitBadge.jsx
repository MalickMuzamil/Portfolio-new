import React, { useState, useEffect } from "react";

const RateLimitBadge = ({ rateLimitInfo, onWindowExpired }) => {
	const [countdown, setCountdown] = useState(rateLimitInfo?.secondsRemaining || 0);

	useEffect(() => {
		setCountdown(rateLimitInfo?.secondsRemaining || 0);
	}, [rateLimitInfo?.secondsRemaining]);

	useEffect(() => {
		if (countdown <= 0) return;

		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					if (onWindowExpired) onWindowExpired();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown, onWindowExpired]);

	const formatTime = (secs) => {
		const m = Math.floor(secs / 60);
		const s = secs % 60;
		return `${m.toString().padStart(2, "0")}m:${s.toString().padStart(2, "0")}s`;
	};

	const used = rateLimitInfo?.used || 0;
	const max = rateLimitInfo?.max || 3;
	const isAllowed = rateLimitInfo?.isAllowed ?? true;

	if (!isAllowed || countdown > 0) {
		return (
			<div className="rate-limit-pill blocked" title="Push & Revert locked until cooldown finishes (Max 3 / 10m)">
				<span className="rate-limit-dot"></span>
				<span>Cooldown: {formatTime(countdown)} ({used}/{max} used)</span>
			</div>
		);
	}

	if (used >= 2) {
		return (
			<div className="rate-limit-pill warning" title="1 push/revert action remaining in this 10-minute window">
				<span className="rate-limit-dot"></span>
				<span>Rate Limit: {used}/{max} used (1 left)</span>
			</div>
		);
	}

	return (
		<div className="rate-limit-pill available" title="Rate limit: Max 3 pushes/reverts per 10 minutes">
			<span className="rate-limit-dot"></span>
			<span>Rate Limit: {used}/{max} used</span>
		</div>
	);
};

export default RateLimitBadge;

