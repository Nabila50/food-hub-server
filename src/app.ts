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
import { paymentController } from "./modules/payment/payment.controller";
import { paymentRouter } from "./modules/payment/payment.router";


const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_URL! || "http://localhost:3000", //* client side url
    credentials: true,
}))

app.use(express.json());


// app.post("/webhook", express.raw({type: "application/json"}), paymentController.handleStripeWebhookEvent
// )




app.all('/api/auth/*splat', toNodeHandler(auth));



app.use("/menus", menuRouter);

app.use("/menuitems", menuItemRouter)

app.use("/providers", providerRouter);

app.use("/orders", orderRouter);

app.use("/users", userRouter);

app.use("/reviews", reviewRouter);

app.use("/payment", paymentRouter);





app.get("/", (req, res)=>{
    res.status(200).send("Hello World!...API is working");
})

// app.get("/favicon.ico", (req, res) => {
//   res.status(204).end();
// });


export default app;