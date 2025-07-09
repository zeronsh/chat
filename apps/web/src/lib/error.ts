import { AIError } from '@zeronsh/ai';

export type ThreadErrorCodes =
    | 'ThreadAlreadyStreaming'
    | 'ThreadNotFound'
    | 'StreamNotFound'
    | 'NotAuthorized';

export class ThreadError extends AIError<ThreadErrorCodes> {}
