import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { useAccess } from '@/hooks/use-access';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/hooks/use-session';

export const Route = createFileRoute('/_account/account/subscription')({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: session } = useSession();
    const { isPro, isExpiring, limits, remainingSearches, remainingResearches, remainingCredits } =
        useAccess();

    return (
        <div className="flex flex-col gap-8 w-full">
            <title>Subscription | Zeron</title>

            <Section title="Subscription" description="Manage your subscription.">
                <div className="space-y-4">
                    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border">
                        <h3 className="text-sm font-medium">Free</h3>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm font-medium">$0</p>
                            <p className="text-sm text-muted-foreground">/month</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The essential features of Zeron.
                        </p>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border-primary/50 border">
                        <div className="flex gap-2 items-center justify-between">
                            <h3 className="text-sm font-medium">Pro</h3>
                            <Badge variant="secondary">Recommended</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Gain access to premium models and advanced features.
                        </p>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm font-medium">$25</p>
                            <p className="text-sm text-muted-foreground">/month</p>
                        </div>

                        {!isPro && (
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const url = new URL(
                                            '/api/checkout',
                                            window.location.origin
                                        );
                                        url.searchParams.set(
                                            'redirectUrl',
                                            window.location.origin + '/account/subscription'
                                        );
                                        window.location.href = url.toString();
                                    }}
                                    disabled={session?.user?.isAnonymous === true}
                                >
                                    Upgrade to Pro
                                </Button>
                            </div>
                        )}

                        {isPro && (
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const url = new URL(
                                            '/api/customer-portal',
                                            window.location.origin
                                        );
                                        url.searchParams.set(
                                            'redirectUrl',
                                            window.location.origin + '/account/subscription'
                                        );
                                        window.location.href = url.toString();
                                    }}
                                >
                                    Manage Subscription
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                {isPro && isExpiring && (
                    <div className="border rounded-lg p-4 bg-card">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-yellow-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Subscription Ending
                                </h3>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    <p>
                                        Your Pro subscription has been canceled and will end at the
                                        end of your current billing period. You'll continue to have
                                        access to Pro features until then.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Section>
            <Separator />
            <Section title="Usage" description="Track your current usage and limits.">
                <div className="space-y-4">
                    {/* AI Credits Usage */}
                    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Message Credits</h3>
                            <span className="text-xs text-muted-foreground">
                                {limits?.CREDITS ? limits.CREDITS - remainingCredits : 0} /{' '}
                                {limits?.CREDITS || 0}
                            </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                style={{
                                    width: limits?.CREDITS
                                        ? `${Math.min(
                                              100,
                                              ((limits.CREDITS - remainingCredits) /
                                                  limits.CREDITS) *
                                                  100
                                          )}%`
                                        : '0%',
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Resets daily</p>
                    </div>
                    {/* Search Usage */}
                    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Search Queries</h3>
                            <span className="text-xs text-muted-foreground">
                                {limits?.SEARCH ? limits.SEARCH - remainingSearches : 0} /{' '}
                                {limits?.SEARCH || 0}
                            </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                style={{
                                    width: limits?.SEARCH
                                        ? `${Math.min(
                                              100,
                                              ((limits.SEARCH - remainingSearches) /
                                                  limits.SEARCH) *
                                                  100
                                          )}%`
                                        : '0%',
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Resets daily</p>
                    </div>

                    {/* Research Tools Usage */}
                    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Research Queries</h3>
                            <span className="text-xs text-muted-foreground">
                                {limits?.RESEARCH ? limits.RESEARCH - remainingResearches : 0} /{' '}
                                {limits?.RESEARCH || 0}
                            </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                style={{
                                    width: limits?.RESEARCH
                                        ? `${Math.min(
                                              100,
                                              ((limits.RESEARCH - remainingResearches) /
                                                  limits.RESEARCH) *
                                                  100
                                          )}%`
                                        : '0%',
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Resets daily</p>
                    </div>
                </div>
            </Section>
        </div>
    );
}
