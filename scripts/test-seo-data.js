require("dotenv").config();

const { collectSEOData } = require("../src/lib/seo-data");

async function main() {
  const url = "https://example.com";

  try {
    const result = await collectSEOData(url);

    console.log("SEO DATA COLLECTION SUCCESSFUL");

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("SEO collection failed:", error.message);
    process.exitCode = 1;
  }
}

main();
