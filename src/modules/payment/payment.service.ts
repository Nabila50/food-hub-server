import { Stripe } from "stripe";
import { stripe } from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from '../../generated/prisma/enums';
import events from "events";
import { Payment } from '../../generated/prisma/browser';
import { envVars } from "../../config/env";
 

const handlerStripeWebhookEvent = async (event: Stripe.Event)=>{
    const existingPayment = await (prisma as any).payment.findFirst({
        where: {
            stripeEventId : event.id
        }
    })

    if(existingPayment){
        console.log(`Event ${event.id} already processed.sSkipping`)
        return {message: `Event ${event.id} already processed.Skipping`}
    }

    switch(event.type){
        case "checkout.session.completed" : {
            const session  = event.data.object

            // const appointmentId = session.metadata?.appoinmentId

            const menuItemId = session.metadata?.menuItemId

            const paymentId = session.metadata?.paymentId


            if(!paymentId){
                console.error("Missing paymentId in session meta")
                return { message: "Missing paymentId in session meta" }
            }

        if(!menuItemId){
                console.error("Missing menuItemId in session meta")
                return { message: "Missing menuItemId in session meta" }
            }

            const menuItem = await prisma.menuItem.findUnique({
                where:{
                    id: menuItemId
                }
            })

            if(!menuItem){
                console.error(`menuItem with id ${menuItemId} not found`);
                return { message: `menuItem with id ${menuItemId} not found` };
            }

            await prisma.$transaction(async (tx)=>{
                await tx.payment.update({
                    where: {
                        id: paymentId
                    },
                    data:{
                        stripeEventId : event.id,
                        status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID, 
                        paymentGatewayData: session as any,

                    }
                });
                // await tx.payment.update({
                //     where:{
                //         id: paymentId
                //     },
                //     data:{
                //         stripeEventId: event.id,
                //         status: session.payment_status === "paid"?
                //         PaymentStatus.PAID : PaymentStatus.UNPAID,
                //         paymentGatewayData: session as any,
                //     }
                // })
            })
            console.log(`Processed checkout.session.completed for menuItem $(menuItemId) and payment $(paymentId)`);
            break


        }
        case "checkout.session.expired" : {
            const session = event.data.object
            console.log(`chekout session ${session.id} expired.warking associated payment as failed`);
            break;
        }
        case "payment_intent.payment_failed" : {
            const session = event.data.object

            console.log(`payment intent ${session.id} failed. warking associated payment as failed`);
            break;
        }
            default: 
            console.log(`Unhandled event type ${event.type}`)
    }

    return { message: `Webhook Event ${event.id} processed successfully` }
}

// * create payment
const createPayment = async(orderId:string) => {

    const menuItem = await prisma.menuItem.findUnique({
        where:{
            id: orderId 
        }
    });

    if(!menuItem){
        throw new Error("Menu Item not found");
    }

    const transactionId = crypto.randomUUID();

    const payment = await prisma.payment.create({
        data:{
            amount: Number(menuItem.price),
            transactionId,
            menuItemId: menuItem.id
        }
    });

    const session = await stripe.checkout.sessions.create({

        payment_method_types:["card"],

        mode:"payment",

        line_items:[
            {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name: menuItem.name ?? "Menu Item"
                    },
                    unit_amount:Number(menuItem.price)*100
                },
                quantity:1
            }
        ],

        metadata:{
            menuItemId:menuItem.id,
            paymentId:payment.id
        },

        success_url:`${envVars.FRONTEND_URL}/payment/success`,

        cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
    });

    return {
        payment,
        paymentUrl:session.url
    }
}

export const paymentService = {
     createPayment,
    handlerStripeWebhookEvent
}