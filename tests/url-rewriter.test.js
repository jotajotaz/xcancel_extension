const { isXUrl, isArticleUrl, shouldRewrite, rewriteUrl } = require("../shared/url-rewriter");

describe("isXUrl", () => {
  test.each([
    ["https://x.com/user/status/123", true],
    ["https://www.x.com/user", true],
    ["https://twitter.com/user", true],
    ["https://www.twitter.com/user/status/456", true],
    ["http://x.com/user", true],
    ["https://xcancel.com/user", false],
    ["https://example.com", false],
    ["https://notx.com/path", false],
    ["not a url", false],
  ])("%s → %s", (url, expected) => {
    expect(isXUrl(url)).toBe(expected);
  });
});

describe("isArticleUrl", () => {
  test.each([
    // Article URLs — should be excluded
    ["https://x.com/i/article/123", true],
    ["https://x.com/i/article/123/foo", true],
    ["https://x.com/username/article/456", true],
    ["https://twitter.com/i/article/789", true],
    ["https://www.x.com/i/article/abc", true],

    // Non-article URLs — should NOT be excluded
    ["https://x.com/user/status/123", false],
    ["https://x.com/user", false],
    ["https://x.com/i/spaces/abc", false],
    ["https://x.com/search?q=article", false],
  ])("%s → %s", (url, expected) => {
    expect(isArticleUrl(url)).toBe(expected);
  });
});

describe("shouldRewrite", () => {
  test("rewrites normal x.com URLs", () => {
    expect(shouldRewrite("https://x.com/elonmusk")).toBe(true);
  });

  test("does not rewrite article URLs", () => {
    expect(shouldRewrite("https://x.com/i/article/123")).toBe(false);
  });

  test("does not rewrite non-X URLs", () => {
    expect(shouldRewrite("https://google.com")).toBe(false);
  });
});

describe("rewriteUrl", () => {
  test("rewrites x.com to xcancel.com", () => {
    expect(rewriteUrl("https://x.com/user/status/123")).toBe(
      "https://xcancel.com/user/status/123"
    );
  });

  test("rewrites twitter.com to xcancel.com", () => {
    expect(rewriteUrl("https://twitter.com/user")).toBe(
      "https://xcancel.com/user"
    );
  });

  test("rewrites www variants", () => {
    expect(rewriteUrl("https://www.x.com/user")).toBe(
      "https://xcancel.com/user"
    );
    expect(rewriteUrl("https://www.twitter.com/user")).toBe(
      "https://xcancel.com/user"
    );
  });

  test("preserves path, query, and hash", () => {
    expect(rewriteUrl("https://x.com/user/status/123?ref=home#top")).toBe(
      "https://xcancel.com/user/status/123?ref=home#top"
    );
  });

  test("returns article URLs unchanged", () => {
    const url = "https://x.com/i/article/123";
    expect(rewriteUrl(url)).toBe(url);
  });

  test("returns non-X URLs unchanged", () => {
    const url = "https://google.com/search";
    expect(rewriteUrl(url)).toBe(url);
  });

  test("handles http (not https)", () => {
    expect(rewriteUrl("http://x.com/user")).toBe("http://xcancel.com/user");
  });
});
