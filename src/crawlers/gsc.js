const { USE_MOCKS } = require("../mocks");
const mockData = require("../mocks/gsc.mock");

async function getSearchConsole(url) {
  if (USE_MOCKS) {
    return mockData;
  }

  throw new Error("Real GSC integration not configured");
}

module.exports = { getSearchConsole };
