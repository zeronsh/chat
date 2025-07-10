import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
	id: number;
	x: number;
	y: number;
	size: number;
	delay: number;
	duration: number;
}

export function Stars() {
	const [stars, setStars] = useState<Star[]>([]);

	useEffect(() => {
		// Generate random stars
		const generateStars = () => {
			const newStars: Star[] = [];
			const starCount = 50; // Number of stars

			for (let i = 0; i < starCount; i++) {
				newStars.push({
					id: i,
					x: Math.random() * 100, // Random x position (0-100%)
					y: Math.random() * 100, // Random y position (0-100%)
					size: Math.random() * 2 + 1, // Random size (1-3px)
					delay: Math.random() * 2, // Random delay (0-2s)
					duration: Math.random() * 3 + 2, // Random duration (2-5s)
				});
			}
			setStars(newStars);
		};

		generateStars();
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{stars.map((star) => (
				<motion.div
					key={star.id}
					className="absolute bg-white rounded-full"
					style={{
						left: `${star.x}%`,
						top: `${star.y}%`,
						width: `${star.size}px`,
						height: `${star.size}px`,
					}}
					initial={{ opacity: 0, scale: 0 }}
					animate={{
						opacity: [0, 1, 0],
						scale: [0, 1, 0],
					}}
					transition={{
						duration: star.duration,
						delay: star.delay,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
}
