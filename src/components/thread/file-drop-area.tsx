import { cn } from '@/lib/utils';
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
            'application/pdf': [],
            'text/plain': [],
        },
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        noClick: true,
        noKeyboard: true,
    });

    return (
        <div {...getRootProps()} className={cn('relative flex flex-col flex-1', className)}>
            <input {...getInputProps()} />

            {children}

            {isDragActive && (
                <div className="absolute inset-0 flex size-full items-center justify-center border-none bg-background/50 p-0 backdrop-blur transition-opacity duration-200 ease-out z-10 rounded-3xl">
                    <p className="font-medium text-sm">{overlayText}</p>
                </div>
            )}
        </div>
    );
}
