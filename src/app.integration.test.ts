import request from 'supertest';
import { createApp } from './createApp';

jest.mock('./services/githubService');
import { searchRepositories } from './services/githubService';
import { GitHubSearchResponse } from './types';

const mockSearchRepositories = searchRepositories as jest.MockedFunction<typeof searchRepositories>;
const app = createApp();

describe('API Endpoint: /score/repositories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 for missing query parameter "q"', async () => {
    const response = await request(app)
      .get('/score/repositories')
      .expect(400);

    expect(response.body.error).toBe('Invalid parameters');
  });

  test('should return 400 for an invalid "created_after" date format', async () => {
    const response = await request(app)
      .get('/score/repositories?q=react&created_after=invalid-date')
      .expect(400);

    expect(response.body.error).toBe('Invalid parameters');
  });

  test('should return 200 and repository data for a valid request', async () => {
    const mockResult: GitHubSearchResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          id: 1,
          stargazers_count: 100,
          forks_count: 50,
          updated_at: '2024-01-01T00:00:00Z',
          popularity_score: 0.85,
        },
      ],
    };

    mockSearchRepositories.mockResolvedValue(mockResult);

    const response = await request(app)
      .get('/score/repositories?q=react')
      .expect(200);

    expect(response.body).toEqual(mockResult);
    expect(mockSearchRepositories).toHaveBeenCalledWith({
      q: 'react',
      sort: undefined,
      order: undefined,
      per_page: 30, // default value
      page: 1,      // default value
    });
  });
});
