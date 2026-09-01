import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StudentProfile, AuthUser } from '../types';
import { api } from '../services/api';

interface SignUpData {
  name: string;
  email: string;
  password?: string;
  college?: string;
  degree?: string;
  branch?: string;
  passingBatch?: number;
  cgpa?: number;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: StudentProfile | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password?: string) => Promise<AuthUser>;
  signUpWithEmail: (data: SignUpData) => Promise<AuthUser>;
  signInWithGoogle: (emailOverride?: string, nameOverride?: string, avatarUrl?: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<StudentProfile>;
  refreshProfile: () => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'hireready_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved auth session:', e);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveUserSession = (authUser: AuthUser | null) => {
    setUser(authUser);
    if (authUser) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const refreshProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      if (!user && data) {
        // If no user is stored, initialize session from current profile
        const initialUser: AuthUser = {
          id: data.id || 'usr_current',
          name: data.name || 'Student Candidate',
          email: data.email || 'student@campus.edu',
          avatarUrl: data.avatarUrl,
          authProvider: 'demo',
          isVerified: true,
          college: data.college,
          branch: data.branch,
          passingBatch: data.passingBatch,
          cgpa: data.cgpa
        };
        saveUserSession(initialUser);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const signInWithEmail = async (email: string, _password?: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const existingProfile = profile || await api.getProfile();
      const isRohan = email.toLowerCase().includes('rohan');
      const name = isRohan ? 'Rohan Sharma' : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      const authUser: AuthUser = {
        id: 'usr_' + Date.now(),
        name: name,
        email: email.trim(),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        authProvider: 'password',
        isVerified: true,
        college: existingProfile?.college || 'National Institute of Technology',
        branch: existingProfile?.branch || 'Computer Science and Engineering',
        passingBatch: existingProfile?.passingBatch || 2027,
        cgpa: existingProfile?.cgpa || 8.5
      };

      const updated = await api.updateProfile({
        name: authUser.name,
        email: authUser.email,
        avatarUrl: authUser.avatarUrl
      });
      setProfile(updated);
      saveUserSession(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (data: SignUpData): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const authUser: AuthUser = {
        id: 'usr_' + Date.now(),
        name: data.name.trim(),
        email: data.email.trim(),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
        authProvider: 'password',
        isVerified: true,
        college: data.college || 'National Institute of Technology',
        branch: data.branch || 'Computer Science and Engineering',
        passingBatch: data.passingBatch || 2027,
        cgpa: data.cgpa || 8.5
      };

      const updated = await api.updateProfile({
        name: authUser.name,
        email: authUser.email,
        phone: data.phone || '+91 98765 43210',
        college: authUser.college,
        degree: data.degree || 'B.Tech',
        branch: authUser.branch,
        passingBatch: authUser.passingBatch,
        cgpa: authUser.cgpa,
        avatarUrl: authUser.avatarUrl
      });

      setProfile(updated);
      saveUserSession(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (
    emailOverride?: string,
    nameOverride?: string,
    avatarUrl?: string
  ): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const email = (emailOverride || 'vikash607877@gmail.com').trim();
      const name = nameOverride || (email.startsWith('vikash') ? 'Vikash' : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      const avatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

      const authUser: AuthUser = {
        id: 'usr_g_' + Date.now(),
        name: name,
        email: email,
        avatarUrl: avatar,
        authProvider: 'google',
        isVerified: true,
        college: profile?.college || 'National Institute of Technology',
        branch: profile?.branch || 'Computer Science and Engineering',
        passingBatch: profile?.passingBatch || 2027,
        cgpa: profile?.cgpa || 8.64
      };

      const updated = await api.updateProfile({
        name: authUser.name,
        email: authUser.email,
        avatarUrl: authUser.avatarUrl
      });

      setProfile(updated);
      saveUserSession(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    saveUserSession(null);
  };

  const updateProfile = async (updates: Partial<StudentProfile>) => {
    const updated = await api.updateProfile(updates);
    setProfile(updated);
    if (user) {
      const updatedUser: AuthUser = {
        ...user,
        name: updated.name || user.name,
        email: updated.email || user.email,
        college: updated.college || user.college,
        branch: updated.branch || user.branch,
        passingBatch: updated.passingBatch || user.passingBatch,
        cgpa: updated.cgpa || user.cgpa,
        avatarUrl: updated.avatarUrl || user.avatarUrl
      };
      saveUserSession(updatedUser);
    }
    return updated;
  };

  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      await api.resetDemo();
      const defaultProfile = await api.getProfile();
      setProfile(defaultProfile);
      const demoUser: AuthUser = {
        id: defaultProfile.id,
        name: defaultProfile.name,
        email: defaultProfile.email,
        avatarUrl: defaultProfile.avatarUrl,
        authProvider: 'demo',
        isVerified: true,
        college: defaultProfile.college,
        branch: defaultProfile.branch,
        passingBatch: defaultProfile.passingBatch,
        cgpa: defaultProfile.cgpa
      };
      saveUserSession(demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile,
        resetDemoData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
