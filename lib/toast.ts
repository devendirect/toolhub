/**
 * Notifications courtes (« Copié ! ») sans bibliothèque : un état partagé au
 * niveau du module, affiché par <MiniToaster />. Remplace sonner (~34 Ko sur
 * chaque page) pour les deux seuls messages du site.
 */
export interface ToastMessage { id: number; text: string; kind: "success" | "error" }

let current: ToastMessage | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let nextId = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function show(text: string, kind: ToastMessage["kind"], duration: number) {
  current = { id: ++nextId, text, kind };
  emit();
  clearTimeout(timer);
  timer = setTimeout(() => { current = null; emit(); }, duration);
}

export const toast = {
  success: (text: string, duration = 1200) => show(text, "success", duration),
  error: (text: string, duration = 2500) => show(text, "error", duration),
};

export function subscribeToast(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getToast() {
  return current;
}
