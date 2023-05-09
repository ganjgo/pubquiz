import axios from "axios";

interface Quiz {
  id: number;
  name: string;
  questions: any[];
  results: any[];
}

interface Question {
  quizId: number;
  questionId: number;
}

interface QuizData {
  quizId: number;
  quizName: string;
}

const quizServices = {
  fetch: async () => {
    const { data } = await axios.get("/api/quizzes");
    return data;
  },
  fetchOne: async (id: number) => {
    const { data } = await axios.get(`/api/quizzes?id=${id}`);
    return data;
  },
  remove: async (id: number) => {
    const { data } = await axios.delete(`/api/quizzes?id=${id}`);
    return data;
  },
  connectQuestion: async (question: Question) => {
    const { data } = await axios.put(
      `/api/quizzes/addQuestion?id=${question.quizId}`,
      question
    );
    return data;
  },
  disconnectQuestion: async (question: Question) => {
    const { data } = await axios.put(
      `/api/quizzes/removeQuestion?id=${question.quizId}`,
      question
    );
    return data;
  },
  updateName: async (quizData: QuizData) => {
    const { data } = await axios.put(
      `/api/quizzes?id=${quizData.quizId}`,
      quizData
    );
    return data;
  },
};

export default quizServices;
