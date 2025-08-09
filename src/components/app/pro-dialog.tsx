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

export function ProDialog(props: { open: boolean; setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent className="p-0 overflow-hidden gap-0" showCloseButton={false}>
                <DialogHeader className="p-6 bg-background">
                    <DialogTitle>Ready for more?</DialogTitle>
                    <DialogDescription>
                        Unlock all features and get access to premium models, higher limits, and more.
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
