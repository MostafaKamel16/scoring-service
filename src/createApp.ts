import express from "express";
import { z } from "zod";
import { InMemoryCache } from "./utils/cache";
import { buildGitHubQuery } from "./utils/queryBuilder";
import { searchRepositories } from "./services/githubService";
import { config } from "./config";
import { searchSchema, GitHubSearchResponse } from "./types";

export function createApp() {
  const app = express();
  const cache = new InMemoryCache<GitHubSearchResponse>(
    config.cache.ttlMs,
    config.cache.maxEntries,
  );

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/score/repositories", async (req, res) => {
    try {
      const { q, sort, order, per_page, page, created_after, language } =
        searchSchema.parse(req.query);

      const searchQuery = buildGitHubQuery(q, language, created_after);

      const cacheKey = new URLSearchParams({
        q: searchQuery,
        ...(sort && { sort }),
        ...(order && { order }),
        per_page: per_page.toString(),
        page: page.toString(),
      }).toString();

      const cached = cache.get(cacheKey);
      if (cached) {
        console.log("Cache hit for key:", cacheKey);
        return res.json(cached);
      }

      const result = await searchRepositories({
        q: searchQuery,
        sort,
        order,
        per_page,
        page,
      });

      cache.set(cacheKey, result);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid parameters",
          details: error.issues,
        });
      }
      console.error("Error searching repositories:", error);
      res.status(500).json({ error: "Failed to search repositories" });
    }
  });

  return app;
}
