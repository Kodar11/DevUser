import axios from "axios";
import * as cheerio from "cheerio";

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SEARCH_SOURCES = ["stackoverflow.com", "github.com", "medium.com", "dev.to"];

export async function scrapeSolutions(problemTitle: string, description: string) {
  try {
    const query = encodeURIComponent(`${problemTitle} ${description}`);
    const results: { title: string; link: string; snippet: string }[] = [];

    for (const source of SEARCH_SOURCES) {
      const searchUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=https://www.google.com/search?q=${query}+site:${source}`;

      const response = await axios.get(searchUrl);
      const html = response.data;

      // Extract search results using Cheerio
      const extractedResults = parseGoogleResults(html);
      results.push(...extractedResults);
    }

    return results.filter(sol => sol.link); // Remove invalid results
  } catch (error) {
    console.error("Error scraping solutions:", error);
    return [];
  }
}

function parseGoogleResults(html: string) {
  const $ = cheerio.load(html);
  const searchResults: { title: string; link: string; snippet: string }[] = [];

  //@ts-ignore
  $("div.g").each((_, element) => {
    const title = $(element).find("h3").text();
    const link = $(element).find("a").attr("href");
    const snippet = $(element).find(".VwiC3b").text();

    if (title && link) {
      searchResults.push({ title, link, snippet });
    }
  });

  return searchResults;
}
