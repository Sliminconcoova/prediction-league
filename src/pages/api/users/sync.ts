// src/pages/api/users/sync.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client' // ✅ Import Role enum directly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || '',
          role: Role.Player, // ✅ Use enum safely
        },
      })
    }

    return res.status(200).json({ message: 'User synced successfully' })
  } catch (err) {
    console.error('[sync.ts] Error syncing user:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
