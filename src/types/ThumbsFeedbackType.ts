
export type ThumbState = 'thumbsUp' | 'thumbsDown' | 'none';

export type ThumbsFeedbackType = {
    thumbState: ThumbState;
    reason: string;
}
