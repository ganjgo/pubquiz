import axios from "axios";

interface Quiz {
  id: number;
  name: string;
  questions: any[];
  results: any[];
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
  }
};

export default quizServices;
