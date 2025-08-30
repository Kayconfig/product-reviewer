import { FaRegStar, FaStar } from 'react-icons/fa';

type Props = {
    rating: number;
};
export default function StarRating({ rating }: Props) {
    const placeholders = [1, 2, 3, 4, 5];
    return (
        <div className="flex gap-1 text-yellow-500">
            {placeholders.map((p) =>
                p <= rating ? <FaStar key={p} /> : <FaRegStar key={p} />
            )}
        </div>
    );
}
