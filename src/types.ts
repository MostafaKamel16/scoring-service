import { z } from "zod";

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Array<{
    id: number;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    popularity_score: number;
    [key: string]: unknown;
  }>;
}

export const searchSchema = z.object({
  q: z.string().min(1, 'Query parameter "q" is required'),
  sort: z.enum(["stars", "forks", "help-wanted-issues", "updated"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  per_page: z.coerce.number().min(1).max(100).default(30),
  page: z.coerce.number().min(1).default(1),
  created_after: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  language: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchSchema>;
