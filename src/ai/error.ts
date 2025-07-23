import { AIError } from '@/ai/stream';

export type ThreadErrorCodes =
    | 'ThreadAlreadyStreaming'
    | 'ThreadNotFound'
    | 'StreamNotFound'
    | 'NotAuthorized'
    | 'ModelNotFound'
    | 'SettingsNotFound';

export class ThreadError extends AIError<ThreadErrorCodes> {}
