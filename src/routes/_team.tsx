import { Button } from '@/components/ui/button';
import { Stars } from '@/components/ui/stars';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';

export const Route = createFileRoute('/_team')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex flex-1 relative">
            <div className="flex flex-1 z-1 overflow-auto relative">
                <motion.div
                    className="absolute top-0 left-0 z-10 p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div>
                        <Link to="/">
                            <Button variant="ghost">
                                <ArrowLeftIcon className="size-4" />
                                <span>Back</span>
                            </Button>
                        </Link>
                    </div>
                </motion.div>
                <div className="p-4 w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
