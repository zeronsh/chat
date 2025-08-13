import { FileDropArea } from '@/components/thread/file-drop-area';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { useThreadSelector } from '@/context/thread';
import { FileAttachment } from '@/thread/store';

export function ThreadContainer({ children }: { children: React.ReactNode }) {
    const attachments = useThreadSelector(state => state.attachments);
    const setPendingFileCount = useThreadSelector(state => state.setPendingFileCount);
    const setAttachments = useThreadSelector(state => state.setAttachments);

    const { startUpload } = useUploadThing('fileUploader', {
        onBeforeUploadBegin: file => {
            setPendingFileCount(prev => prev + 1);
            return file;
        },

        onClientUploadComplete: files => {
            setPendingFileCount(prev => prev - files.length);
            const newAttachments: FileAttachment[] = files.map(file => ({
                type: 'file' as const,
                url: file.ufsUrl,
                filename: file.name,
                mediaType: file.type,
            }));
            setAttachments([...attachments, ...newAttachments]);
        },
        onUploadError: error => {
            toast.error(error.message);
            setPendingFileCount(prev => prev - 1);
        },
    });

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        await startUpload(Array.from(files));
    };

    return <FileDropArea onUpload={handleFileUpload}>{children}</FileDropArea>;
}
