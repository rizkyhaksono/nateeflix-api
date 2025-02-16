import { createElysia } from "@/libs/elysia";
import * as cheerio from "cheerio";

export default createElysia()
  .get("/:link", async ({ params }: { params: { link: string } }) => {
    const { link } = params;
    let url: string;
    let isTvSeries = false;

    if (link.includes("nonton") && link.includes("sub-indo")) {
      isTvSeries = true;
      url = `https://idlix.my/${link}`;
    } else if (link.includes("nonton-film") && link.includes("subtitle-indonesia")) {
      url = `https://idlix.my/${link}`;
    } else {
      return {
        status: 400,
        message: "Invalid link format.",
      };
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    if (isTvSeries) {
      const episodes: any[] = [];
      $(".eplister ul li").each((_, el) => {
        const episodeNumber = $(el).find(".epl-num").text().trim();
        const episodeTitle = $(el).find(".epl-title").text().trim();
        const releaseDate = $(el).find(".epl-date").text().trim();
        const episodeLink = $(el).find("a").attr("href");

        episodes.push({
          episodeNumber,
          episodeTitle,
          releaseDate,
          link: episodeLink?.startsWith("http") ? episodeLink : `https:${episodeLink}`,
        });
      });

      const details = {
        title: $("h1.entry-title[itemprop='name']").text().trim(),
        description: $(".desc p").text().trim(),
        poster: $("div.thumbook img").attr("src"),
        genres: $(".genxed a").map((i, el) => $(el).text().trim()).get(),
        year: $("div.info-content span:contains('Year') a").text().trim(),
        network: $("div.info-content span:contains('Network') a").text().trim(),
        episodes,
      };

      return {
        status: 200,
        data: { type: "TV Series", ...details },
      };
    }

    let streaming: string | null = null;

    $('.gmr-download-list li a').each((_, element) => {
      const href = $(element).attr('href');
      if (href?.includes('filemoon.in/download/')) {
        const filemoonId = href.split('/').pop();
        if (filemoonId) {
          streaming = `https://filemoon.in/e/${filemoonId}`;
        }
      }
    });

    const details = {
      title: $(".breadcrumb_last").first().text().trim(),
      description: $("div.desc p").text().trim(),
      poster: $("div.thumb img").attr("src"),
      genres: $("div.genxed a").map((i, el) => $(el).text()).get(),
      duration: $("div.info-content meta[property='duration']").attr("content")?.trim(),
      quality: $("div.info-content span:contains('Quality') a").text(),
      year: $("div.info-content span:contains('Year') a").text(),
      country: $("div.info-content span:contains('Country') a").text(),
      director: $("div.info-content span:contains('Director') a").text(),
      cast: $("div.info-content span:contains('Cast') a").map((i, el) => $(el).text()).get().join(', '),
      views: $("div.post-views-count").text()?.trim(),
      update: $("div.info-content span:contains('Updated:') time").attr("datetime")?.trim(),
      ratingValue: $('div.rating strong[itemprop="ratingValue"]').text()?.replace('Rating ', '').trim(),
      ratingCount: $('div.gmr-rating-content.rtp span[itemprop="ratingCount"]').text()?.trim(),
      ratingbar: $('div.gmr-rating-bar span').attr("style")?.trim().replace('width:', ''),
      streaming,
    };

    return {
      status: 200,
      data: details,
    };
  }, {
    detail: {
      tags: ["Movie"],
    },
  });