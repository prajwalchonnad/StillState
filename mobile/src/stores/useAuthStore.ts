import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'PARENT' | 'CHILD';

export interface ExtendedUser extends User {
  user_metadata: {
    name?: string;
    role?: UserRole;
    parent_id?: string;
  };
}

interface AuthState {
  session: Session | null;
  user: ExtendedUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  initialized: boolean;
  
  initialize: () => Promise<void>;
  selectRole: (role: UserRole) => void;
  signIn: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  role: null,
  isAuthenticated: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      set({ 
        session, 
        user: session?.user as ExtendedUser || null,
        role: (session?.user?.user_metadata?.role as UserRole) || null,
        isAuthenticated: !!session,
        initialized: true
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          session, 
          user: session?.user as ExtendedUser || null,
          role: (session?.user?.user_metadata?.role as UserRole) || null,
          isAuthenticated: !!session 
        });
      });
    } catch (error) {
      console.error('Error hydrating auth state:', error);
      set({ initialized: true });
    }
  },

  selectRole: (role) => set({ role }),

  signIn: async (email) => {
    // For MVP, we will use a mocked up sign in experience or magic links if email is provided
    // Because we skipped backend and went full Supabase, we can use OTP or magic links
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, role: null, isAuthenticated: false });
  },
}));
