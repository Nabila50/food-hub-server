import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { providerRouter } from "./modules/provider/provider.router";
import { menuRouter } from "./modules/menu/menu.router";
import cors from 'cors';
import { menuItemRouter } from "./modules/menuItem/menuItem.router";
import { orderRouter } from "./modules/order/order.router";
import { userRouter } from "./modules/user/user.router";
import { reviewRouter } from "./modules/review/review.router";


const app: Application = express();
app.use(express.json());

app.post("/webhook", express.raw({type: "application/json"}), async(req: Request, res: Response)=>{
    console.log("webhook received: ", req.body);
    res.status(200).json({received: true})
})

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
}))

app.all('/api/auth/*splat', toNodeHandler(auth));



app.use("/menus", menuRouter);

app.use("/menuitems", menuItemRouter)

app.use("/providers", providerRouter);

app.use("/orders", orderRouter);

app.use("/users", userRouter);

app.use("/reviews", reviewRouter);



app.get("/", (req, res)=>{
    res.status(200).send("Hello World!...API is working");
})

// app.get("/favicon.ico", (req, res) => {
//   res.status(204).end();
// });


export default app;