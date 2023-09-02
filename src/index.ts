import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";
import createApolloGraphQlServer from "./graphql";
const app = express();

async function init() {
  const port = Number(process.env.PORT) || 3000;
  app.use(express.json());

  app.use("/graphql", expressMiddleware(await createApolloGraphQlServer()));
  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
}

init();
