import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
    console.log("==============> Uncaught exception", err);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });

import app from "./app.js";
import * as configs from "./configs";

// SERVER
const server = app.listen(configs.server.PORT, () => {
    console.log(`App running on port ${configs.server.PORT}...`);
});

process.on("unhandledRejection", (err) => {
    console.log("===========> unhandled rejection", err);

    server.close(() => {
        process.exit(1);
    });
});

// HEROKU
process.on("SIGTERM", (err) => {
    console.log("=======> SIGTERM received, shutting down...", err);
    server.close(() => {
        console.log("=========> process terminated.");
    });
});
