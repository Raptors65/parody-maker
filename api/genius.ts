import * as cheerio from "cheerio";

interface GeniusItem {
  api_path: string;
  header_image_url: string;
  id: number;
  url: string;
  iq: number;
}

interface Artist extends GeniusItem {
  image_url: string;
  is_meme_verified: boolean;
  is_verified: boolean;
  name: string;
}

export interface Result extends GeniusItem {
  annotation_count: number;
  artist_names: string;
  full_title: string;
  header_image_thumbnail_url: string;
  lyrics_owner_id: number;
  lyrics_state: string;
  path: string;
  pyongs_count: number;
  relationships_index_url: string;
  release_date_components: { year: number; month: number; day: number };
  release_date_for_display: string;
  song_art_image_thumbnail_url: string;
  song_art_image_url: string;
  stats: {
    unreviewed_annotations: number;
    concurrents: number;
    hot: boolean;
    pageviews: number;
  };
  title: string;
  title_with_featured: string;
  featured_artists: Artist[];
  primary_artist: Artist;
}

interface Hit {
  highlights: any[];
  index: string;
  type: string;
  result: Result;
}

/**
 * Searches for songs using the Genius API.
 * @param {string} q - The search query.
 * @return {Promise<Result[]>} A Promise that resolves to an array of results.
 */
export async function searchSongs(q: string): Promise<Result[]> {
  const apiResponse = await fetch(
    `https://api.genius.com/search?q=${encodeURIComponent(q)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLIENT_ACCESS}`,
      },
    }
  );
  const apiData = await apiResponse.json();
  if (apiData.meta.status !== 200) {
    return [];
  }

  const results = apiData.response.hits
    .map((hit: Hit) => hit.result)
    .filter((result: Result) => result.path.endsWith("-lyrics"));
  return results;
}

/**
 * Gets the lyrics of a specific song.
 * @param {string} urlID - The URL path, excluding "-lyrics" at the end.
 * @return {Promise<string>} A Promise that resolves to a string of the lyrics.
 */
export async function getLyrics(urlID: string): Promise<string> {
  const response = await fetch(`https://genius.com/${urlID}-lyrics`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(await response.text());
  const selectors: (() => string | undefined)[] = [
    () => $(".lyrics").text().trim(),
    () =>
      $("div[class*='Lyrics__Container']")
        .toArray()
        .map((x) => {
          const ele = $(x);
          ele.find("br").replaceWith("\n");
          return ele.text();
        })
        .join("\n")
        .trim(),
  ];

  for (const x of selectors) {
    const lyrics = x();
    if (lyrics?.length) {
      return lyrics;
    }
  }

  return "";
}
