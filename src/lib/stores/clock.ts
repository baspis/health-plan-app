import { readable } from 'svelte/store';

export const clock = readable<Date>(new Date(), (set) => {
  const interval = setInterval(() => set(new Date()), 30_000);
  return () => clearInterval(interval);
});
