import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Aggregate total points per user
      const leaderboard = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          predictions: {
            select: {
              //points: true,
            },
          },
        },
      });

      // Calculate total points per user
      const formatted = leaderboard.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalPoints: user.predictions.reduce((sum, p) => sum + p.points, 0),
      }));

      // Sort descending by totalPoints
      formatted.sort((a, b) => b.totalPoints - a.totalPoints);

      return res.status(200).json(formatted);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

