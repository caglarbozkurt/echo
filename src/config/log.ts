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
    date: "2026-05-23",
    title: "What is echo?",
    description:
      "An intro to echo — what it is, how to publish, and what's coming next.",
    url: "/d/wIr2I5GD",
  },
];
