import { createElysia } from "@/libs/elysia";
import * as cheerio from "cheerio";

const createSlug = (title: string, year: number | null, link: string | null): string => {
  if (!link) return '';

  const urlPath = link.split('/').filter(Boolean);
  const existingSlug = urlPath[urlPath.length - 1];

  if (existingSlug) {
    return existingSlug;
  }

  const isSubIndoPattern = link.includes('sub-indo');
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/\(\d{4}\)/g, '')
    .trim();

  if (isSubIndoPattern) {
    return 'nonton-' + baseSlug + (year ? '-' + year : '') + '-sub-indo';
  } else {
    const yearPart = year ? `-${year}` : '';
    return `nonton-film-${baseSlug}${yearPart}-subtitle-indonesia`;
  }
};

export default createElysia().get(
  "/",
  async () => {
    const url = await fetch(`${Bun.env.BASE_URL}https://idlix.my/`);
    const html = await url.text();
    const $ = cheerio.load(html);

    const movies: any[] = [];
    const tvSeries: any[] = [];

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

      const cleanTitle = title.replace(/\(\d{4}\)/, '').trim();
      const slug = createSlug(cleanTitle, year, linkUrl);

      const item = {
        title,
        image: imageUrl,
        link: linkUrl,
        slug,
        year: year ?? null,
        rating,
        quality,
        type,
      };

      if (linkUrl?.includes('sub-indo')) {
        tvSeries.push(item);
      } else if (linkUrl?.includes('subtitle-indonesia')) {
        movies.push(item);
      }
    });

    return {
      status: 200,
      data: {
        movies,
        tvSeries,
      },
    };
  },
  {
    detail: {
      tags: ["Movie", "TV Series"],
    },
  }
);
