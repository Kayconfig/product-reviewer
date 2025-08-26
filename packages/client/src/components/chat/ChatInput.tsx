import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
export type Chat = {
    prompt: '';
};

type Props = {
    submit: (data: Chat) => void;
    botIsTyping: boolean;
};
export default function ChatInput({ submit, botIsTyping }: Props) {
    const { register, reset, handleSubmit, formState } = useForm<Chat>();

    const performSubmit = handleSubmit((data: Chat) => {
        reset({ prompt: '' });
        submit(data);
    });
    return (
        <form
            onSubmit={performSubmit}
            className="w-full h-full flex p-4 border-2 rounded-2xl"
            onKeyDown={(e) => {
                if (!e.shiftKey && e.key === 'Enter') {
                    e.preventDefault();
                    performSubmit();
                }
            }}
        >
            <textarea
                {...register('prompt', {
                    validate: (prompt) => prompt.trim().length > 0,
                    required: true,
                    minLength: 2,
                    maxLength: 1000,
                })}
                className="border w-full h-full border-none resize-none focus:outline-none"
                placeholder="Enter a message"
                maxLength={1000}
            />
            <Button
                className="w-12 h-12 rounded-full"
                type="submit"
                disabled={formState.isLoading || botIsTyping}
            >
                {' '}
                <FaArrowUp />
            </Button>
        </form>
    );
}
