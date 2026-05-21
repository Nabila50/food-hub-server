import express from "express";
import { menuRouter } from "./modules/menu/menu.controller";

const app = express();

app.use(express.json())

app.get("/", (req, res)=>{
    res.send("hello, world")
})


app.use("/menus", menuRouter);

export default app;