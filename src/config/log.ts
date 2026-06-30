/**
 * Log entries shown at the bottom of the homepage.
 * Add new entries at the top of the array. Newest first.
 *
 * Each entry links to a doc published via echo itself (eat your own dog food).
 */

export type LogEntry = {
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  url: string; // /d/<slug> or full URL
};

export const logEntries: LogEntry[] = [
  {
    date: "2026-06-29",
    title: "What is echo?",
    description:
      "An intro to echo — what it is, how to publish, and how to use it from an agent.",
    url: "/d/2Jp6gA7a",
  },
];
