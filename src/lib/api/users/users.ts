import axios from "axios";
import { CreateUser, User } from "./userTypes";

export const fetchUsers = async () => {
    const { data } = await axios.get<User[]>('/api/users');
    console.log(data);
    return data;
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