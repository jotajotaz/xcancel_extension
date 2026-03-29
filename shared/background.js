"use strict";

const X_HOSTS = ["x.com", "www.x.com", "twitter.com", "www.twitter.com"];

const EXCLUDED_PATH_PATTERNS = [
  /^\/i\/article(\/|$)/i,
  /^\/[^/]+\/article(\/|$)/i,
];

// Fallback redirect via webNavigation for direct navigations
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (details.frameId !== 0) return;
    try {
      const url = new URL(details.url);
      if (!X_HOSTS.includes(url.hostname)) return;
      if (EXCLUDED_PATH_PATTERNS.some((p) => p.test(url.pathname))) return;
      url.hostname = "xcancel.com";
      chrome.tabs.update(details.tabId, { url: url.toString() });
    } catch {}
  },
  { url: [{ hostContains: "x.com" }, { hostContains: "twitter.com" }] }
);
