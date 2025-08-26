import { useState } from 'react';
import ChatInput, { type Chat } from './ChatInput';
import MessagesList, { type Messages } from './MessageList';
import TypingIndicator from './TypingIndicator';
import axios, { AxiosError } from 'axios';
import { UNEXPECTED_ERR_MSG } from '@/lib/error-msgs';
import { apiSuccessChatResponseSchema } from './api-chat-response-schema';

type ApiResponse = {
    statusCode: number;
    message: string;
    data: { message: string };
    errors: Array<string>;
};

export default function ChatBot() {
    const [messages, setMessages] = useState<Messages>([]);
    const [botIsTyping, setBotIsTyping] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [chatId, setChatId] = useState('testChatId');

    const sendPromptToLLM = async (data: Chat) => {
        if (!chatId) {
            setErrMsg('Unable to complete your request, please try again');
            return;
        }
        try {
            setErrMsg(() => '');
            setBotIsTyping(true);
            setMessages((prev) => [
                ...prev,
                { role: 'user', content: data.prompt },
            ]);
            const res = await new Promise<{ data: ApiResponse }>((res, rej) => {
                setTimeout(
                    () =>
                        res({
                            data: {
                                statusCode: 200,
                                message: 'response generated successfully',
                                data: { message: 'Hello, how are you?' },
                                errors: ['hello'],
                            },
                        }),
                    5000
                );
            });
            const parsedResponseData =
                await apiSuccessChatResponseSchema.safeParseAsync(res.data);
            if (!parsedResponseData.success) {
                debugger;
                setErrMsg(UNEXPECTED_ERR_MSG);
                return;
            }
            const msg = parsedResponseData.data.data.message;
            setMessages((prev) => [...prev, { role: 'bot', content: msg }]);
        } catch (e) {
            if (e instanceof AxiosError) {
                const apiResponse = e.response;
                const statusCode = apiResponse?.status ?? 500;
                const isBadRequest = statusCode >= 400 && statusCode <= 499;
                if (isBadRequest) {
                    setErrMsg(apiResponse?.data.message ?? UNEXPECTED_ERR_MSG);
                    return;
                }
            }
            setErrMsg(UNEXPECTED_ERR_MSG);
        } finally {
            setBotIsTyping(false);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col gap-2 p-4">
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto mb-2">
                    <MessagesList messages={messages} />
                    {botIsTyping && <TypingIndicator />}
                    {errMsg && <p className="text-red-600">{errMsg}</p>}
                </div>
                <div className="h-34">
                    <ChatInput
                        submit={sendPromptToLLM}
                        botIsTyping={botIsTyping}
                    />
                </div>
            </div>
        </div>
    );
}
