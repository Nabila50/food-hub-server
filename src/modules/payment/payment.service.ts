import { Stripe } from "stripe";
import { prisma } from "../../lib/prisma";
import { menuItem } from '../../generated/prisma/browser';


const handlerStripeWebhook = async (event: Stripe.Event)=>{
    const existingPayment = await (prisma as any).payment.findFirst({
        where:{
            stripeEventId: event.id
        }
    })

    if(existingPayment){
        console.log(`Event ${event.id} alreadyprocessed.Skipping`);
        return {message: `Event ${event.id} already processed.Skipping`}
    }

    switch(event.type){
        case  "checkout.session.completed": {
            const session = event.data.object 
            const foodId = session.metadata?.menuItemId
            const paymentIntentId =session.payment_intent as string 
        case "checkout.session.expired":
        case "payment_intent.payment_failed":
            default: 
            console.log(`Unhandled event type ${event.type}`);
    }
}