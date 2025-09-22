import { calculatePopularityScore, processRepositories } from '../popularityScore';

describe('calculatePopularityScore', () => {
  test('should return a number between 0 and 1', () => {
    const repo = {
      stargazers_count: 100,
      forks_count: 50,
      updated_at: '2024-01-01T00:00:00Z'
    };
    
    const score = calculatePopularityScore(repo);
    
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  test('should handle zero stars and forks', () => {
    const repo = {
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2024-01-01T00:00:00Z'
    };
    
    const score = calculatePopularityScore(repo);
    
    expect(score).toBeGreaterThan(0);
  });

  test('should give different scores for different repos', () => {
    const smallRepo = {
      stargazers_count: 10,
      forks_count: 5,
      updated_at: '2024-01-01T00:00:00Z'
    };
    
    const bigRepo = {
      stargazers_count: 1000,
      forks_count: 500,
      updated_at: '2024-01-01T00:00:00Z'
    };
    
    const smallScore = calculatePopularityScore(smallRepo);
    const bigScore = calculatePopularityScore(bigRepo);
    
    expect(bigScore).toBeGreaterThan(smallScore);
  });
});

describe('processRepositories', () => {
  test('should add popularity_score to repos', () => {
    const repos = [
      { stargazers_count: 100, forks_count: 50, updated_at: '2024-01-01T00:00:00Z' }
    ];

    const result = processRepositories(repos);

    expect(result[0]).toHaveProperty('popularity_score');
    expect(typeof result[0].popularity_score).toBe('number');
  });

  test('should return empty array for empty input', () => {
    const result = processRepositories([]);
    expect(result).toEqual([]);
  });
});
