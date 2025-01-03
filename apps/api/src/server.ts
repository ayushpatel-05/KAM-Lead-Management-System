import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser';

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cookieParser())
    .use(cors({
      origin: true,
      // origin: 'http://localhost:5173', // Allow requests from this origin
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],      // Allow only these requests
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Allow only specific headers
      credentials:true
    }))
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  return app;
};
