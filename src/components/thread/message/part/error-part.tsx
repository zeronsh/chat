import { usePart } from '@/context/thread';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { memo } from 'react';

export const ErrorPart = memo(function PureErrorPart({ id, index }: { id: string; index: number }) {
    const part = usePart({ id, index, type: 'data-error', selector: part => part });
    return (
        <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>{part.data}</AlertTitle>
        </Alert>
    );
});
