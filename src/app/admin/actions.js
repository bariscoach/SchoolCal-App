'use server'

import { auth } from '../../auth';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

async function checkAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
}

export async function addEvent(boardId, formData) {
    await checkAdmin();

    const title = formData.get('title');
    const date = formData.get('date');
    const description = formData.get('description');
    const audience = formData.get('audience') || 'ALL';
    const isPaDay = formData.get('isPaDay') === 'on';
    const isHoliday = formData.get('isHoliday') === 'on';

    await prisma.event.create({
        data: {
            title,
            date,
            description,
            audience,
            isPaDay,
            isHoliday,
            schoolBoardId: boardId
        }
    });

    revalidatePath(`/admin/${boardId}`);
    revalidatePath(`/api/calendar/${boardId}`); // Ideally revalidate API too if possible or it's dynamic
}

export async function updateEvent(eventId, boardId, formData) {
    await checkAdmin();

    const title = formData.get('title');
    const date = formData.get('date');
    const description = formData.get('description');
    const audience = formData.get('audience');
    const isPaDay = formData.get('isPaDay') === 'on';
    const isHoliday = formData.get('isHoliday') === 'on';

    await prisma.event.update({
        where: { id: eventId },
        data: {
            title,
            date,
            description,
            audience,
            isPaDay,
            isHoliday
        }
    });

    revalidatePath(`/admin/${boardId}`);
}

export async function deleteEvent(eventId, boardId) {
    await checkAdmin();
    await prisma.event.delete({ where: { id: eventId } });
    revalidatePath(`/admin/${boardId}`);
}
