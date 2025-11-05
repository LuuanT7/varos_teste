import { CreateUser } from "@/lib/api/users/userTypes";
import React, { useEffect, useState } from "react";
import { fetchCep } from "@/lib/api/outsourced/cep";
import Field from "@/components/form/Field";
import useFormValidation, { UserFormValues } from "@/components/form/useFormValidation";
import DeleteUserModal from "@/components/DeleteUserModal";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (user: CreateUser) => void;
}

export const UserCreateModal: React.FC<ModalProps> = ({ open, onClose, onSubmit }) => {
    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [cpf, setCpf] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [complement, setComplement] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [isFetchingCep, setIsFetchingCep] = useState(false);
    const [userType, setUserType] = useState("Consultor");
    const [activeTab, setActiveTab] = useState<"basic" | "clients">("basic");
    const [selectedClient, setSelectedClient] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { errors, touched, setErrors, setTouched, validateForm, handleBlur } = useFormValidation();

    // Lista mock de clientes - pode ser substituído por uma chamada à API
    const clientesList = [
        { id: 1, name: 'Fulano de Tal', email: 'fulano@example.com' },
        { id: 2, name: 'Cicrano de Tal', email: 'cicrano@example.com' },
        { id: 3, name: 'João Silva', email: 'joao@example.com' },
        { id: 4, name: 'Maria Santos', email: 'maria@example.com' },
    ];

    // Controla montagem para permitir animação de entrada/saída
    useEffect(() => {
        if (open) {
            setMounted(true);
            // Próximo tick para garantir aplicação da transição
            const id = requestAnimationFrame(() => setAnimateIn(true));
            return () => cancelAnimationFrame(id);
        } else {
            setAnimateIn(false);
            const timer = setTimeout(() => {
                setMounted(false);
                // Limpa formulário ao fechar
                setName("");
                setEmail("");
                setPhone("");
                setCpf("");
                setAge("");
                setAddress("");
                setComplement("")
                setState("");
                setZipCode("");
                setErrors({});
                setTouched({});
                setActiveTab("basic");
                setSelectedClient("");
            }, 300); // Deve casar com duration-300
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Busca automática de CEP quando completar 8 dígitos
    useEffect(() => {
        const onlyDigits = zipCode.replace(/\D/g, "");
        if (onlyDigits.length !== 8) return;
        let cancelled = false;
        setIsFetchingCep(true);
        fetchCep(onlyDigits)
            .then((data) => {
                if (cancelled || !data) return;
                if (data.uf) setState(data.uf);
                // Monta endereço base: logradouro + bairro + localidade/uf
                const parts = [data.logradouro, data.bairro, data.localidade && data.uf ? `${data.localidade}/${data.uf}` : data.localidade];
                const composed = parts.filter(Boolean).join(" - ");
                if (composed) setAddress(composed);
            })
            .finally(() => !cancelled && setIsFetchingCep(false));
        return () => {
            cancelled = true;
        };
    }, [zipCode]);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const values: UserFormValues = { userType, name, phone, email, age, cpf, zipCode, state, address, complement };
        if (!validateForm(values)) {
            // Marca todos os campos como tocados para mostrar erros
            setTouched({
                userType: true,
                name: true,
                phone: true,
                email: true,
                age: true,
                cpf: true,
                zipCode: true,
                state: true,
                address: true,
                complement: true
            });
            return;
        }
        onSubmit({
            name,
            email,
            phone,
            cpf,
            age,
            address,
            complement,
            state,
            zipCode
        });
    };

    if (!mounted) return null;

    return (
        <div className={`fixed inset-0 z-50 ${animateIn ? 'bg-black bg-opacity-60' : 'bg-black bg-opacity-0'} transition-[background-color,opacity] duration-300 ease-out`} onClick={onClose}>
            <div
                className={`fixed right-0 top-0 h-full bg-[#131313] shadow-lg min-w-[740px] w-full max-w-md border-l border-[#222630] text-white transform transition-[transform,opacity] duration-300 ease-out ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} rounded-l-xl will-change-transform`}
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex items-center justify-end border-b border-gray-700 px-6 py-4">
                    <div className="gap-2 flex">
                        <button
                            type="submit"
                            form="user-create-form"
                            className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 font-normal px-4 py-2 rounded-2xl transition-colors shadow-md"
                        >
                            Criar usuário
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-[#1F2124] hover:bg-[#2a2e38] text-gray-300 font-normal px-4 py-2 rounded-2xl transition-colors shadow-md"
                        >
                            Deletar usuário
                        </button>
                    </div>
                </div>
                <form id="user-create-form" className="flex flex-col gap-6 p-8" onSubmit={handleSubmit}>
                    <h2 className="text-white text-lg font-semibold">Criar usuário</h2>
                    <Field label="Tipo do usuário" required error={errors.userType} touched={touched.userType}>
                        <select
                            value={userType}
                            onChange={(e) => {
                                setUserType(e.target.value);
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.userType;
                                    return newErrors;
                                });
                            }}
                            onBlur={(e) => handleBlur("userType", e.target.value)}
                            className={`w-full bg-[#131516] border ${errors.userType && touched.userType ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                        >
                            <option disabled>Selecione o tipo do usuário</option>
                            <option>Consultor</option>
                            <option>Cliente</option>
                        </select>
                    </Field>
                    <div className="flex gap-4">
                        <Field label="Nome" required error={errors.name} touched={touched.name}>
                            <input
                                type="text"
                                placeholder="Digite o nome"
                                className={`w-full bg-[#131516] border ${errors.name && touched.name ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                value={name}
                                onChange={e => {
                                    setName(e.target.value);
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.name;
                                        return newErrors;
                                    });
                                }}
                                onBlur={(e) => handleBlur("name", e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Telefone" required error={errors.phone} touched={touched.phone}>
                            <input
                                type="text"
                                placeholder="Digite o telefone"
                                className={`w-full bg-[#131516] border ${errors.phone && touched.phone ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                value={phone}
                                onChange={e => {
                                    setPhone(e.target.value);
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.phone;
                                        return newErrors;
                                    });
                                }}
                                onBlur={(e) => handleBlur("phone", e.target.value)}
                                required
                            />
                        </Field>
                    </div>
                    <Field label="Email" required error={errors.email} touched={touched.email}>
                        <input
                            type="email"
                            placeholder="Digite o email"
                            className={`w-full bg-[#131516] border ${errors.email && touched.email ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.email;
                                    return newErrors;
                                });
                            }}
                            onBlur={(e) => handleBlur("email", e.target.value)}
                            required
                        />
                    </Field>
                    <div className="flex items-center gap-6 text-sm">
                        <button
                            type="button"
                            onClick={() => setActiveTab("basic")}
                            className={`relative ${activeTab === "basic" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
                        >
                            Informações básica
                            {activeTab === "basic" && (
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-white"></span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("clients")}
                            className={`relative ${activeTab === "clients" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
                        >
                            Adicionar clientes
                            {activeTab === "clients" && (
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-white"></span>
                            )}
                        </button>
                    </div>

                    <div className="border-b border-[#2a2e38]" />

                    {activeTab === "basic" ? (
                        <>
                            <div className="flex gap-4">
                                <Field label="Idade" required error={errors.age} touched={touched.age}>
                                    <input
                                        type="text"
                                        placeholder="28 anos"
                                        className={`w-full bg-[#131516] border ${errors.age && touched.age ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                        value={age}
                                        onChange={e => {
                                            setAge(e.target.value);
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.age;
                                                return newErrors;
                                            });
                                        }}
                                        onBlur={(e) => handleBlur("age", e.target.value)}
                                        required
                                    />
                                </Field>
                                <Field label="CPF" required error={errors.cpf} touched={touched.cpf}>
                                    <input
                                        type="text"
                                        placeholder="000.000.000-00"
                                        className={`w-full bg-[#131516] border ${errors.cpf && touched.cpf ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                        value={cpf}
                                        onChange={e => {
                                            setCpf(e.target.value);
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.cpf;
                                                return newErrors;
                                            });
                                        }}
                                        onBlur={(e) => handleBlur("cpf", e.target.value)}
                                        required
                                    />
                                </Field>
                            </div>

                            <div className="flex gap-4">
                                <Field label="CEP" required error={errors.zipCode} touched={touched.zipCode}>
                                    <input
                                        type="text"
                                        placeholder="Insira o CEP"
                                        className={`w-full bg-[#131516] border ${errors.zipCode && touched.zipCode ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                        value={zipCode}
                                        onChange={e => {
                                            setZipCode(e.target.value);
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.zipCode;
                                                return newErrors;
                                            });
                                        }}
                                        onBlur={(e) => handleBlur("zipCode", e.target.value)}
                                        required
                                    />
                                    {isFetchingCep && <span className="text-xs text-gray-500 mt-1 block">Buscando CEP...</span>}
                                </Field>
                                <Field label="Estado" required error={errors.state} touched={touched.state}>
                                    <select
                                        value={state}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors.state;
                                                return newErrors;
                                            });
                                        }}
                                        onBlur={(e) => handleBlur("state", e.target.value)}
                                        className={`w-full bg-[#131516] border ${errors.state && touched.state ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                    >
                                        <option disabled>Selecione o estado</option>
                                        <option>SP</option>
                                        <option>RJ</option>
                                        <option>MG</option>
                                        <option>RS</option>
                                    </select>
                                </Field>
                            </div>

                            <Field label="Endereço" required error={errors.address} touched={touched.address}>
                                <input
                                    type="text"
                                    placeholder="Digite o endereço"
                                    className={`w-full bg-[#131516] border ${errors.address && touched.address ? 'border-red-500' : 'border-[#2a2e38]'} text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                    value={address}
                                    onChange={e => {
                                        setAddress(e.target.value);
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.address;
                                            return newErrors;
                                        });
                                    }}
                                    onBlur={(e) => handleBlur("address", e.target.value)}
                                    required
                                />
                            </Field>
                            <Field label="Complemento" error={errors.complement} touched={touched.complement}>
                                <input
                                    type="text"
                                    placeholder="Digite o complemento"
                                    className={`w-full bg-[#131516] border  text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500`}
                                    value={complement}
                                    onChange={e => {
                                        setComplement(e.target.value);

                                    }}
                                />
                            </Field>
                        </>
                    ) : (
                        <Field label="Selecione o cliente" required>
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="w-full bg-[#131516] border border-[#2a2e38] text-[#B0B7BE] px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                            >
                                <option disabled value="">Selecione um cliente</option>
                                {clientesList.map((cliente) => (
                                    <option key={cliente.id} value={cliente.id.toString()}>
                                        {cliente.name} - {cliente.email}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    )}
                </form>
            </div>
            <DeleteUserModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={() => {
                    // Pode adicionar uma callback aqui se necessário
                }}
            />
        </div>
    );
};
