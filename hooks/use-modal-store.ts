import { create } from 'zustand'

export type ModalType = "login"

interface ModalData {
    userData?: {
        username: string;
        password: string;
    }
}

interface ModalStore {
    type:ModalType | null;
    isOpen: boolean;
    data:ModalData;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) =>({
    type: null,
    data:{},
    isOpen: false,
    onOpen: (type, data={}) => set({type, isOpen: true, data}),
    onClose: () => set({type: null, isOpen: false}),
}))