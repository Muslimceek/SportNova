// src/components/UserAddresses.js
import React, { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { db, auth } from "../../firebaseConfig";
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
} from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const TextField = ({ name, placeholder, defaultValue = "", required = true }) => (
  <input
    name={name}
    defaultValue={defaultValue}
    required={required}
    placeholder={placeholder}
    aria-label={name}
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm placeholder-gray-400"
  />
);

const AddressForm = ({ isOpen, onClose, initialData, onSubmit }) => {
  const formRef = useRef(null);
  useEffect(() => {
    if (isOpen)
      formRef.current?.querySelector("input")?.focus();
  }, [isOpen]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    formData.isDefault = formData.isDefault === "on" || formData.isDefault === true;
    onSubmit(formData);
    onClose();
  };

  return (
    <Transition appear show={isOpen}>
      <Dialog
        onClose={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
        >
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 transform">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {initialData?.id ? "Редактировать адрес" : "Добавить адрес"}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {[
                { name: "fullName", placeholder: "Полное имя", required: true },
                { name: "phone", placeholder: "Номер телефона", required: true },
                {
                  name: "streetAddress",
                  placeholder: "Улица, дом, квартира",
                  required: true,
                },
                { name: "city", placeholder: "Город", required: true },
                {
                  name: "postalCode",
                  placeholder: "Почтовый индекс",
                  required: false,
                },
                { name: "country", placeholder: "Страна", required: false },
              ].map((field) => (
                <TextField
                  key={field.name}
                  {...field}
                  defaultValue={initialData?.[field.name] || ""}
                />
              ))}
              <label className="flex items-center gap-2">
                <input
                  name="isDefault"
                  type="checkbox"
                  defaultChecked={initialData?.isDefault || false}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Сделать адрес основным
                </span>
              </label>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

const AddressItem = ({ address, onEdit, onDelete }) => (
  <li className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
    {address.isDefault && (
      <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <HomeIcon className="w-4 h-4" /> Основной
      </span>
    )}
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900">
        {address.fullName}
      </h3>
      <p className="text-gray-600">{address.phone}</p>
      <p className="text-gray-500 text-sm">
        {[address.streetAddress, address.city, address.postalCode, address.country]
          .filter(Boolean)
          .join(", ")}
      </p>
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onEdit(address)}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          aria-label="Редактировать адрес"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          aria-label="Удалить адрес"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  </li>
);

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [formState, setFormState] = useState({ isOpen: false, data: null });
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const addressesRef = useMemo(
    () => (user?.uid ? collection(db, "users", user.uid, "addresses") : null),
    [user?.uid]
  );

  // Функция для снятия флага "основной адрес" у остальных адресов
  const unsetOtherDefaults = useCallback(async (exId) => {
    if (!addressesRef) return;
    const batch = writeBatch(db);
    addresses.forEach(
      ({ id, isDefault }) =>
        id !== exId &&
        isDefault &&
        batch.update(doc(addressesRef, id), { isDefault: false })
    );
    await batch.commit();
  }, [addresses, addressesRef]);

  // Подписка на изменения адресов с использованием onSnapshot
  useEffect(() => {
    if (!addressesRef) return;
    const unsub = onSnapshot(query(addressesRef, orderBy("createdAt", "desc")), (snapshot) => {
      setAddresses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsub;
  }, [addressesRef]);

  // Обработка отправки формы добавления/редактирования адреса
  const handleFormSubmit = async (formData) => {
    try {
      const ts = serverTimestamp();
      const addressData = { ...formData, updatedAt: ts };
      if (formState.data?.id) {
        // Обновление существующего адреса
        await updateDoc(doc(addressesRef, formState.data.id), addressData);
        if (formData.isDefault) {
          await unsetOtherDefaults(formState.data.id);
        }
      } else {
        // Добавление нового адреса
        addressData.createdAt = ts;
        const newRef = await addDoc(addressesRef, addressData);
        if (formData.isDefault) {
          await unsetOtherDefaults(newRef.id);
        }
      }
    } catch (err) {
      console.error("Ошибка обновления адреса:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить этот адрес?")) {
      try {
        await deleteDoc(doc(addressesRef, id));
      } catch (err) {
        console.error("Ошибка удаления:", err);
      }
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6 sm:p-8">
      <section className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Ваши адреса
        </h1>
        <button
          onClick={() => setFormState({ isOpen: true, data: null })}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <PlusIcon className="w-5 h-5" /> Добавить адрес
        </button>
      </section>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-pulse text-gray-500 text-lg">Загрузка...</div>
        </div>
      ) : addresses.length === 0 ? (
        <section className="text-center py-16 bg-gray-50 rounded-2xl shadow-sm">
          <HomeIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Адреса отсутствуют
          </h3>
          <p className="text-gray-600 mb-6">
            Добавьте адрес для упрощения оформления заказа.
          </p>
          <button
            onClick={() => setFormState({ isOpen: true, data: null })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <PlusIcon className="w-5 h-5" /> Добавить адрес
          </button>
        </section>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((addr) => (
            <AddressItem
              key={addr.id}
              address={addr}
              onEdit={(data) => setFormState({ isOpen: true, data })}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
      <AddressForm
        isOpen={formState.isOpen}
        onClose={() =>
          setFormState((prevState) => ({ ...prevState, isOpen: false }))
        }
        initialData={formState.data}
        onSubmit={handleFormSubmit}
      />
    </main>
  );
};

export default UserAddresses;
