/**
 * GitHub Service for fetching user activity data
 * Uses GitHub API to fetch repos, events, and estimate commits
 */

import { env } from '../../config/env.js';

export type GitHubUserStats = {
  username: string;
  repos: number;
  commits: number;
  score: number;
};

export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly delayMs = 1000; // Delay between API calls to avoid rate limits

  /**
   * Get headers for GitHub API requests
   * Includes authorization token if GITHUB_TOKEN is configured
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (env.githubToken) {
      headers.Authorization = `Bearer ${env.githubToken}`;
    }
    return headers;
  }

  /**
   * Delay helper for rate limiting
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Fetch GitHub user statistics including public repos and estimated commits
   * Includes rate limit handling with delay between calls
   */
  async fetchUserStats(username: string, index = 0): Promise<GitHubUserStats | null> {
    try {
      // Add delay based on index to avoid rate limits when processing multiple users
      if (index > 0) {
        await this.delay(this.delayMs * index);
      }

      // Fetch user profile
      const userRes = await fetch(`${this.baseUrl}/users/${username}`, {
        headers: this.getHeaders(),
      });

      if (!userRes.ok) {
        if (userRes.status === 404) {
          return null;
        }
        if (userRes.status === 403) {
          console.warn(`GitHub API rate limit hit for ${username}`);
          return null;
        }
        throw new Error(`GitHub API error: ${userRes.status}`);
      }

      const user = (await userRes.json()) as {
        public_repos: number;
      };

      // Fetch events to estimate commits
      const eventsRes = await fetch(`${this.baseUrl}/users/${username}/events/public?per_page=100`, {
        headers: this.getHeaders(),
      });

      let estimatedCommits = 0;
      if (eventsRes.ok) {
        const events = (await eventsRes.json()) as Array<{ type: string; payload?: { commits?: unknown[] } }>;
        // Count PushEvent commits
        for (const event of events) {
          if (event.type === 'PushEvent' && event.payload?.commits) {
            estimatedCommits += event.payload.commits.length;
          }
        }
      }

      // Calculate score based on repos and commits
      const score = this.calculateScore(user.public_repos, estimatedCommits);

      return {
        username,
        repos: user.public_repos,
        commits: estimatedCommits,
        score,
      };
    } catch (error) {
      console.error(`Failed to fetch GitHub stats for ${username}:`, error);
      return null;
    }
  }

  /**
   * Calculate a score based on repos and commits
   * Formula: repos * 10 + commits * 2
   */
  calculateScore(repos: number, commits: number): number {
    return repos * 10 + commits * 2;
  }

  /**
   * Compute ranks for leaderboard entries based on scores
   * Higher scores get lower (better) ranks
   */
  computeRanks<T extends { score: number }>(entries: T[]): Array<T & { rank: number }> {
    // Sort by score descending
    const sorted = [...entries].sort((a, b) => b.score - a.score);
    
    let currentRank = 1;
    let lastScore: number | null = null;
    
    return sorted.map((entry, index) => {
      // If score is different from last, update rank
      if (lastScore !== null && entry.score !== lastScore) {
        currentRank = index + 1;
      }
      lastScore = entry.score;
      
      return {
        ...entry,
        rank: currentRank,
      };
    });
  }
}

export const githubService = new GitHubService();
