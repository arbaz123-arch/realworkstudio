/**
 * GitHub Service for fetching user activity data
 * Uses GitHub API to fetch repos, events, and estimate commits
 */

export type GitHubUserStats = {
  username: string;
  repos: number;
  commits: number;
  score: number;
};

export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';

  /**
   * Fetch GitHub user statistics including public repos and estimated commits
   */
  async fetchUserStats(username: string): Promise<GitHubUserStats | null> {
    try {
      // Fetch user profile
      const userRes = await fetch(`${this.baseUrl}/users/${username}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userRes.ok) {
        if (userRes.status === 404) {
          return null;
        }
        throw new Error(`GitHub API error: ${userRes.status}`);
      }

      const user = (await userRes.json()) as {
        public_repos: number;
      };

      // Fetch events to estimate commits
      const eventsRes = await fetch(`${this.baseUrl}/users/${username}/events/public?per_page=100`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
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
