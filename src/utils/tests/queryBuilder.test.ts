import { buildGitHubQuery } from '../queryBuilder';

describe('buildGitHubQuery', () => {
  test('should return base query when no filters provided', () => {
    const result = buildGitHubQuery('react');
    expect(result).toBe('react');
  });

  test('should add language filter', () => {
    const result = buildGitHubQuery('react', 'javascript');
    expect(result).toBe('react language:javascript');
  });

  test('should add created_after filter', () => {
    const result = buildGitHubQuery('react', undefined, '2024-01-01');
    expect(result).toBe('react created:>=2024-01-01');
  });

  test('should add both language and created_after filters', () => {
    const result = buildGitHubQuery('react', 'typescript', '2024-01-01');
    expect(result).toBe('react language:typescript created:>=2024-01-01');
  });

  test('should handle empty language parameter', () => {
    const result = buildGitHubQuery('react', '', '2024-01-01');
    expect(result).toBe('react created:>=2024-01-01');
  });

  test('should handle empty created_after parameter', () => {
    const result = buildGitHubQuery('react', 'javascript', '');
    expect(result).toBe('react language:javascript');
  });
});
