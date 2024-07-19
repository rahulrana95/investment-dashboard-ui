import create from 'zustand';

interface CategoryOption {
    label: string;
    value: string;
}

interface CategoryState {
    selectedCategory: string;
    selectedDifficulty: string;
    selectedCompanyTags: string[];
    categories: CategoryOption[];
    difficulties: CategoryOption[];
    companyTags: CategoryOption[];
    setSelectedCategory: (category: string) => void;
    setSelectedDifficulty: (difficulty: string) => void;
    setSelectedCompanyTags: (tags: string[]) => void;
    setCategories: (categories: CategoryOption[]) => void;
    setDifficulties: (difficulties: CategoryOption[]) => void;
    setCompanyTags: (tags: CategoryOption[]) => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
    selectedCategory: '',
    selectedDifficulty: '',
    selectedCompanyTags: [],
    categories: [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'React', value: 'react' },
        { label: 'System Design', value: 'system_design' },
        { label: 'DSA', value: 'dsa' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'Frontend Theory', value: 'frontend_theory' },
    ],
    difficulties: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Expert', value: 'expert' },
    ],
    companyTags: [
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Amazon', value: 'amazon' },
        { label: 'Netflix', value: 'netflix' },
        { label: 'Microsoft', value: 'microsoft' },
    ],
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
    setSelectedCompanyTags: (tags) => set({ selectedCompanyTags: tags }),
    setCategories: (categories) => set({ categories }),
    setDifficulties: (difficulties) => set({ difficulties }),
    setCompanyTags: (tags) => set({ companyTags: tags }),
}));

export default useCategoryStore;
