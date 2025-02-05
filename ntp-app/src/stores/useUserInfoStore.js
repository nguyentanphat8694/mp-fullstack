import { create } from 'zustand';

const useUserInfoStore = create((set) => ({
  userInfo: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')) : null,
  login: (userData) => {
    window.localStorage.setItem('userInfo', JSON.stringify(userData));
    set(() => ({ userInfo: userData }));
  },
  logout: () => {
    window.localStorage.removeItem('userInfo');
    set({ userInfo: null });
  },
}));

export default useUserInfoStore;