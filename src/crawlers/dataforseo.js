const { USE_MOCKS } = require("../mocks");
const mockData = require("../mocks/dataforseo.mock");

async function getKeywordRankings(url) {
  if (USE_MOCKS) {
    return mockData;
  }

  throw new Error("Real DataForSEO integration not configured");
}

module.exports = { getKeywordRankings };
