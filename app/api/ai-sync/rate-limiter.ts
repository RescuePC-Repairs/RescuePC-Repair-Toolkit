export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private requests: number[];

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = [];
  }

  public tryRequest(): boolean {
    const now = Date.now();

    // Remove expired timestamps
    this.requests = this.requests.filter((timestamp) => now - timestamp < this.windowMs);

    // Check if under limit
    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    // Add new request
    this.requests.push(now);
    return true;
  }

  public getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter((timestamp) => now - timestamp < this.windowMs);
    return this.maxRequests - this.requests.length;
  }

  public reset(): void {
    this.requests = [];
  }
}
