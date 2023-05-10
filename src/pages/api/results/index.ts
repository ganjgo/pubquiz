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
          quiz: {
            include: {
              questions: true,
            },
          },
          userAnswers: {
            include: {
              question: true,
            }
          },
        },
      });
      return res.status(200).json(result);
    } else {
      const results = await prisma.results.findMany({
        include: {
          quiz: {
            include: {
              questions: true,
            }
          },
          userAnswers: true,
        },
      });
      return res.status(200).json(results);
    }
  } else if (req.method === "PUT") {
    const dataForUpdate = req.body;
    console.log(dataForUpdate.username, "username");
    if (dataForUpdate.id) {
      const result = await prisma.results.update({
        where: {
          id: parseInt(dataForUpdate.id as any),
        },
        data: {
          username: dataForUpdate.username,
        },
      });
      return res.status(200).json(result);
    }
  } else if (req.method === "POST") {
    const { dataForCreate } = req.body;
    console.log(dataForCreate, "dataForCreate222");
    const result = await prisma.results.create({
      data: {
        playerName: dataForCreate.playerName,
        quiz: {
          connect: {
            id: Number(dataForCreate.quizId),
          },
        },
        quizName: dataForCreate.quizName,
      },
    });
    return res.status(200).json(result);
  }
}
