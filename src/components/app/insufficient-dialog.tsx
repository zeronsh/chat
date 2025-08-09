import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@tanstack/react-router';

export function InsufficientCreditsProDialog(props: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent className="p-0 overflow-hidden gap-0" showCloseButton={false}>
                <DialogHeader className="p-6 bg-background">
                    <DialogTitle>Insufficient credits</DialogTitle>
                    <DialogDescription>
                        You do not have enough credits to use this model. Credits are reset daily.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
                    <Button type="button" variant="outline" onClick={() => props.setOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function InsufficientCreditsDialog(props: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent className="p-0 overflow-hidden gap-0" showCloseButton={false}>
                <DialogHeader className="p-6 bg-background">
                    <DialogTitle>Insufficient credits</DialogTitle>
                    <DialogDescription>
                        You do not have enough credits to use this model. Unlock PRO to get more
                        credits and discover all premium features.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
                    <Button type="button" asChild>
                        <Link to="/account/subscription">Unlock PRO</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
