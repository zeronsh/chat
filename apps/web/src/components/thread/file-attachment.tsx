import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, LoaderIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface FileAttachmentProps {
    url: string;
    name?: string;
    mediaType: string;
    onRemove?: () => void;
    className?: string;
}

export function FileAttachment({ url, name, mediaType, onRemove, className }: FileAttachmentProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const isImage = mediaType.startsWith('image/');
    const isPdf = mediaType === 'application/pdf';

    const handleImageLoad = () => {
        setIsLoading(false);
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    if (hasError) {
        return (
            <div
                className={cn(
                    'relative h-24 w-24 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center justify-center',
                    className
                )}
            >
                <div className="flex flex-col items-center gap-1 text-center p-2 w-full">
                    <FileText className="size-6 text-destructive" />
                    <p className="text-destructive text-xs truncate w-full max-w-full text-center">
                        {name}
                    </p>
                </div>
                {onRemove && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                        onClick={onRemove}
                    >
                        <X className="size-3" />
                    </Button>
                )}
            </div>
        );
    }

    if (isImage) {
        return (
            <>
                <div className="relative">
                    <motion.div
                        className={cn(
                            'relative h-24 w-24 rounded-2xl bg-muted/50 cursor-pointer',
                            className
                        )}
                        onClick={() => setIsFullScreen(true)}
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                                <LoaderIcon className="size-6 animate-spin" />
                            </div>
                        )}
                        <motion.img
                            src={url}
                            alt={name}
                            className={cn(
                                'h-full w-full object-cover transition-opacity duration-200 rounded-2xl',
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            )}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            layoutId={`image-content-${url}`}
                        />
                    </motion.div>
                    {onRemove && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground z-0"
                            onClick={e => {
                                e.stopPropagation();
                                onRemove();
                            }}
                        >
                            <X className="size-3" />
                        </Button>
                    )}
                </div>

                {isFullScreen &&
                    createPortal(
                        <motion.div
                            className="fixed inset-0 z-[9999] bg-background/50 backdrop-blur-sm"
                            onClick={() => setIsFullScreen(false)}
                        >
                            <motion.div className="absolute inset-0 flex items-center justify-center p-4">
                                <motion.img
                                    src={url}
                                    alt={name}
                                    className="max-h-full max-w-full object-contain rounded-lg"
                                    layoutId={`image-content-${url}`}
                                />
                            </motion.div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                                onClick={() => setIsFullScreen(false)}
                            >
                                <X className="size-6" />
                            </Button>
                        </motion.div>,
                        document.body
                    )}
            </>
        );
    }

    if (isPdf) {
        return (
            <div
                className={cn(
                    'relative h-24 w-24 bg-muted/50 border rounded-2xl flex items-center justify-center',
                    className
                )}
            >
                <div className="flex flex-col items-center gap-3 text-center p-2 w-full">
                    <FileText className="size-6 text-muted-foreground" />
                    <p className="text-muted-foreground text-xs truncate w-full max-w-full text-center">
                        {name}
                    </p>
                </div>
                {onRemove && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                        onClick={onRemove}
                    >
                        <X className="size-3" />
                    </Button>
                )}
            </div>
        );
    }

    // Default file type
    return (
        <div
            className={cn(
                'relative h-24 w-24 bg-muted/50 border rounded-2xl flex items-center justify-center',
                className
            )}
        >
            <div className="flex flex-col items-center gap-1 text-center p-2 w-full">
                <FileText className="size-6 text-muted-foreground" />
                <p className="text-muted-foreground text-xs truncate w-full max-w-full text-center">
                    {name}
                </p>
            </div>
            {onRemove && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                    onClick={onRemove}
                >
                    <X className="size-3" />
                </Button>
            )}
        </div>
    );
}
