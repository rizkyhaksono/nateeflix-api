import { createElysia } from "@/libs/elysia";
import { getHome } from "./controller/home";
import {
  getMovieDetail,
  getMovieSearch
} from "./controller/movie";
import { getTvSeriesDetail } from "./controller/tv-series";

const apiRoutes = createElysia()
  .group("/home", (api) =>
    api
      .use(getHome)
  )
  .group("/movie", (api) =>
    api
      .use(getMovieDetail)
      .use(getMovieSearch)
  )
  .group("/tv-series", (api) =>
    api
      .use(getTvSeriesDetail)
  );

export default apiRoutes;