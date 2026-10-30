const { USE_MOCKS } = require("../mocks");
const mockData = require("../mocks/pagespeed.mock");

async function getPageSpeed(url) {
  if (USE_MOCKS) {
    return mockData;
  }

  throw new Error("Real PageSpeed integration not configured");
}

module.exports = { getPageSpeed };
