function Dot({ className }: { className?: string }) {
    return (
        <div
            className={`w-2 h-2 rounded-full bg-black animate-pulse ${className}`}
        ></div>
    );
}
export default function TypingIndicator() {
    return (
        <div className="flex gap-1 p-2 bg-gray-300 rounded-full self-start">
            <Dot />
            <Dot className="[animation-delay:0.2s]" />
            <Dot className="[animation-delay:0.4s]" />
        </div>
    );
}
