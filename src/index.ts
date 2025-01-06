import { Elysia } from "elysia";
import * as cheerio from "cheerio";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/home", async () => {
    const res = await fetch("https://cors-get-proxy.sirjosh.workers.dev/?url=https://tv6.idlix.asia/");
    const html = await res.text();

    const $ = cheerio.load(html);
    const movies: any = [];

    // Extract movie data
    $(".item.movies").each((i, el) => {
      const title = $(el).find("h3 a").text();
      const image = $(el).find(".poster img").attr("src");
      const link = $(el).find("h3 a").attr("href");
      const year = title.match(/\((\d{4})\)/)?.[1] || null;
      const rating = parseFloat($(el).find(".rating").text()) || null;

      movies.push({
        title,
        image: image ? (image.startsWith("http") ? image : `https:${image}`) : null,
        link: link ? (link.startsWith("http") ? link : `https:${link}`) : null,
        year: year ? parseInt(year, 10) : null,
        rating,
      });
    });

    return { movies };
  })
  .get("/movie/:link", async (req) => {
    const res = await fetch(`https://cors-get-proxy.sirjosh.workers.dev/?url=${req.params.link}`);
    const html = await res.text();
    console.log(html);

    const $ = cheerio.load(html);

    // Extract movie details
    const title = $("title").text();
    const description = $("meta[property='og:description']").attr("content") || "No description available";
    const poster = $("meta[property='og:image']").attr("content");
    const iframeSrc = $("#dooplay_player_big_content iframe").attr("src");

    const details = {
      title,
      description,
      poster,
      iframe: iframeSrc ? `<iframe src="${iframeSrc}" frameborder="0" allowfullscreen></iframe>` : "No iframe available",
    };

    return details;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
