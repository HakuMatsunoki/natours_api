import express from "express";
import mongoose from "mongoose";
// import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";

import { serverConfigs } from "./configs";
import { userRouter } from "./routes";

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
    this.mountRoutes();
    this.setupDB();

    //   this.app.use(globalErrorHandler);
  }

  private async setupDB(): Promise<void> {
    const mongo = await mongoose.connect(serverConfigs.DB);

    console.log(mongo.connections);
    console.log("Connection OK");
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
    // app.use('/api/v1/tours', tourRouter);
    this.app.use("/api/v1/users", userRouter);
    // app.use('/api/v1/reviews', reviewRouter);
    // app.use('/api/v1/bookings', bookingRouter);
    // // Error handling for all methods (get, post, patch, etc...)
    // app.all('*', (req, res, next) => {
    //   // res.status(404).json({
    //   //   status: 'fail',
    //   //   message: `Can't find ${req.originalUrl} on this server..`,
    //   // });
    //   // const err = new Error(`Can't find ${req.originalUrl} on this server..`);
    //   // err.status = 'fail';
    //   // err.statusCode = 404;
    //   next(new AppError(`Can't find ${req.originalUrl} on this server..`, 404));
    // });
  }
}

export default new App().app;
