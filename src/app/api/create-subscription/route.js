
import { auth } from "../../../auth";
import { PrismaClient } from "@prisma/client";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const userId = session.user.id;
        const userEmail = session.user.email;

        // 1. Get or Create Stripe Customer
        let user = await prisma.user.findUnique({ where: { id: userId } });
        let customerId = user.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: { userId: userId }
            });
            customerId = customer.id;

            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId: customerId }
            });
        }

        // 2. Create Subscription (Incomplete)
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price_data: {
                    currency: 'cad',
                    product_data: {
                        name: 'SchoolCal Yearly Subscription',
                        description: 'Access to all school calendars & predictions',
                    },
                    unit_amount: 599, // $5.99
                    recurring: { interval: 'year' },
                },
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: { userId: userId }
        });

        // 3. Return Client Secret
        return new Response(JSON.stringify({
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            subscriptionId: subscription.id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Subscription Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
