import { createElysia } from "@/libs/elysia";
import {
  getMovie,
  getMovieDetail
} from "./controller/movie";

const apiRoutes = createElysia()
  .group("/movie", (api) =>
    api
      .use(getMovie)
      .use(getMovieDetail)
  )

export default apiRoutes;