require("dotenv").config();

const { collectSEOData } = require("../src/lib/seo-data");
const { analyzeSEO } = require("../src/lib/claude");

async function main() {
  try {
    console.log("Collecting SEO data...");

    const data = await collectSEOData("https://example.com");

    console.log("Running AI analysis...");

    const result = await analyzeSEO(data, {
      businessType: "Dental Clinic",
      city: "Pune",
      state: "Maharashtra",
    });

    console.log("\nAI ANALYSIS COMPLETED");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("AI analysis failed:", error.message);
    process.exitCode = 1;
  }
}

main();
