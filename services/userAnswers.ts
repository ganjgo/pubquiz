import axios from "axios";

interface UserAnswer {
  id: number;
  answer: string;
  questionId: number;
  question: any;
  result: any;
  resultId: number;
}

const userAnswersServices = {
    create: async (userAnswers: UserAnswer[]) => {
        const { data } = await axios.post("/api/userAnswers", {
            userAnswers,
        });
        return data;
    }
};

export default userAnswersServices;
