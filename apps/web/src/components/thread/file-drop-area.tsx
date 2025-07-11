import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';

type FileDropAreaProps = {
    className?: string;
    onUpload: (files: FileList) => Promise<void>;
    children: React.ReactNode;
    overlayText?: string;
};

export function FileDropArea({
    onUpload,
    children,
    overlayText = 'Drop files here',
    className,
}: FileDropAreaProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    const onDrop = async (accepted: FileWithPath[]) => {
        setIsDragActive(false);
        const dataTransfer = new DataTransfer();
        accepted.forEach(file => dataTransfer.items.add(file));
        await onUpload(dataTransfer.files);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        noClick: true,
        noKeyboard: true,
    });

    return (
        <div
            {...getRootProps()}
            className={cn('relative', className)}
            style={{ pointerEvents: isDragActive ? 'auto' : 'none' }}
        >
            <input {...getInputProps()} />

            {/* Children content */}
            <div style={{ pointerEvents: 'auto' }}>{children}</div>

            {isDragActive && (
                <div className="absolute inset-0 flex size-full items-center justify-center rounded-none border-none bg-background/50 p-0 backdrop-blur transition-opacity duration-200 ease-out z-10">
                    <p className="font-medium text-sm">{overlayText}</p>
                </div>
            )}
        </div>
    );
}
