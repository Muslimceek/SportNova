// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import UserDashboard from "../pages/User/UserDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";

const Dashboard = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        }
      }
    };
    fetchRole();
  }, []);

  if (!role) return <p>Загрузка...</p>;

  return role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
