type Role = 'user' | 'bot';
export type Message = {
    id: string;
    content: string;
    role: Role;
    complete: boolean;
};
export type Messages = Message[];

type Prop = {
    messages: Messages;
};
export default function MessagesList({ messages }: Prop) {
    const getStylingForRole = (role: Role) => {
        if (role === 'bot') {
            return 'text-black bg-gray-200 self-start';
        }
        return 'text-white bg-blue-600 self-end';
    };
    return (
        <div className="w-full h-full p-2 flex flex-col gap-2">
            {messages.map(({ content, role }, idx) => (
                <p
                    className={`p-2 rounded-2xl w-max-2 ${getStylingForRole(role)}`}
                    key={idx}
                >
                    {content}
                </p>
            ))}
        </div>
    );
}
