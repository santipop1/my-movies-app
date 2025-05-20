import api from "../api";
export const getMovieById = async (id: string) => {
  try {
    const { data } = await api.get(`/movie/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMovieRecommendationsById = async (id: string) => {
  try {
    const { data } = await api.get(`/movie/${id}/recommendations`);
    return data;
  } catch (error) {
    throw error;
  }
};