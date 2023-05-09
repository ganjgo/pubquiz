import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const result = await prisma.results.findUnique({
        where: {
          id: parseInt(id as any),
        },
        include: {
          quiz: true,
          userAnswers: true,
        },
      });
      return res.status(200).json(result);
    } else {
      const results = await prisma.results.findMany({
        include: {
          quiz: true,
          userAnswers: true,
        },
      });
      return res.status(200).json(results);
    }
  }
}
