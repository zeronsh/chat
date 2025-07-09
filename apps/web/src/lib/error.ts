import { AIError } from '@zeronsh/ai';

export type ThreadErrorCodes = 'ThreadAlreadyStreaming' | 'NotAuthorized';

export class ThreadError extends AIError<ThreadErrorCodes> {}
