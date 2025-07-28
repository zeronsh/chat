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

export function AccountDialog(props: { open: boolean; setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent className="p-0 overflow-hidden gap-0" showCloseButton={false}>
                <DialogHeader className="p-6 bg-background">
                    <DialogTitle>Create an account</DialogTitle>
                    <DialogDescription>
                        Create an account to gain access to additional models and reset your limits.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 border-t border-foreground/10 bg-sidebar">
                    <Button type="button" asChild>
                        <Link to="/login">Create account</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
