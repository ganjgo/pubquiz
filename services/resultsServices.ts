import axios from "axios";

interface Result {
  id: number;
  quiz: any;
  userAnswers: any[];
  playerName: string;
  resultDate: Date;
}

const resultServices = {
  fetch: async () => {
    const { data } = await axios.get("/api/results");
    return data;
  },
  fetchOne: async (id: number) => {
    const { data } = await axios.get(`/api/results?id=${id}`);
    return data;
  },
  update: async (id: number, playerName: string, quizId: number) => {
    const { data } = await axios.put(`/api/results?id=${id}`, {
      playerName,
      quizId,
    });
    return data;
  },
  create: async (playerName: string, quizId: number) => {
    const { data } = await axios.post("/api/results", {
      playerName,
      quizId,
    });
    return data;
  },
  updateUsername: async (updateResult : any) => {
    console.log(updateResult.username, "username");
    const { data } = await axios.put(`/api/results?id=${updateResult.id}`, {
      updateResult,
    });
    return data;
  },
};

export default resultServices;
