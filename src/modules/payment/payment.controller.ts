import {Request, Response} from "express"
import { catchAsync } from "../../shared/catchAsync";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import { paymentService } from "./payment.service";
import { success } from "better-auth";

const handleStripeWebhookEvent = catchAsync(async(req: Request, res: Response)=>{
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

    if(!signature || !webhookSecret){
        console.error("missing stripe signature or webhook secret");
        return res.status(400).json({ message: "missing stripe signature or webhook secret" });
    }

    let event;

    try{
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
    } catch(error: any){

        console.log("Error processing strippe webhook: ", error);
        return res.json({message: "Error processingstripe webhook"})
    }

    try{

        const result = await paymentService.handlerStripeWebhookEvent(event);

        return res.status(200).json({
            success: true,
            message: "Stripe webhook event processed successfully",
            data: result
        })
    }catch (error){

        console.log("error handling stripe webhook event: ", error);
        return res.status(400).json({
            success: false,
            message: "error handling stripe webhook event"
        })
    }
});

// * create payment
const createPayment = catchAsync(async(req,res)=>{

const { orderId } = req.params;

const result = await paymentService.createPayment(orderId as string);

    res.status(200).json(result);

});

export const paymentController = {
    createPayment,
    handleStripeWebhookEvent
}