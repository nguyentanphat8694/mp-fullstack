import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Thêm hàm để tính toán viewport width không bao gồm scrollbar
export function getViewportWidth() {
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
}
