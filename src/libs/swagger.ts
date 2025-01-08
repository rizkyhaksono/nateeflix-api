import swagger from "@elysiajs/swagger";

export const docs = swagger({
  documentation: {
    info: {
      title: "Nateeflix API Documentation",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Home",
        description: "Nateeflix API Documentation"
      },
      {
        name: "Featured",
        description: "Nateeflix API Documentation",
      },
      {
        name: "Movie",
        description: "Nateeflix API Documentation",
      },
      {
        name: "Latest Movies",
        description: "Nateeflix API Documentation",
      },
      {
        name: "Action Movies",
        description: "Nateeflix API Documentation",
      },
      {
        name: "Korean Dramas",
        description: "Nateeflix API Documentation"
      },
      {
        name: "Anime",
        description: "Nateeflix API Documentation"
      },
      {
        name: "TV Series",
        description: "Nateeflix API Documentation"
      },
      {
        name: "Latest Season",
        description: "Nateeflix API Documentation"
      },
      {
        name: "Latest Episodes",
        description: "Nateeflix API Documentation"
      }
    ],
  },
});