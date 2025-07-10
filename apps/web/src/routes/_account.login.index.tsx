import { Anonymous, NotAnonymous } from '@/components/app/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { useForm } from '@tanstack/react-form';
import { Navigate, createFileRoute, useNavigate } from '@tanstack/react-router';
import { type Variants, easeOut, motion } from 'framer-motion';
import { ArrowRightIcon, GithubIcon, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

import z from 'zod';

const schema = z.object({
    email: z.string().email(),
});

async function onGoogleLogin() {
    await authClient.signIn.social({
        provider: 'google',
    });
}

async function onGithubLogin() {
    await authClient.signIn.social({
        provider: 'github',
    });
}

export const Route = createFileRoute('/_account/login/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            email: '',
        },
        onSubmit: async ({ value }) => {
            await authClient.signIn.magicLink({
                email: value.email,
            });
            navigate({ to: '/magic-link' });
        },
        validators: {
            onMount: schema,
            onChange: schema,
            onSubmit: schema,
        },
    });

    return (
        <form
            className="flex flex-1 items-center justify-center relative w-full h-full p-4"
            onSubmit={e => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <Anonymous>
                <motion.div
                    className="flex flex-col p-8 gap-6 items-center max-w-md  col-span-1 justify-center row-span-3 border border-foreground/10 rounded-2xl bg-background/50 backdrop-blur-md"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="flex flex-col items-center gap-2"
                        variants={itemVariants}
                    >
                        <motion.span
                            className="text-xl font-semibold text-foreground"
                            variants={itemVariants}
                        >
                            Login to Zeron
                        </motion.span>
                        <motion.span
                            className="text-muted-foreground text-sm"
                            variants={itemVariants}
                        >
                            Enter your email to login to your account
                        </motion.span>
                    </motion.div>
                    <motion.div variants={itemVariants} className="w-full">
                        <form.Field name="email">
                            {field => (
                                <div className="flex flex-col gap-2 w-full">
                                    <span className="text-sm">Email</span>
                                    <Input
                                        placeholder="m@example.com"
                                        value={field.state.value}
                                        onChange={e => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        </form.Field>
                    </motion.div>
                    <motion.div variants={itemVariants} className="w-full">
                        <form.Subscribe
                            selector={state => ({
                                isSubmitting: state.isSubmitting,
                                canSubmit: state.canSubmit,
                            })}
                        >
                            {({ isSubmitting, canSubmit }) => (
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-b dark:bg-gradient-to-t from-primary/60 to-primary border border-primary"
                                    disabled={!canSubmit || isSubmitting}
                                >
                                    <span className="text-primary-foreground">Continue</span>
                                    {!isSubmitting ? (
                                        <ArrowRightIcon
                                            className="text-primary-foreground"
                                            size={10}
                                        />
                                    ) : (
                                        <Loader2
                                            className="text-primary-foreground animate-spin"
                                            size={10}
                                        />
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </motion.div>
                    <motion.div
                        className="flex flex-row items-center gap-4 w-full"
                        variants={itemVariants}
                    >
                        <Separator className="flex-1" />
                        <span className="text-muted-foreground text-sm">Or</span>
                        <Separator className="flex-1" />
                    </motion.div>
                    <motion.div className="flex flex-col gap-4 w-full" variants={itemVariants}>
                        <Button
                            variant="outline"
                            onClick={onGoogleLogin}
                            className="bg-gradient-to-b dark:bg-gradient-to-b from-muted/10 to-muted"
                        >
                            <FcGoogle size={16} />
                            <span className="text-sm">Continue with Google</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onGithubLogin}
                            className="bg-gradient-to-b dark:bg-gradient-to-b from-muted/10 to-muted"
                        >
                            <GithubIcon className="text-foreground" size={16} />
                            <span className="text-sm">Continue with GitHub</span>
                        </Button>
                    </motion.div>
                    <motion.div className="max-w-[70%] mx-auto text-center" variants={itemVariants}>
                        <span className="text-muted-foreground text-sm">
                            By continuing, you agree to our{' '}
                            <a href="https://zeron.sh/terms">
                                <span className="text-primary underline">Terms of Service</span>
                            </a>{' '}
                            and{' '}
                            <a href="https://zeron.sh/privacy">
                                <span className="text-primary underline">Privacy Policy</span>
                            </a>
                        </span>
                    </motion.div>
                </motion.div>
            </Anonymous>
            <NotAnonymous>
                <Navigate to="/" />
            </NotAnonymous>
        </form>
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

const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
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
