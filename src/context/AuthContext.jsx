/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_USERS_KEY = "vistalk_users";
const STORAGE_SESSION_KEY = "vistalk_session";

// Demo user seed if no users exist
const INITIAL_USERS = [
  {
    id: "user_demo_1",
    name: "Alex Morgan",
    email: "demo@vistalk.org",
    password: "password123",
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (!storedUsers) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      }

      const activeSession = localStorage.getItem(STORAGE_SESSION_KEY);
      return activeSession ? JSON.parse(activeSession) : null;
    } catch (err) {
      console.error("Error reading authentication session:", err);
      return null;
    }
  });

  const getUsers = () => {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  };

  const login = async (email, password) => {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password. Please try again.");
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    return safeUser;
  };

  const signup = async (name, email, password) => {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    return safeUser;
  };

  const updateProfile = async (newName, newEmail) => {
    if (!currentUser) throw new Error("No active user session.");
    const users = getUsers();
    const normalizedEmail = newEmail.trim().toLowerCase();

    // Check if new email is taken by someone else
    const emailTaken = users.some(
      (u) => u.id !== currentUser.id && u.email.toLowerCase() === normalizedEmail
    );
    if (emailTaken) {
      throw new Error("This email is already in use by another account.");
    }

    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, name: newName.trim(), email: normalizedEmail };
      }
      return u;
    });

    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    const safeUser = {
      ...currentUser,
      name: newName.trim(),
      email: normalizedEmail,
    };
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    return safeUser;
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!currentUser) throw new Error("No active user session.");
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex === -1) throw new Error("User account not found.");

    if (users[userIndex].password && users[userIndex].password !== oldPassword) {
      throw new Error("Incorrect current password.");
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    return true;
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    const users = getUsers();
    const remainingUsers = users.filter((u) => u.id !== currentUser.id);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(remainingUsers));
    logout();
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    signup,
    updateProfile,
    changePassword,
    deleteAccount,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
