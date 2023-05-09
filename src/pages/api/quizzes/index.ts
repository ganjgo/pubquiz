import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const question = req.body;
    if (question.quizId && question.questionId) {
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
    } else {
      const { id } = req.query;
      const quiz = await prisma.quizzes.delete({
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json(quiz);
    }
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
  } else if (req.method === "PUT") {
    const quizData = req.body;
    console.log(quizData, "quizData");
    const quiz = await prisma.quizzes.update({
      where: {
        id: Number(quizData.quizId),
      },
      data: {
        name: quizData.quizName,
      },
    });
    return res.status(200).json(quiz);
  }
}
