
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Mock users for demonstration
  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@lankanwheels.lk', password: 'admin123', role: 'admin' as const },
    { id: '2', name: 'Kasun Silva', email: 'kasun@lankanwheels.lk', password: 'emp123', role: 'employee' as const },
    { id: '3', name: 'Priya Fernando', email: 'priya@lankanwheels.lk', password: 'emp123', role: 'employee' as const },
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('lankanwheels_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserRole(userData.role);
    }
  }, []);

  const login = (credentials: LoginCredentials): boolean => {
    const foundUser = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      
      setUser(userWithoutPassword);
      setUserRole(foundUser.role);
      localStorage.setItem('lankanwheels_user', JSON.stringify(userWithoutPassword));
      
      // Log activity
      const activity = {
        userId: foundUser.id,
        action: 'LOGIN',
        timestamp: new Date().toISOString(),
        details: `User ${foundUser.name} logged in`
      };
      
      const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
      activities.push(activity);
      localStorage.setItem('user_activities', JSON.stringify(activities));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (user) {
      // Log activity
      const activity = {
        userId: user.id,
        action: 'LOGOUT',
        timestamp: new Date().toISOString(),
        details: `User ${user.name} logged out`
      };
      
      const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
      activities.push(activity);
      localStorage.setItem('user_activities', JSON.stringify(activities));
    }
    
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('lankanwheels_user');
  };

  return {
    user,
    userRole,
    login,
    logout,
    isAuthenticated: !!user
  };
};
