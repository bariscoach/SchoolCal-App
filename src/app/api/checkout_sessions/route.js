import { auth } from "../../../auth";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            submit_type: 'pay',
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: session.user.email,
            metadata: {
                userId: session.user.id
            },
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: 'SchoolCal Yearly Subscription',
                            description: 'Access to all school calendars, snow day predictions & bus alerts.',
                        },
                        unit_amount: 599, // $5.99
                        recurring: {
                            interval: 'year',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${request.headers.get('origin')}/dashboard?success=true`,
            cancel_url: `${request.headers.get('origin')}/pricing?canceled=true`,
        });

        return new Response(JSON.stringify({ id: checkoutSession.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error("Stripe Checkout Error:", err);
        return new Response(err.message, { status: 500 });
    }
}
