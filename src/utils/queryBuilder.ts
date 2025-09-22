export function buildGitHubQuery(
  q: string,
  language?: string,
  created_after?: string,
): string {
  let query = q;

  if (language) {
    query += ` language:${language}`;
  }

  if (created_after) {
    query += ` created:>=${created_after}`;
  }

  return query;
}
