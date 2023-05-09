import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === "PUT") {
        const question = req.body;
        const quiz = await prisma.quizzes.update({
          where: {
            id: Number(question.quizId),
          },
          data: {
            questions: {
              disconnect: {
                id: question.questionId,
              },
            },
          },
        });
        return res.status(200).json(quiz);
      }
}
