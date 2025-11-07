import axios from "axios";
import { ConsultantsFilters, CreateUser, User } from "./userTypes";

export const fetchFilteredConsultants = async (filter: ConsultantsFilters) => {
  try {
    const res = await axios.get("/api/users", {
      params: {
        name: filter.name, // do seu state
        email: filter.email,
        startDate: (filter.startDate),
        endDate: filter.endDate,
      },
    });
    console.log("✅ Consultores filtrados:", res.data);
    return res.data
  } catch (err) {
    console.error("❌ Erro ao buscar consultores:", err);
  }
};

export const fetchConsultants = async () => {
  try {
    const res = await axios.get("/api/consultants");
    console.log("Consultores:", res.data);
    return res.data
  } catch (error) {
    console.error("Erro ao buscar consultores:", error);
  }
};


export const createUser = async (data: CreateUser) => {
  try {
    const res = await axios.post('/api/users', data);
    return res.data;
  } catch (error) {
    console.error(error);
    return console.error('Erro ao criar usuário');
  }

};