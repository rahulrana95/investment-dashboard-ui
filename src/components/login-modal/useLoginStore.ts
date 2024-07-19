import create from 'zustand';

interface LoginState {
    isLoading: boolean;
    email: string;
    setEmail: (email: string) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => void
}

const useLoginStore = create<LoginState>((set) => ({
    isLoading: false,
    email: '',
    setEmail: (email: string) => set({ email }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    logout: () => {

    }
}));

export default useLoginStore;
