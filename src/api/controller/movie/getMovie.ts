import { createElysia } from "@/libs/elysia";
import * as cheerio from "cheerio";

export default createElysia().get(
  "/",
  async () => {
    const url = await fetch(`${Bun.env.BASE_URL}https://idlix.my/`);
    const html = await url.text();
    const $ = cheerio.load(html);
    const movies: any = [];

    $(".gmr-grid .item-infinite").each((i, el) => {
      const title = $(el).find(".entry-title a").text().trim();
      const image = $(el).find(".content-thumbnail img").attr("src");
      const link = $(el).find(".entry-title a").attr("href");
      const yearMatch = /\((\d{4})\)/.exec(title);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
      const ratingText = $(el).find(".gmr-rating-item").text();
      const rating = ratingText ? parseFloat(ratingText.replace("icon_star", "")) : null;
      const quality = $(el).find(".gmr-quality-item a").text() || null;
      const type = $(el).find(".gmr-posttype-item").text() || null;

      let imageUrl = null;
      if (image && typeof image === 'string') {
        imageUrl = image.startsWith("http") ? image : `https:${image}`;
      }

      let linkUrl = null;
      if (link && typeof link === 'string') {
        linkUrl = link.startsWith("http") ? link : `https:${link}`;
      }

      movies.push({
        title,
        image: imageUrl,
        link: linkUrl,
        year: year ?? null,
        rating,
        quality,
        type,
      });
    });

    return {
      status: 200,
      data: movies,
    };
  },
  {
    detail: {
      tags: ["Movie"],
    },
  }
);