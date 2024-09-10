// app/api/activities/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        await dbConnect();

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Failed to save activity', error);
        res.status(500).json({ error: 'Failed to handle POST request' });
    }
}
