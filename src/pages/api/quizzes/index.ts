import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;
    const quiz = await prisma.quizzes.delete({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json(quiz);
  } else if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const quiz = await prisma.quizzes.findUnique({
        where: {
          id: parseInt(id as any),
        },
        include: {
          questions: true,
        },
      });
      return res.status(200).json(quiz);
    } else {
      const quizzes = await prisma.quizzes.findMany({
        include: {
          questions: true,
        },
      });
      return res.status(200).json(quizzes);
    }
  }
}
