import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Item {
    id: string;
    name: string;
    description?: string;
    unitPrice: number;
    taxRate: number; // 5, 12, 18, 28
    hsnCode?: string;
}

interface ItemsState {
    items: Item[];
    addItem: (item: Omit<Item, 'id'>) => void;
    updateItem: (id: string, item: Partial<Item>) => void;
    deleteItem: (id: string) => void;
}

export const useItemsStore = create<ItemsState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) =>
                set((state) => ({
                    items: [...state.items, { ...item, id: uuidv4() }],
                })),
            updateItem: (id, updatedItem) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, ...updatedItem } : item
                    ),
                })),
            deleteItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
        }),
        {
            name: 'invosync-items-storage',
        }
    )
);
