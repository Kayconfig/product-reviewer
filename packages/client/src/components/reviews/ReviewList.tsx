import type { ApiResponse } from '@/common/interfaces/api-response';
import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import Summary from './Summary';
import { useParams } from 'react-router';

type Props = {
    productId: number;
};

type Review = {
    id: number;
    author: string;
    content: string;
    rating: number;
    createdAt: string;
};

type Summary = {
    content: string;
    id: number;
};
type CreateSummaryResponseData = {
    summary: Summary;
};

type GetReviewsResponse = {
    reviews: Review[];
    summary: string | null;
};

function ErrorPage({ errMsg }: { errMsg?: string }) {
    errMsg = 'Unable to load page, please try again later.';
    return (
        <div className="p-4">
            <p className="text-red-500">{errMsg}</p>
        </div>
    );
}

export default function ReviewList() {
    const { productId } = useParams();
    if (!productId) {
        return <ErrorPage />;
    }
    const {
        data: fetchReviewResponse,
        error,
        isLoading,
    } = useQuery<GetReviewsResponse>({
        queryKey: ['reviews', productId],
        queryFn: () => fetchReviews(),
        retry: 2,
    });

    const {
        data: summary,
        error: createSummaryError,
        isLoading: createSummaryLoading,
        refetch: handleSummaryCreation,
    } = useQuery<Summary>({
        queryKey: ['summary', productId],
        queryFn: () => createSummary(),
        retry: 0,
        enabled: false,
    });

    const createSummary = async () => {
        const { data } = await axios.post<
            ApiResponse<CreateSummaryResponseData>
        >(`/api/v1/product/${productId}/review/summary`);
        return data.data.summary;
    };

    const fetchReviews = async () => {
        const { data } = await axios.get<ApiResponse<GetReviewsResponse>>(
            `/api/v1/product/${productId}/review`
        );
        return data.data;
    };

    if (isLoading)
        return (
            <div className="p-4 flex flex-col gap-5">
                <Skeleton width={500} height={100} />
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <Skeleton width={150} />
                        <Skeleton width={150} />
                        <div className="py-2">
                            <Skeleton height={50} width={500} />
                        </div>
                    </div>
                ))}
            </div>
        );

    if (error) {
        return <ErrorPage />;
    }

    if (!fetchReviewResponse?.reviews.length) {
        return null;
    }

    const summaryContent = fetchReviewResponse?.summary ?? summary?.content;

    return (
        <div className="p-4">
            <div className="mb-5">
                <Summary
                    handleSummaryCreation={handleSummaryCreation}
                    summaryContent={summaryContent}
                    createSummaryLoading={createSummaryLoading}
                    createSummaryError={createSummaryError}
                />
            </div>
            <div className="flex flex-col gap-5">
                {fetchReviewResponse?.reviews.map((review) => (
                    <div key={review.id}>
                        <div className="font-semibold">{review.author}</div>
                        <div>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="py-2">{review.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
