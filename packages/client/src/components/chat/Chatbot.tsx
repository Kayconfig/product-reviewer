import { useEffect, useRef, useState, type ReactNode } from 'react';
import ChatInput, { type Chat } from './ChatInput';
import MessagesList, { type Message, type Messages } from './MessageList';
import TypingIndicator from './TypingIndicator';
import axios, { AxiosError } from 'axios';
import { UNEXPECTED_ERR_MSG } from '@/lib/error-msgs';

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
    const [chatId, setChatId] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [pageLoadError, setPageLoadError] = useState(false);
    const lastMsgRef = useRef<Message | null>(null);

    const userIdRef = useRef(crypto.randomUUID());

    useEffect(() => {
        //create chat on server
        axios
            .post('/api/v1/chat', { userId: userIdRef.current })
            .then((axiosResponse) => {
                const chatId = axiosResponse.data.data.id;
                if (!chatId) {
                    setPageLoadError(true);
                }
                setChatId(chatId);
            })
            .catch((e) => setPageLoadError(true))
            .finally(() => setPageLoading(false));
    }, []);

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
                {
                    id: crypto.randomUUID(),
                    role: 'user',
                    content: data.prompt,
                    complete: true,
                },
            ]);
            const { data: apiResponse } = await axios.post(
                `/api/v1/chat/${chatId}`,
                { prompt: data.prompt, userId: userIdRef.current }
            );

            const msg = apiResponse.data;

            let aiResponse: Message = {
                id: msg.id,
                content: msg.content,
                role: 'bot',
                complete: true,
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch (e) {
            debugger;

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

    const Center = ({ children }: { children: ReactNode }) => {
        return (
            <div className="flex items-center justify-center">{children}</div>
        );
    };

    if (pageLoading) {
        return (
            <Center>
                <p className="text-5xl"> Loading....</p>{' '}
            </Center>
        );
    }

    if (pageLoadError) {
        return (
            <Center>
                <p>
                    Unexpected error occurred, please reload or try again later.
                </p>
            </Center>
        );
    }

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
