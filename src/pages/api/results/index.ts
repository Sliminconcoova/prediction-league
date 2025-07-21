import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { fixtureId, homeScore, awayScore } = req.body;

      if (!fixtureId || homeScore == null || awayScore == null) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Confirm fixture exists
      const fixture = await prisma.fixture.findUnique({
        where: { id: fixtureId },
      });

      if (!fixture) {
        return res.status(404).json({ error: "Fixture not found" });
      }

      // Create result
      const result = await prisma.result.create({
        data: {
          fixtureId,
          homeScore,
          awayScore,
        },
      });

      // Fetch all predictions for this fixture
      const predictions = await prisma.prediction.findMany({
        where: { fixtureId },
      });

      // Calculate points and update each prediction
      const updatePromises = predictions.map(async (prediction) => {
        let points = 0;

        if (prediction.homeScore === homeScore && prediction.awayScore === awayScore) {
          points = 3; // exact match
        } else if (
          (prediction.homeScore > prediction.awayScore && homeScore > awayScore) || // correct win
          (prediction.homeScore < prediction.awayScore && homeScore < awayScore) || // correct loss
          (prediction.homeScore === prediction.awayScore && homeScore === awayScore) // correct draw
        ) {
          points = 1; // correct result
        }

        return prisma.prediction.update({
          where: { id: prediction.id },
          data: { points },
        });
      });

      await Promise.all(updatePromises);

      return res.status(201).json({ result, message: "Result uploaded and predictions updated." });
    } catch (error) {
      console.error("Error uploading result:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

