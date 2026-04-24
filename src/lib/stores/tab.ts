import { writable } from 'svelte/store';

export type TabName = 'today' | 'journey' | 'forecast' | 'input';

const TAB_ORDER: TabName[] = ['today', 'journey', 'forecast', 'input'];

export interface TabState {
  name: TabName;
  direction: -1 | 0 | 1;
}

export const activeTab = writable<TabState>({ name: 'today', direction: 0 });

export function setTab(name: TabName) {
  activeTab.update((cur) => {
    const fromIdx = TAB_ORDER.indexOf(cur.name);
    const toIdx = TAB_ORDER.indexOf(name);
    const direction = fromIdx === toIdx ? 0 : fromIdx < toIdx ? 1 : -1;
    return { name, direction };
  });
}

export function goNeighborTab(delta: 1 | -1) {
  activeTab.update((cur) => {
    const idx = TAB_ORDER.indexOf(cur.name);
    const next = idx + delta;
    if (next < 0 || next >= TAB_ORDER.length) return cur;
    return { name: TAB_ORDER[next], direction: delta };
  });
}

export const TABS: { name: TabName; label: string; jp: string }[] = [
  { name: 'today', label: 'Today', jp: '今' },
  { name: 'journey', label: 'Journey', jp: '道' },
  { name: 'forecast', label: 'Forecast', jp: '先' },
  { name: 'input', label: 'Input', jp: '入力' }
];
