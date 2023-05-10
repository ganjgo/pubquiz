// import { PrismaClient } from "@prisma/client";
// import { NextApiRequest, NextApiResponse } from "next";

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "PUT") {
//     const { updateResult } = req.body;
//     const arrayOfNewUserAnswers = Object.values(updateResult.userAnswers);

//     try {
//       // Step 1: Retrieve the userAnswers from the updateResult object
//       const newAnswers = arrayOfNewUserAnswers.map((answer: any) =>
//         prisma.userAnswer
//           .create({
//             data: {
//               answer: answer.answer,
//               questionData: answer.question,
//               questionId: answer.questionId,
//             },
//           })
//           .then((createdAnswer) => {
//             console.log(
//               `User Answer with id ${createdAnswer.id} created successfully`
//             );
//             return createdAnswer;
//           })
//       );

//       // Step 2: Create new userAnswers in the database
//       const createdUserAnswers = await Promise.all(newAnswers);

//       console.log(createdUserAnswers, "createdUserAnswers");

//       // Step 3: Connect the newly created userAnswers to the existing result
//       // const result = await prisma.results.update({
//       //   where: {
//       //     id: parseInt(updateResult.id as any),
//       //   },
//       //   data: {
//       //     userAnswers: {
//       //       connect: createdUserAnswers.map((answer) => ({ id: answer.id })),
//       //     },
//       //     username: updateResult.username,
//       //   },
//       // });

//       // return res.status(200).json(result);
//     } catch (error) {
//       console.error("Error: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// }


import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { updateResult } = req.body;
    const arrayOfNewUserAnswers = Object.values(updateResult.userAnswers);

    try {
      // Step 1: Retrieve the userAnswers from the updateResult object
      const newAnswers = arrayOfNewUserAnswers.map((answer: any) =>
        prisma.userAnswer
          .create({
            data: {
              answer: answer.answer,
              questionData: answer.question,
              questionId: answer.questionId,
              resultId: Number(answer.resultId),
            },
          })
          .then((createdAnswer) => {
            console.log(
              `User Answer with id ${createdAnswer.id} created successfully`
            );
            return createdAnswer;
          })
      );

      // Step 2: Create new userAnswers in the database
      const createdUserAnswers = await Promise.all(newAnswers);

      console.log(createdUserAnswers, "createdUserAnswers");

    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
