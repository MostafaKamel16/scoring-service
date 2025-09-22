import { config } from "../config";
import { processRepositories } from "../utils/popularityScore";
import { SearchParams } from "../types";

export async function searchRepositories(params: SearchParams) {
  const qs = new URLSearchParams({
    q: params.q,
    ...(params.sort && { sort: params.sort }),
    ...(params.order && { order: params.order }),
    per_page: params.per_page.toString(),
    page: params.page.toString(),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    config.server.requestTimeoutMs,
  );

  try {
    const response = await fetch(
      `${config.github.baseUrl}/search/repositories?${qs}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": config.github.userAgent,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    return {
      ...data,
      items: processRepositories(items),
    };
  } catch (error) {
    const isError = (err: unknown): err is Error => err instanceof Error;

    if (isError(error) && error.name === "AbortError") {
      throw new Error("GitHub API request timed out");
    }

    const message = isError(error) ? error.message : "Unknown error occurred";
    throw new Error(`Network error: ${message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
