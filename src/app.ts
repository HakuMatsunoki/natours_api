import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";

class App {
  public readonly app: express.Application = express();

  constructor() {
    this.app.enable("trust proxy");
    this.app.use(cors());
    this.app.use(helmet());

    if (process.env.NODE_ENV === "development") this.app.use(morgan("dev"));

    this.app.use(
      "/api",
      rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: "Too many requests from this IP, please try again in an hour."
      })
    );

    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10kb" }));
    this.app.use(mongoSanitize());
    this.app.use(xss());

    this.app.use(
      hpp({
        whitelist: [
          "duration",
          "ratingsQuantity",
          "ratingsAverage",
          "maxGroupSize",
          "difficulty",
          "price"
        ]
      })
    );

    this.app.use(compression());
  }
}

export default new App().app;
