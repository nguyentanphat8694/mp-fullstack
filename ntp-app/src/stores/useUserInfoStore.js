import { create } from 'zustand';

const useUserInfoStore = create((set) => ({
  userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null,
  login: (userData) => {
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
    set(() => ({ userInfo: userData }));
  },
  logout: () => {
    sessionStorage.removeItem('userInfo');
    set({ userInfo: null });
  },
}));

export default useUserInfoStore;