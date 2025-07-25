import { Anonymous, NotAnonymous } from '@/components/app/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { useForm } from '@tanstack/react-form';
import { Navigate, createFileRoute, useNavigate } from '@tanstack/react-router';
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
                <div className="flex flex-col p-8 gap-6 items-center max-w-md  col-span-1 justify-center row-span-3 rounded-2x">
                    <div className="flex flex-col items-center gap-2 min-w-[350px]">
                        <span className="text-xl font-semibold text-foreground">
                            Login to Zeron
                        </span>
                        <span className="text-muted-foreground text-sm">
                            Enter your email to login to your account
                        </span>
                    </div>
                    <div className="w-full">
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
                    </div>
                    <div className="w-full">
                        <form.Subscribe
                            selector={state => ({
                                isSubmitting: state.isSubmitting,
                                canSubmit: state.canSubmit,
                            })}
                        >
                            {({ isSubmitting, canSubmit }) => (
                                <Button
                                    type="submit"
                                    className="w-full"
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
                    </div>
                    <div className="flex flex-row items-center gap-4 w-full">
                        <Separator className="flex-1" />
                        <span className="text-muted-foreground text-sm">Or</span>
                        <Separator className="flex-1" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Button variant="outline" onClick={onGoogleLogin}>
                            <FcGoogle size={16} />
                            <span className="text-sm">Continue with Google</span>
                        </Button>
                        <Button variant="outline" onClick={onGithubLogin}>
                            <GithubIcon className="text-foreground" size={16} />
                            <span className="text-sm">Continue with GitHub</span>
                        </Button>
                    </div>
                </div>
            </Anonymous>
            <NotAnonymous>
                <Navigate to="/" />
            </NotAnonymous>
        </form>
    );
}
