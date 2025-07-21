import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "GET") {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    try {
      const predictions = await prisma.prediction.findMany({
        where: { userId },
      });
      return res.status(200).json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (method === "POST") {
    const { userId, predictions } = req.body;

    if (!userId || !predictions || !Array.isArray(predictions)) {
      return res.status(400).json({ error: "Missing or invalid userId or predictions array" });
    }

    try {
      const saved = await Promise.all(
        predictions.map(async (prediction: { fixtureId: string; homeScore: number; awayScore: number }) => {
          const { fixtureId, homeScore, awayScore } = prediction;

          return prisma.prediction.upsert({
            where: {
              userId_fixtureId: {
                userId,
                fixtureId,
              },
            },
            update: {
              homeScore,
              awayScore,
            },
            create: {
              userId,
              fixtureId,
              homeScore,
              awayScore,
            },
          });
        })
      );

      return res.status(200).json({ message: "Predictions saved", saved });
    } catch (error) {
      console.error("Error saving predictions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
