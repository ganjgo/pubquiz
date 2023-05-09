import axios from "axios";

interface Question {
  id: number;
  question: string;
  answer: string;
  quizId?: number;
}

const questionServices = {
  fetchAll: async () => {
    const { data } = await axios.get("/api/questions");
    return data;
  },
  remove: async (Question: Question) => {
    console.log("Question", Question);
    const data = await axios
      .delete(`/api/questions?id=${Question.id}`)
      .then((res) => {
        console.log("res", res);
      });
    return JSON.stringify(data);;
  },
};

export default questionServices;
