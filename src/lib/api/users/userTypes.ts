export type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    age: string;
    cpf: string;
    zipCode: string;
    state: string;
    address: string;
    complement: string;
    created_at: Date;
    updated_at: Date
};

export type CreateUser = {
    name: string;
    email: string;
    phone: string;
    age: string;
    cpf: string;
    zipCode: string;
    state: string;
    address: string;
    complement: string;
};
