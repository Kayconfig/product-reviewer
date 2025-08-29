export const reviewPrompt = `
You are an expert product reviewer. Summarize the following customer reviews into a short paragraph highlighting key themes, both positive and negative:
{reviews}

Remember the following rules
* Be as thorough as possible in your review. providing all necessary information to help customers decide on whether to buy the product or not.
* Your response should contain only the review, nothing more or less.

`;

export function getPromptForReviewSummary(reviews: string): string {
    return reviewPrompt.replace('{reviews}', reviews);
}
