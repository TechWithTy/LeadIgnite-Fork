import type { UserProfile } from "@/types/userProfile";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LeadTypeGlobal } from "@/types/_dashboard/leads";
import type { LeadList } from "@/types/_dashboard/leadList";
import { v4 as uuidv4 } from "uuid";

interface UserProfileState {
	userProfile: UserProfile | null;
	error: string | null;
	setUserProfile: (profile: UserProfile) => void;
	updateUserProfile: (updatedData: Partial<UserProfile>) => void;
	resetUserProfile: () => void;
	addLeadList: (listName: string) => void;
	addLeadToList: (listId: string, lead: LeadTypeGlobal) => void;
}

export const useUserProfileStore = create<UserProfileState>()(
	persist(
		(set) => ({
			userProfile: null,
			error: null,

			setUserProfile: (profile) => {
				set({ userProfile: profile, error: null });
			},

			addLeadList: (listName) =>
				set((state) => {
					if (!state.userProfile?.companyInfo) return state;

					const newList: LeadList = {
						id: uuidv4(),
						listName,
						uploadDate: new Date().toISOString(),
						leads: [],
						records: 0,
						phone: 0,
						dataLink: "",
						socials: {},
						emails: 0,
					};

					const updatedProfile = {
						...state.userProfile,
						companyInfo: {
							...state.userProfile.companyInfo,
							leadLists: [
								...(state.userProfile.companyInfo.leadLists || []),
								newList,
							],
						},
					};

					return { userProfile: updatedProfile };
				}),

			addLeadToList: (listId, lead) =>
				set((state) => {
					if (!state.userProfile?.companyInfo?.leadLists) return state;

					const updatedLists = state.userProfile.companyInfo.leadLists.map(
						(list) => {
							if (list.id === listId) {
								// Avoid adding duplicate leads
								if (list.leads.some((l) => l.id === lead.id)) {
									return list;
								}
								return {
									...list,
									leads: [...list.leads, lead],
									records: list.records + 1,
								};
							}
							return list;
						},
					);

					const updatedProfile = {
						...state.userProfile,
						companyInfo: {
							...state.userProfile.companyInfo,
							leadLists: updatedLists,
						},
					};

					return { userProfile: updatedProfile };
				}),

			updateUserProfile: (updatedData) => {
				set((state) => ({
					userProfile: state.userProfile
						? { ...state.userProfile, ...updatedData }
						: null,
				}));
			},

			resetUserProfile: () => {
				set({ userProfile: null });
			},
		}),
		{
			name: "user-profile-store", // Local storage key
			getStorage: () => localStorage, // Can use sessionStorage instead
		},
	),
);
