import { AIError } from '@zeronsh/ai';

export type ThreadErrorCodes =
    | 'ThreadAlreadyStreaming'
    | 'ThreadNotFound'
    | 'StreamNotFound'
    | 'NotAuthorized'
    | 'ModelNotFound';

export class ThreadError extends AIError<ThreadErrorCodes> {}
