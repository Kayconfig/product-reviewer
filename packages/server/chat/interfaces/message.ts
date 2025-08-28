import type { BaseMessage } from '@langchain/core/messages';

export type Message = {
    id: string;
    content: string;
};

export type Messages = BaseMessage[];
