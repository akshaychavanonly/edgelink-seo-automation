require("dotenv").config();

const { crawlWebsite } = require("../src/crawlers/website");

async function main() {
  const result = await crawlWebsite("https://example.com");

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Crawler failed:", error.message);
  process.exitCode = 1;
});
