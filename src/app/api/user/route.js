import { NextResponse } from 'next/server';
import { auth } from '../../../auth'; // Adjust import path !
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req) {
    const session = await auth();

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const userId = session.user.id;

        // Delete related data first (cascade should handle this if defined in schema, but good to be explicit or safe)
        // Schema usually has cascade on Account/Session but maybe not SchoolBoardSubscription

        // 1. Delete Subscriptions
        await prisma.schoolBoardSubscription.deleteMany({
            where: { userId: userId }
        });

        // 2. Delete User (and cascaded Account/Session)
        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
