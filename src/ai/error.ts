import { AIError } from '@/ai/stream';

export type ThreadErrorCodes =
    | 'ThreadAlreadyStreaming'
    | 'ThreadNotFound'
    | 'StreamNotFound'
    | 'NotAuthorized'
    | 'ModelNotFound';

export class ThreadError extends AIError<ThreadErrorCodes> {}
