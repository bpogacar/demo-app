class RiotRateLimiter {
    private shortTermQueue: number[] = [];
    private longTermQueue: number[] = [];

    async waitForRateLimit() {
        const now = Date.now();

        // Short-term rate limit (20 requests per 1 second)
        this.shortTermQueue = this.shortTermQueue.filter(time => now - time < 1000);
        if (this.shortTermQueue.length >= 20) {
            await new Promise(resolve => setTimeout(resolve, 1000 - (now - this.shortTermQueue[0])));
        }

        // Long-term rate limit (100 requests per 2 minutes)
        this.longTermQueue = this.longTermQueue.filter(time => now - time < 120000);
        if (this.longTermQueue.length >= 100) {
            await new Promise(resolve => setTimeout(resolve, 120000 - (now - this.longTermQueue[0])));
        }

        // Add current timestamp to both queues
        this.shortTermQueue.push(now);
        this.longTermQueue.push(now);
    }
}

// Create an instance of the rate limiter
export const riotRateLimiter = new RiotRateLimiter();