"use strict";

// Runs at document_start on x.com/twitter.com pages.
// Redirects before the page renders anything.

(function () {
  var host = location.hostname;
  if (
    host !== "x.com" &&
    host !== "www.x.com" &&
    host !== "twitter.com" &&
    host !== "www.twitter.com"
  ) return;

  // Don't redirect articles
  if (/^\/i\/article(\/|$)/i.test(location.pathname)) return;
  if (/^\/[^/]+\/article(\/|$)/i.test(location.pathname)) return;

  location.replace(
    location.href.replace(/^(https?:\/\/)(www\.)?(x\.com|twitter\.com)/, "$1xcancel.com")
  );
})();
