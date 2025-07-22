import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";
import { type Variants, easeOut, motion } from "framer-motion";
import { ArrowLeftIcon, MailIcon } from "lucide-react";

export const Route = createFileRoute("/_account/magic-link")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-1 items-center justify-center relative w-full h-full p-4">
			<motion.div
				className="flex flex-col p-8 gap-6 items-center max-w-md col-span-1 justify-center row-span-3 border border-foreground/10 rounded-2xl bg-background/50 backdrop-blur-md"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.div
					className="flex flex-col items-center gap-2"
					variants={itemVariants}
				>
					<motion.div
						className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-2"
						variants={itemVariants}
					>
						<MailIcon className="size-6 text-blue-600 dark:text-blue-400" />
					</motion.div>
					<motion.span
						className="text-xl font-semibold text-foreground"
						variants={itemVariants}
					>
						Magic Link Sent
					</motion.span>
					<motion.span
						className="text-muted-foreground text-sm text-center"
						variants={itemVariants}
					>
						We've sent a magic link to your email address. Check your inbox and
						click the link to sign in to your account.
					</motion.span>
				</motion.div>

				<div className="flex flex-col gap-2 w-full">
					<motion.div variants={itemVariants} className="w-full">
						<Button
							asChild
							className="w-full bg-gradient-to-b dark:bg-gradient-to-t from-primary/60 to-primary border border-primary"
						>
							<Link to="/">
								<ArrowLeftIcon className="size-4" />
								<span className="text-primary-foreground">Back to Home</span>
							</Link>
						</Button>
					</motion.div>

					<motion.div variants={itemVariants} className="w-full">
						<Button
							asChild
							variant="outline"
							className="w-full bg-gradient-to-b dark:bg-gradient-to-t from-muted/10 to-muted"
						>
							<Link to="/login">
								<span className="text-sm">Try Another Email</span>
							</Link>
						</Button>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: easeOut,
		},
	},
} satisfies Variants;

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
} satisfies Variants;
