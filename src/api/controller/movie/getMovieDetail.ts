import { createElysia } from "@/libs/elysia";
import * as cheerio from "cheerio";

export default createElysia()
  .get("/:link", async ({ params }: { params: { link: string } }) => {
    const url = await fetch(
      `https://idlix.my/nonton-film-${params.link}-subtitle-indonesia/`
    );
    const html = await url.text();
    const $ = cheerio.load(html);

    let title = $("h1.entry-title[itemprop='name']").text().trim();
    const description = $("div.desc p").text().trim();
    const poster = $("div.thumb img").attr("src");
    const genres = $("div.genxed a")
      .map((i, el) => $(el).text())
      .get();
    const duration = $("div.info-content meta[property='duration']").attr("content")?.trim();
    const quality = $("div.info-content span:contains('Quality') a").text();
    const year = $("div.info-content span:contains('Year') a").text();
    const country = $("div.info-content span:contains('Country') a").text();
    const director = $("div.info-content span:contains('Director') a").text();
    const cast = $("div.info-content span:contains('Cast') a")
      .map((i, el) => $(el).text())
      .get()
      .join(', ');
    const views = $("div.post-views-count").text()?.trim();
    const update = $("div.info-content span:contains('Updated:') time").attr("datetime")?.trim();
    const ratingValue = $('div.rating strong[itemprop="ratingValue"]').text()?.replace('Rating ', '').trim();
    const ratingCount = $('div.gmr-rating-content.rtp span[itemprop="ratingCount"]').text()?.trim();
    const ratingbar = $('div.gmr-rating-bar span').attr("style")?.trim().replace('width:', '');

    const serverOptions = $(".muvipro-player-tabs li a")
      .map((i, el) => ({
        id: $(el).attr("href")?.replace("#", ""),
        name: $(el).text().trim(),
      }))
      .get();

    const servers: any = {};

    $(".gmr-player-nav ul.muvipro-player-tabs li a").each((index, element) => {
      const serverId = $(element).attr("href")?.replace("#", "");
      if (serverId) {
        servers[serverId] = {
          name: $(element).text().trim(),
          iframe: null,
          filemoon: null,
        };
      }
    });

    $(".tab-content-ajax").each((index, element) => {
      const serverId = $(element).attr("id");
      const iframe = $(element).find("iframe").attr("src");

      if (serverId && servers[serverId]) {
        servers[serverId].iframe = iframe ? `<iframe src="${iframe}" frameborder="0" allowfullscreen></iframe>` : null;
      }
    });

    $(".gmr-download-list li a").each((index, element) => {
      const href = $(element).attr("href");
      if (href?.includes("filemoon.in/download/")) {
        const filemoonId = href.split("/").pop();
        if (filemoonId) {
          const newFilemoonUrl = `https://filemoon.in/e/${filemoonId}`;

          for (const serverId in servers) {
            if (servers[serverId].name.toLowerCase().includes("filelions")) {
              servers[serverId].filemoon = newFilemoonUrl;  // Update the filemoon URL
            }
          }
        }
      }
    });

    const details = {
      title,
      description,
      poster,
      genres,
      duration,
      quality,
      year,
      country,
      director,
      cast,
      views,
      update,
      ratingValue,
      ratingCount,
      ratingbar,
      servers,
      serverOptions,
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
