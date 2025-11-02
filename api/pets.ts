import { Pet } from "../data/pets";
import apiClient from "./index";

export const getPets = async (): Promise<Pet[]> => {
  const response = await apiClient.get<Pet[]>("/pets");
  return response.data;
};

export const getPetById = async (id: number | string): Promise<Pet> => {
  const response = await apiClient.get<Pet>(`/pets/${id}`);
  return response.data;
};
