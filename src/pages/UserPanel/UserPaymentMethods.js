import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { Dialog } from '@headlessui/react';
import { CreditCardIcon, PlusCircleIcon, PencilIcon, TrashIcon, ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const UserPaymentMethods = () => {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const user = auth.currentUser;
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const q = query(collection(db, 'users', uid, 'paymentMethods'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCards(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Error fetching payment methods:", err);
      setError("Не удалось загрузить данные карт. Пожалуйста, попробуйте позже.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [uid]);

  const handleOpenForm = (card = null) => {
    setForm(card);
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setForm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      cardHolder: formData.get('cardHolder'),
      cardNumber: formData.get('cardNumber').replace(/\s/g, '').slice(-4), // сохраняем последние 4 цифры
      expiryDate: formData.get('expiryDate'),
      isDefault: formData.get('isDefault') === 'on',
      updatedAt: serverTimestamp(),
    };

    if (form?.id) {
      await updateDoc(doc(db, 'users', uid, 'paymentMethods', form.id), data);
    } else {
      data.createdAt = serverTimestamp();
      const newRef = await addDoc(collection(db, 'users', uid, 'paymentMethods'), data);
      if (data.isDefault) await unsetOtherDefaults(newRef.id);
    }

    if (data.isDefault && form?.id) {
      await unsetOtherDefaults(form.id);
    }

    handleCloseForm();
  };

  const unsetOtherDefaults = async (exceptId) => {
    const batch = writeBatch(db);
    cards.forEach((card) => {
      if (card.id !== exceptId && card.isDefault) {
        const ref = doc(db, 'users', uid, 'paymentMethods', card.id);
        batch.update(ref, { isDefault: false });
      }
    });
    await batch.commit();
  };

  const handleDelete = async (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteCard = async () => {
    if (!confirmDelete) return;
    
    try {
      await deleteDoc(doc(db, 'users', uid, 'paymentMethods', confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting card:", err);
      setError("Не удалось удалить карту. Пожалуйста, попробуйте позже.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Мои карты</h1>
          <p className="text-gray-600 text-sm mt-1">Управляйте своими способами оплаты</p>
        </div>
        <button 
          onClick={() => handleOpenForm()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Добавить карту
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
          <CreditCardIcon className="h-16 w-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">У вас пока нет сохраненных карт</p>
          <button 
            onClick={() => handleOpenForm()} 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Добавить первую карту
          </button>
        </div>
      ) : (
        <>
          <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 mb-4 flex items-start gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-indigo-800">Безопасность платежей</h3>
              <p className="text-sm text-indigo-700 mt-1">
                Мы храним только последние 4 цифры номера вашей карты. Все платежи обрабатываются через защищенное соединение.
              </p>
            </div>
          </div>
          
          <ul className="space-y-4">
            {cards.map((card) => (
              <li key={card.id} className="border p-5 rounded-lg shadow-sm bg-white hover:shadow-md transition duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <CreditCardIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{card.cardHolder}</p>
                      <p className="text-gray-600 text-sm">
                        **** **** **** {card.cardNumber} &nbsp; • &nbsp; {card.expiryDate}
                      </p>
                      {card.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Основная карта
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleOpenForm(card)} 
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition"
                      title="Изменить"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(card.id)} 
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition"
                      title="Удалить"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 text-sm text-gray-500 bg-gray-100 p-4 rounded-md">
            <p>Для изменения основной карты, выберите карту и отметьте опцию "Сделать основной".</p>
          </div>
        </>
      )}

      {/* Existing Dialog for adding/editing cards */}
      <Dialog open={isOpen} onClose={handleCloseForm} className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800">{form?.id ? 'Редактировать карту' : 'Новая карта'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Existing form fields */}
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">Имя владельца</label>
              <input 
                id="cardHolder"
                name="cardHolder" 
                required 
                defaultValue={form?.cardHolder || ''} 
                placeholder="Имя Фамилия" 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Последние 4 цифры карты</label>
              <input 
                id="cardNumber"
                name="cardNumber" 
                required 
                defaultValue={form?.cardNumber || ''} 
                placeholder="1234" 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                maxLength={4} 
              />
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Срок действия</label>
              <input 
                id="expiryDate"
                name="expiryDate" 
                required 
                defaultValue={form?.expiryDate || ''} 
                placeholder="MM/YY" 
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <label className="flex items-center gap-2 text-gray-700">
              <input 
                name="isDefault" 
                type="checkbox" 
                defaultChecked={form?.isDefault}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
              /> 
              Сделать основной
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleCloseForm} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Удалить карту</h2>
          </div>
          <p className="text-gray-600 mb-6">Вы уверены, что хотите удалить эту карту? Это действие нельзя отменить.</p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setConfirmDelete(null)} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button 
              onClick={confirmDeleteCard} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Удалить
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserPaymentMethods;
