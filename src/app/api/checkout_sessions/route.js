
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build');

export async function POST(request) {
    try {
        const session = await stripe.checkout.sessions.create({
            submit_type: 'pay',
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: 'SchoolCal Yearly Subscription',
                            description: 'Access to all school calendars',
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
            cancel_url: `${request.headers.get('origin')}/?canceled=true`,
        });

        return new Response(JSON.stringify({ id: session.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(err.message, { status: 500 });
    }
}
