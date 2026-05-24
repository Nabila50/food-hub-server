import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { providerRouter } from "./modules/provider/provider.router";
import { menuRouter } from "./modules/menu/menu.router";
import cors from 'cors';


const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}))

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use("/", menuRouter);

app.use("/", providerRouter);



app.get("/", (req, res)=>{
    res.send("hello, world")
})




export default app;