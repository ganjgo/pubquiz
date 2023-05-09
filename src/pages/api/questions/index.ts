import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const questions = await prisma.questions.findMany({
      include: {
        quiz: true,
      },
    });
    return res.status(200).json(questions);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const question = await prisma.questions.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json(question);
  }
}
