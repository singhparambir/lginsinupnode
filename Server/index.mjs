import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
const app = express();
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import authRoute from "./Routes/AuthRoute.js";

dotenv.config();

const { MONGO_URL, PORT } = process.env;

console.log("PORT data", PORT)

connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB is  connected successfully"))
    .catch((err) => console.error(err));

app.listen(PORT || 4000, () => {
    console.log(`Server is listening on port ${4000}`);
});

console.log("hello");
app.use(
    cors({
        origin: "http://localhost:3000", // Ensure this matches your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);


app.use(cookieParser());

app.use(json());

app.use("/", authRoute);