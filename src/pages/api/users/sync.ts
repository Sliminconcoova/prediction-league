// /pages/api/user/sync.ts
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must be set in Vercel env vars
);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid user' });

  const { id, email } = user;

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      await prisma.user.create({
        data: {
          id,
          email: email || '',
          //role: 'PLAYER',
        },
      });
    }

    res.status(200).json({ message: 'User synced' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error syncing user' });
  }
}
