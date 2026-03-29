"use strict";

const X_HOSTS = ["x.com", "www.x.com", "twitter.com", "www.twitter.com"];
const TARGET_HOST = "xcancel.com";

// Patterns that should NOT be rewritten (xcancel doesn't support these)
const EXCLUDED_PATH_PATTERNS = [
  /^\/i\/article(\/|$)/i,
  /^\/[^/]+\/article(\/|$)/i,
];

function isXUrl(url) {
  try {
    const parsed = new URL(url);
    return X_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

function isArticleUrl(url) {
  try {
    const parsed = new URL(url);
    return EXCLUDED_PATH_PATTERNS.some((pattern) => pattern.test(parsed.pathname));
  } catch {
    return false;
  }
}

function shouldRewrite(url) {
  return isXUrl(url) && !isArticleUrl(url);
}

function rewriteUrl(url) {
  if (!shouldRewrite(url)) return url;
  try {
    const parsed = new URL(url);
    parsed.hostname = TARGET_HOST;
    return parsed.toString();
  } catch {
    return url;
  }
}

// Export for both Node.js (tests) and browser (content script)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { isXUrl, isArticleUrl, shouldRewrite, rewriteUrl, X_HOSTS, TARGET_HOST };
}
