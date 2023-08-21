import { useState } from 'react';

function useModal(modalName) {
  const [currentModals, setCurrentModals] = useState({});

  const openModal = () =>
    setCurrentModals({ ...currentModals, ...{ [modalName]: true } });
  const closeModal = () =>
    setCurrentModals({ ...currentModals, ...{ [modalName]: false } });
  const isModalVisible = () => currentModals[modalName] === true;

  return [openModal, closeModal, isModalVisible];
}

export default useModal;
