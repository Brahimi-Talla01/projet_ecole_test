import { StateCreator } from 'zustand';


export interface UISlice {
  // Theme
      theme: 'light' | 'dark';
      
      // Modals
      isModalOpen: boolean;
      modalContent: React.ReactNode | null;
      
      // Toasts/Notifications
      toast: {
      message: string;
      type: 'success' | 'error' | 'info' | 'warning';
      isVisible: boolean;
      } | null;
      
      // Actions
      setTheme: (theme: 'light' | 'dark') => void;
      toggleTheme: () => void;
      openModal: (content: React.ReactNode) => void;
      closeModal: () => void;
      showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning')  => void;
      hideToast: () => void;
}


export const createUISlice: StateCreator<UISlice> = (set, get) => ({
      // État initial
      theme: 'light',
      isModalOpen: false,
      modalContent: null,
      toast: null,

      // Définir le theme
      setTheme: (theme) =>
            set({
                  theme,
            }),

      // Basculer le theme
      toggleTheme: () => {
            const { theme } = get();
            set({
                  theme: theme === 'light' ? 'dark' : 'light',
            });
      },

      // Ouvrir une modal
      openModal: (content) =>
            set({
                  isModalOpen: true,
                  modalContent: content,
            }),

      // Fermer la modal
      closeModal: () =>
            set({
                  isModalOpen: false,
                  modalContent: null,
            }),

      // Afficher un toast
      showToast: (message, type) =>
            set({
                  toast: {
                  message,
                  type,
                  isVisible: true,
                  },
            }),

      // Masquer le toast
      hideToast: () =>
            set({
                  toast: null,
            }),
});