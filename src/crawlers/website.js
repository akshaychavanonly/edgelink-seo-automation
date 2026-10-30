const cheerio = require("cheerio");
const dns = require("node:dns").promises;
const net = require("node:net");

function isPrivateIP(ip) {
  if (net.isIP(ip) === 6) {
    const normalized = ip.toLowerCase();
    if (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb") ||
      normalized.startsWith("::ffff:")
    )
      return true;
    return false;
  }

  const p = ip.split(".").map(Number);
  if (p.length !== 4) return true;

  return (
    p[0] === 0 ||
    p[0] === 10 ||
    p[0] === 127 ||
    p[0] >= 224 ||
    (p[0] === 169 && p[1] === 254) ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168) ||
    (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
    (p[0] === 192 && p[1] === 0) ||
    (p[0] === 192 && p[1] === 0 && p[2] === 2) ||
    (p[0] === 198 && p[1] >= 18 && p[1] <= 19) ||
    (p[0] === 198 && p[1] === 51 && p[2] === 100) ||
    (p[0] === 203 && p[1] === 0 && p[2] === 113)
  );
}

async function validateUrl(input) {
  const url = new URL(input);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS are allowed");
  }

  if (url.username || url.password || url.port) {
    throw new Error("Credentials and custom ports are not allowed");
  }

  if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) {
    throw new Error("Local URLs are not allowed");
  }

  const addresses = await dns.lookup(url.hostname, { all: true });

  if (
    !addresses.length ||
    addresses.some(({ address }) => isPrivateIP(address))
  ) {
    throw new Error("Private or invalid network address");
  }

  return url;
}

async function fetchPage(url, method = "GET") {
  await validateUrl(url);

  const response = await fetch(url, {
    method,
    redirect: "manual",
    signal: AbortSignal.timeout(12000),
    headers: {
      "User-Agent": "EdgelinkSEOAudit/1.0",
      Accept: "text/html,application/xhtml+xml,*/*",
    },
  });

  if (response.status >= 300 && response.status < 400) {
    throw new Error("Redirects are not followed automatically");
  }

  return response;
}

async function checkFile(url) {
  try {
    const response = await fetchPage(url);
    await response.body?.cancel();
    return response.ok;
  } catch {
    return false;
  }
}

async function crawlWebsite(websiteUrl) {
  const url = await validateUrl(websiteUrl);
  const response = await fetchPage(url.href);

  if (!response.ok) {
    throw new Error(`Website returned HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    throw new Error("URL does not return HTML");
  }

  const contentLength = Number(response.headers.get("content-length") || 0);

  if (contentLength > 2_000_000) {
    throw new Error("HTML response is too large");
  }

  const html = await response.text();

  if (Buffer.byteLength(html) > 2_000_000) {
    throw new Error("HTML response exceeds size limit");
  }

  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();

  const metaDescription = $('meta[name="description"]').attr("content") || "";

  const headings = {
    h1: $("h1")
      .map((_, el) => $(el).text().trim())
      .get(),
    h2: $("h2")
      .map((_, el) => $(el).text().trim())
      .get(),
    h3: $("h3")
      .map((_, el) => $(el).text().trim())
      .get(),
  };

  const images = $("img");
  const missingAlt = images.filter(
    (_, el) => !$(el).attr("alt")?.trim(),
  ).length;

  const canonical = $('link[rel="canonical"]').attr("href") || null;

  const schemaData = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      schemaData.push(JSON.parse($(el).html()));
    } catch {
      schemaData.push({ error: "Invalid JSON-LD" });
    }
  });

  const origin = url.origin;

  const [robotsExists, sitemapExists] = await Promise.all([
    checkFile(`${origin}/robots.txt`),
    checkFile(`${origin}/sitemap.xml`),
  ]);

  return {
    url: websiteUrl,
    statusCode: response.status,
    onPage: {
      title,
      titleLength: title.length,
      metaDescription,
      metaDescriptionLength: metaDescription.length,
      headings,
      imageCount: images.length,
      imagesMissingAlt: missingAlt,
      canonical,
    },
    technical: {
      robotsExists,
      sitemapExists,
    },
    schema: {
      count: schemaData.length,
      items: schemaData,
    },
  };
}

module.exports = { crawlWebsite };
