import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_account/about')({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: 'About — Zeron',
            },
        ],
    }),
});

function RouteComponent() {
    return (
        <div className="flex flex-1 items-center justify-center relative w-full h-full p-4">
            <div className="flex flex-col p-8 gap-8 max-w-xl w-full">
                <div className="flex flex-col gap-3">
                    <h1 className="text-xl font-semibold text-foreground">About Zeron</h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Zeron is a unified chat interface for large language models, letting users
                        work with models from OpenAI, Anthropic, Google, and other providers in one
                        place. Conversations sync in real time across your devices, and you can
                        switch models mid-conversation, attach files, and keep your entire chat
                        history in a single workspace. Zeron is built for developers, researchers,
                        and anyone who wants one interface and one subscription for the latest AI
                        models.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold text-foreground">Company</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Zeron is developed and operated by 1499487 B.C. LTD., a company incorporated
                        in British Columbia, Canada (BC incorporation no. 1499487).
                    </p>
                    <address className="text-muted-foreground text-sm leading-relaxed not-italic">
                        1499487 B.C. LTD.
                        <br />
                        Vancouver, BC, Canada
                    </address>
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold text-foreground">Contact</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        <a
                            href="mailto:wing@zeron.sh"
                            className="text-foreground underline underline-offset-4 hover:text-primary"
                        >
                            wing@zeron.sh
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
