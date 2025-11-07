'use client';

import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { createUser, fetchConsultants, fetchFilteredConsultants } from '@/lib/api/users/users';
import logo from '@/assets/logo.png';
import { ConsultantsFilters, CreateUser, User } from '@/lib/api/users/userTypes';
import { UserCreateModal } from '@/components/modal';



export default function DashboardPage() {
  const [name, setName] = useState('');
  const [consultant, setConsultant] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  // console.log("🚀 ~ DashboardPage ~ clients:", clients)
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [startDate, setStartDate] = useState("21/10/2025");
  const [endDate, setEndDate] = useState(" 21/12/2025");

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchConsultants()
      setConsultant(data)
      return data
    }
    fetch()
  }, [])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const clienteMock = [
    {
      id: 1,
      name: 'Fulano de Tal',
      email: 'fulano@example.com',
      phone: '(11) 91234-5678',
      cpf: '123.456.789-09',
      age: 32,
      endereco: 'Rua Exemplo, 123 - Centro, São Paulo/SP',
      criadoEm: '2025-10-21T10:30:00Z',
      atualizadoEm: '2025-10-28T14:15:00Z',
    },
    {
      id: 2,
      name: 'Cicrano de Tal',
      email: 'cicrano@example.com',
      phone: '(11) 91234-5678',
      cpf: '123.456.789-09',
      age: 32,
      endereco: 'Rua Exemplo, 123 - Centro, São Paulo/SP',
      criadoEm: '2025-10-21T10:30:00Z',
      atualizadoEm: '2025-10-28T14:15:00Z',
    }
  ];

  // useEffect(() => {
  //   const fetch = async () => {
  //     const data = await fetchFilteredConsultants({ name, email, startDate, endDate });
  //     console.log("🚀 ~ fetch ~ data:", data)
  //     setClients(data.clients)
  //   }
  //   fetch()

  // }, [name, email, startDate, endDate]);

  const searchHandler = async () => {
    const data = await fetchFilteredConsultants({ name, email, startDate, endDate });
    console.log("🚀 ~ fetch ~ data:", data)
    setClients(data.clients)
  }


  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateUser = async (user: CreateUser) => {
    try {
      // Caso você implementa a API, substitua para o createUser real e recarregue os dados.
      // await createUser(user);
      setIsCreateModalOpen(false);
      // fetchUsers();
      // Para efeito mock/demo, apenas fecha o modal
    } catch (err) {
      alert("Erro ao criar usuário");
    }
  };



  return (
    <div className=' w-full h-full'>
      <header className='flex justify-start items-center p-4 border-spacing-2 border-b border-gray-800'>
        <Image src={logo} alt="Varos App" width={logo.width} height={logo.height} priority />
      </header>

      <div className='p-48'>
        <div >
          <h2 className='text-2xl font-bold text-white'>Dashboard</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between  text-white gap-4 mb-4">
          <div className="flex flex-col justify-center  px-6 py-4  border border-[#222630] min-w-[200px]">
            <span className="text-sm text-gray-400">Total de clientes</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-semibold text-white">128</span>
              <span className="text-green-500 text-lg">↑</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">nos últimos 7 dias</span>
          </div>

          {/* Center - Filters */}
          <div className='gap 4'>
            <div className='w-full flex align-end justify-end py-2'>
              <button className="bg-[#1B3F1B] hover:bg-green-700 text-green-400 font-medium px-6 py-2 rounded-lg transition-colors shadow-md" onClick={handleOpenCreateModal}>
                Criar usuário +
              </button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3  px-6 py-3 rounded-lg border border-[#222630] flex-1">
              <div className="flex flex-row items-center gap-2">
                <label className="text-xs text-gray-400 mb-1">Nome do consultor</label>
                <select
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    searchHandler()
                  }}
                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {
                    consultant?.map((cons) => {
                      return (
                        <option key={cons.id}>{cons?.name}</option>
                      )
                    })
                  }

                </select>
              </div>

              <div className="flex flex-row items-center gap-2">
                <label className="text-xs text-gray-400 mb-1">Email do consultor</label>
                <select
                  value={email}

                  onChange={(e) => {
                    setEmail(e.target.value)
                    searchHandler()
                  }}

                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {
                    consultant?.map((cons) => {
                      return (
                        <option key={cons.id}>{cons?.email}</option>
                      )
                    })
                  }

                </select>
              </div>

              <div className="flex flex-row items-center gap-2">
                <label className="text-xs text-gray-400 mb-1">Período</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    searchHandler()
                  }}
                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    searchHandler()
                  }}
                  className="bg-[#222729] border border-[#2a2e38] text-[#B0B7BE] px-3 py-1 rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Right - Button */}

          </div>

        </div>
        <table className="w-full border-collapse ">
          <thead className='border border-[#222630] '>
            <tr className="text-left text-[#B0B7BE] p-6 ">
              <th className="py-6 px-4">Nome</th>
              <th className="py-6 px-4">Email</th>
              <th className="py-6 px-4">Telefone</th>
              <th className="py-6 px-4">CPF</th>
              <th className="py-6 px-4">Idade</th>
              <th className="py-6 px-4">Endereço</th>
              <th className="py-6 px-4">Criado em</th>
              <th className="py-6 px-4">Atualizado em</th>

            </tr>
          </thead>
          <tbody className='border border-[#222630] bg-[#131516]'>
            {clienteMock.map(u => (
              <tr key={u.id} className="text-left text-[#B0B7BE] border-t border-[#222630] ">
                <td className="px-4 py-6">{u.name}</td>
                <td className="px-4 py-6">{u.email}</td>
                <td className="px-4 py-6">{u.phone}</td>
                <td className="px-4 py-6">{u.cpf}</td>
                <td className="px-4 py-6">{u.age}</td>
                <td className="px-4 py-6">{u.endereco}</td>
                <td className="px-4 py-6">{u.criadoEm}</td>
                <td className="px-4 py-6">{u.atualizadoEm}</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserCreateModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}

