import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { email, name } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

