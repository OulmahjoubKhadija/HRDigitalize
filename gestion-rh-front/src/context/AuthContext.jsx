import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Only set user if it has a valid id and email
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
  if (!data?.access_token || !data?.user) {
    console.error("Invalid login data:", data);
    return;
  }

  // Ensure salarie_id is present
  const userWithSalarie = {
    ...data.user,
    salarie_id: data.user.salarie_id || null,
  };

  // Save token & user
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(userWithSalarie));

  setUser(userWithSalarie);
};


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
