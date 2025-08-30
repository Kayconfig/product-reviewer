import { HiSparkles } from 'react-icons/hi2';
import { Button } from '../ui/button';
import Skeleton from 'react-loading-skeleton';

type Props = {
    handleSummaryCreation: () => void;
    summaryContent: string | undefined;
    createSummaryLoading: boolean;
    createSummaryError: Error | null;
};
export default function Summary({
    handleSummaryCreation,
    summaryContent,
    createSummaryError,
    createSummaryLoading,
}: Props) {
    const createSummaryLoadingSkeleton = <Skeleton width={500} height={50} />;

    if (createSummaryLoading) {
        return createSummaryLoadingSkeleton;
    }

    if (createSummaryError) {
        return (
            <p className="text-red-500">
                Unable to summarize, please try again later
            </p>
        );
    }
    return (
        <div className="w-full h-full">
            {summaryContent ? (
                <p>{summaryContent}</p>
            ) : (
                <Button
                    className="cursor-pointer"
                    onClick={handleSummaryCreation}
                >
                    {' '}
                    <HiSparkles />
                    Summarize{' '}
                </Button>
            )}
        </div>
    );
}
