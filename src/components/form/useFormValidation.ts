import { useState } from "react";

export type UserFormValues = {
    userType: string;
    name: string;
    phone: string;
    email: string;
    age: string;
    cpf: string;
    zipCode: string;
    state: string;
    address: string;
    complement: string;
};

export function useFormValidation() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateField = (fieldName: string, value: string): string => {
        if (!value || value.trim() === "") return `${fieldName} é obrigatório`;
        return "";
    };

    const validateForm = (values: UserFormValues): boolean => {
        const newErrors: Record<string, string> = {};
        if (!values.userType || values.userType === "Selecione o tipo do usuário" || values.userType.trim() === "") newErrors.userType = "Tipo de usuário é obrigatório";
        if (!values.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!values.phone.trim()) newErrors.phone = "Telefone é obrigatório";
        if (!values.email.trim()) newErrors.email = "Email é obrigatório";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = "Email inválido";
        if (!values.age.trim()) newErrors.age = "Idade é obrigatória";
        if (!values.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
        if (!values.zipCode.trim()) newErrors.zipCode = "CEP é obrigatório";
        else if (values.zipCode.replace(/\D/g, "").length !== 8) newErrors.zipCode = "CEP deve ter 8 dígitos";
        if (!values.state || values.state === "Selecione o estado") newErrors.state = "Estado é obrigatório";
        if (!values.address.trim()) newErrors.address = "Endereço é obrigatório";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (fieldName: keyof UserFormValues, value: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));

        if (fieldName === "userType") {
            if (!value || value === "Selecione o tipo do usuário" || value.trim() === "") setErrors(prev => ({ ...prev, userType: "Tipo de usuário é obrigatório" }));
            else setErrors(prev => { const n = { ...prev }; delete n.userType; return n; });
            return;
        }
        if (fieldName === "state") {
            if (!value || value === "Selecione o estado" || value.trim() === "") setErrors(prev => ({ ...prev, state: "Estado é obrigatório" }));
            else setErrors(prev => { const n = { ...prev }; delete n.state; return n; });
            return;
        }
        if (fieldName === "email" && value.trim()) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setErrors(prev => ({ ...prev, email: "Email inválido" })); return; }
        }
        if (fieldName === "zipCode" && value.trim()) {
            if (value.replace(/\D/g, "").length !== 8) { setErrors(prev => ({ ...prev, zipCode: "CEP deve ter 8 dígitos" })); return; }
        }
        const err = validateField(fieldName, value);
        if (err) setErrors(prev => ({ ...prev, [fieldName]: err }));
        else setErrors(prev => { const n = { ...prev }; delete n[fieldName]; return n; });
    };

    return { errors, touched, setErrors, setTouched, validateForm, handleBlur };
}

export default useFormValidation;

