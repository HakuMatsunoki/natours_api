import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoose from "mongoose";
// import path from "path";
import morgan from "morgan";
import xss from "xss-clean";

import { serverConfigs } from "./configs";
import { DevStatus, StatusCodes } from "./constants";
import { globalErrorHandler } from "./controllers/errorController";
import { authRouter, tourRouter, userRouter } from "./routes";
import { AppError, requestsLimitMsg, noUrlMsg } from "./utils";

class App {
  private static instance: App;
  public readonly app: express.Application = express();

  private constructor() {
    this.app.enable("trust proxy");
    this.app.use(cors());
    this.app.use(helmet());

    if (serverConfigs.NODE_ENV === DevStatus.DEV) this.app.use(morgan("dev"));

    this.app.use(
      "/api",
      rateLimit({
        max: serverConfigs.RATELIMIT_MAX,
        windowMs: serverConfigs.RATELIMIT_TIME * 60 * 60 * 1000,
        message: requestsLimitMsg(serverConfigs.RATELIMIT_TIME)
      })
    );

    this.app.use(express.json({ limit: serverConfigs.REQUEST_BODY_MAX }));
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: serverConfigs.REQUEST_BODY_MAX
      })
    );
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
    this.mountRoutes();
    this.setupDB();

    this.app.use(globalErrorHandler);
  }

  static getInstance() {
    this.instance = this.instance || new App();

    return this.instance;
  }

  private async setupDB(): Promise<void> {
    // const mongo = await mongoose.connect(serverConfigs.DB);
    // console.log(mongo.connections);
    await mongoose.connect(serverConfigs.DB);

    console.log("MongoDB connection OK");

    mongoose.connection.on("error", (err) => {
      console.log("Mongo error.. ", err);
    });
  }

  private mountRoutes(): void {
    // app.use((req, res, next) => {
    //   req.requestTime = new Date().toISOString();
    //   // console.log(x); //test exception error
    //   // console.log(req.headers);
    //   // console.log(req.cookies);
    //   next();
    // });
    // // 3.ROUTES ============================================
    // app.use('/', viewRouter);

    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/tours", tourRouter);
    this.app.use("/api/v1/users", userRouter);

    // app.use('/api/v1/reviews', reviewRouter);
    // app.use('/api/v1/bookings', bookingRouter);

    this.app.all("*", (req, _res, next) => {
      next(new AppError(noUrlMsg(req.originalUrl), StatusCodes.NOT_FOUND));
    });
  }
}

export default App.getInstance().app;
