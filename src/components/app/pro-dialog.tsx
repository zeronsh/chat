import { Anonymous } from '@/components/app/auth';
import ZeronIcon from '@/components/icons/zeron';
import ModelIcon from '@/components/thread/model-icon';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@tanstack/react-router';
import { CheckIcon, DiamondIcon, MoveRightIcon } from 'lucide-react';

export function ProDialog(props: { open: boolean; setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent
                className="p-0 overflow-hidden gap-0 bg-background"
                showCloseButton={false}
            >
                <DialogHeader className="p-2">
                    <div className="relative w-full p-4 rounded-md text-white overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/paywall.png')] bg-cover bg-top scale-x-[-1] rounded-sm overflow-hidden">
                            <div className="absolute inset-0 backdrop-blur-xs"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_theme(colors.yellow.300),_theme(colors.black),_theme(colors.black))] opacity-30"></div>
                        </div>
                        <div className="relative z-10 flex flex-col gap-4">
                            <DialogTitle className="flex items-center gap-2">
                                <ZeronIcon className="size-8" />
                                <span className="text-2xl font-bold">PRO</span>
                            </DialogTitle>
                            <DialogDescription className="text-white/90">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">$25</span>
                                    <span className="text-sm text-white/80">/month</span>
                                </div>
                                <p className="text-sm text-white/70">
                                    Upgrade to PRO to unlock all features and get access to premium
                                    models and higher limits for research, search, and more.
                                </p>
                                <div className="flex items-center gap-2 mt-4">
                                    <ModelIcon model="openai" className="size-4" />
                                    <ModelIcon model="anthropic" className="size-4" />
                                    <ModelIcon model="gemini" className="size-4" />
                                    <ModelIcon model="grok" className="size-4" />
                                    <ModelIcon model="deepseek" className="size-4" />
                                    <span className="line-through text-white/70">$115.00</span>
                                    <MoveRightIcon className="size-3" />
                                    <span className="text-sm">$25.00</span>
                                </div>
                                <div className="text-xs text-white/70 mt-2">
                                    Save over 70% on chat subscriptions by using Zeron
                                </div>
                            </DialogDescription>
                            <Button
                                type="button"
                                className="backdrop-blur-md bg-white/80 border border-white/10 text-black/80 hover:bg-white/90"
                                asChild
                            >
                                <Link to="/account/subscription">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                <div className="px-6 py-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <CheckIcon className="size-3" />
                        <span className="text-sm text-foreground/70">
                            Access to <span className="font-bold">PRO</span> models
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <CheckIcon className="size-3" />
                        <span className="text-sm text-foreground/70">Access to research tool</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <CheckIcon className="size-3" />
                        <span className="text-sm text-foreground/70">Higher limits for search</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <CheckIcon className="size-3" />
                        <span className="text-sm text-foreground/70">200 Credits daily</span>
                    </div>
                    <Anonymous>
                        <div className="flex gap-2 w-full items-center">
                            <div className="flex-1 border-b border-foreground/10" />
                            <p className="text-sm text-foreground/50">OR</p>
                            <div className="flex-1 border-b border-foreground/10" />
                        </div>
                        <div className="flex gap-4 text-sm text-foreground/70 items-center">
                            <DiamondIcon className="size-3" />
                            <span>
                                <Link to="/login" className="text-primary hover:underline">
                                    Create account
                                </Link>{' '}
                                to get 20 credits daily and access to more models.
                            </span>
                        </div>
                    </Anonymous>
                </div>
            </DialogContent>
        </Dialog>
    );
}
