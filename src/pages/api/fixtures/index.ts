import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { homeTeam, awayTeam, matchDate } = req.body;

      if (!homeTeam || !awayTeam || !matchDate) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const fixture = await prisma.fixture.create({
        data: {
          homeTeam,
          awayTeam,
          matchDate: new Date(matchDate),
        },
      });

      return res.status(201).json(fixture);
    } catch (error) {
      console.error("Error creating fixture:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      const fixtures = await prisma.fixture.findMany({
        orderBy: {
          matchDate: "asc",
        },
      });
      return res.status(200).json(fixtures);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

