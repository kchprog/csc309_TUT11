import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
import app from "./index.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on("error", (err) => {
    console.error(`cannot start server: ${err.message}`);
    process.exit(1);
});