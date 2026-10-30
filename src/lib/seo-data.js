const { crawlWebsite } = require("../crawlers/website");
const { getPageSpeed } = require("../crawlers/pagespeed");
const { getSearchConsole } = require("../crawlers/gsc");
const { getKeywordRankings } = require("../crawlers/dataforseo");

async function collectSEOData(url) {
  console.log("Starting SEO data collection:", url);

  const website = await crawlWebsite(url);

  const pageSpeed = await getPageSpeed(url);
  const searchConsole = await getSearchConsole(url);
  const rankings = await getKeywordRankings(url);

  return {
    url,
    onPage: website.onPage,
    technical: {
      ...website.technical,
      statusCode: website.statusCode,
    },
    schema: website.schema,
    coreWebVitals: pageSpeed,
    searchConsole,
    rankings,
    mockIntegrations: process.env.USE_MOCKS === "true",
  };
}

module.exports = { collectSEOData };
