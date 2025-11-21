import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
    currency: string;
    invoicePrefix: string;
    defaultTaxRate: number;
    paymentTerms: string;
    upiId?: string;
    freelancerName?: string;
}

interface PreferencesState {
    preferences: UserPreferences;
    updatePreferences: (settings: Partial<UserPreferences>) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            preferences: {
                currency: 'INR',
                invoicePrefix: 'INV-',
                defaultTaxRate: 18,
                paymentTerms: 'Due on Receipt',
                upiId: '',
                freelancerName: '',
            },
            updatePreferences: (settings) =>
                set((state) => ({
                    preferences: { ...state.preferences, ...settings },
                })),
        }),
        {
            name: 'invosync-preferences',
        }
    )
);
