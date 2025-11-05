import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
}

interface DeleteUserModalProps {
    open: boolean;
    onClose: () => void;
    onDelete?: () => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ open, onClose, onDelete }) => {
    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Controla montagem para permitir animação de entrada/saída
    useEffect(() => {
        if (open) {
            setMounted(true);
            const id = requestAnimationFrame(() => setAnimateIn(true));
            fetchUsers();
            return () => cancelAnimationFrame(id);
        } else {
            setAnimateIn(false);
            const timer = setTimeout(() => {
                setMounted(false);
                setUsers([]);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get<User[]>('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            alert('Erro ao carregar lista de usuários');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Tem certeza que deseja deletar o usuário "${name}"?`)) {
            return;
        }

        try {
            setDeletingId(id);
            const response = await axios.delete(`/api/users/${id}`);
            if (response.status >= 200 && response.status < 300) {
                // Remove o usuário da lista localmente
                setUsers(prev => prev.filter(user => user.id !== id));
                if (onDelete) {
                    onDelete();
                }
            }
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            alert('Erro ao deletar usuário');
        } finally {
            setDeletingId(null);
        }
    };

    if (!mounted) return null;

    return (
        <div className={`fixed inset-0 z-50 ${animateIn ? 'bg-black bg-opacity-60' : 'bg-black bg-opacity-0'} transition-[background-color,opacity] duration-300 ease-out`} onClick={onClose}>
            <div
                className={`fixed right-0 top-0 h-full bg-[#131313] shadow-lg min-w-[740px] w-full max-w-md border-l border-[#222630] text-white transform transition-[transform,opacity] duration-300 ease-out ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} rounded-l-xl will-change-transform`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
                    <h2 className="text-white text-lg font-semibold">Deletar usuário</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-xl"
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="text-gray-400">Carregando usuários...</span>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="text-gray-400">Nenhum usuário encontrado</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 bg-[#131516] border border-[#2a2e38] rounded-md hover:border-gray-600 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{user.name}</span>
                                        <span className="text-gray-400 text-sm">{user.email}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(user.id, user.name)}
                                        disabled={deletingId === user.id}
                                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-normal px-4 py-2 rounded-lg transition-colors shadow-md text-sm"
                                    >
                                        {deletingId === user.id ? 'Deletando...' : 'Deletar'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;

