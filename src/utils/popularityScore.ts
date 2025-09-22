import { config } from "../config";

interface Repository {
  id?: number;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  [key: string]: unknown;
}

export const calculatePopularityScore = (repo: Repository): number => {
  const { stars, forks, recency } = config.scoring.weights;
  const starCount = repo.stargazers_count || 0;
  const forkCount = repo.forks_count || 0;

  const updatedAt = new Date(repo.updated_at);
  const now = Date.now();
  const daysSinceUpdate = (now - updatedAt.getTime()) / 86_400_000;
  const recencyScore = 1 / (daysSinceUpdate + 1);

  const normalizedStars = Math.log10(starCount + 1);
  const normalizedForks = Math.log10(forkCount + 1);

  const raw =
    normalizedStars * stars + normalizedForks * forks + recencyScore * recency;
  const bounded = 1 / (1 + Math.exp(-raw));
  return Number(bounded.toFixed(4));
};

export const processRepositories = (items: Repository[]) =>
  items
    .map((r) => ({ ...r, popularity_score: calculatePopularityScore(r) }))
    .sort((a, b) => b.popularity_score - a.popularity_score);
