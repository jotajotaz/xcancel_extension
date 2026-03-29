"use strict";

// url-rewriter.js is loaded before this script via manifest content_scripts order

function rewriteLinks(root) {
  const anchors = root.querySelectorAll('a[href*="x.com"], a[href*="twitter.com"]');
  for (const a of anchors) {
    if (shouldRewrite(a.href)) {
      a.href = rewriteUrl(a.href);
    }
  }
}

// Rewrite existing links on page load
rewriteLinks(document);

// Watch for dynamically added links (SPAs, infinite scroll)
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.tagName === "A") {
        if (shouldRewrite(node.href)) {
          node.href = rewriteUrl(node.href);
        }
      }
      // Also check children of the added node
      rewriteLinks(node);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
