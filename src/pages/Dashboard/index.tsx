import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { alertSwalSuccess, alertSwalError } from '../../helpers/alerts';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    loadFoods();
  }, [setFoods]);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
      alertSwalSuccess(`Prato ${food.name} adicionado com sucesso!`);
    } catch (error) {
      alertSwalError(`Erro! ${error.message}`);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });
      setFoods(
        foods.map(foodMap =>
          foodMap.id === editingFood.id ? { ...response.data } : foodMap,
        ),
      );
      alertSwalSuccess(`Prato ${food.name} editado com sucesso!`);
    } catch (error) {
      alertSwalError(`Erro! ${error.message}`);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    Swal.fire({
      title: 'Você tem certeza que deseja excluir?',
      text: 'Se excluir, não poderá recuperar este prato',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, quero excluir!',
      cancelButtonText: 'Não, voltar!',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        await api.delete(`/foods/${id}`);
        setFoods(foods.filter(foodMap => foodMap.id !== id));
        Swal.fire('Prato excluído!', '', 'error');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Não excluído', 'Seu registro está salvo 😉', 'success');
      }
    });
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
