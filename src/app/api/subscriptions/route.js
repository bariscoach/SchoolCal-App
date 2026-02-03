import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch user subscriptions
export async function GET(req) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const subscriptions = await prisma.schoolBoardSubscription.findMany({
        where: { userId: session.user.id },
        include: { schoolBoard: true }
    });

    return NextResponse.json(subscriptions);
}

// POST: Add Subscription
export async function POST(req) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { boardId } = await req.json();

        const subscription = await prisma.schoolBoardSubscription.create({
            data: {
                userId: session.user.id,
                schoolBoardId: boardId
            }
        });

        return NextResponse.json(subscription);
    } catch (e) {
        // Unique constraint violation P2002 means already subscribed
        if (e.code === 'P2002') return NextResponse.json({ message: "Already subscribed" });
        return new NextResponse("Error", { status: 500 });
    }
}

// DELETE: Remove Subscription
export async function DELETE(req) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { boardId } = await req.json();

        // Find specific record to delete cleanly using deleteMany to match composite key logic if needed
        // Or unique constraint logic. Schema has @@unique([userId, schoolBoardId])
        // Prisma API for compound ID delete is: delete({ where: { userId_schoolBoardId: { ... } } })

        await prisma.schoolBoardSubscription.delete({
            where: {
                userId_schoolBoardId: {
                    userId: session.user.id,
                    schoolBoardId: boardId
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return new NextResponse("Error", { status: 500 });
    }
}
