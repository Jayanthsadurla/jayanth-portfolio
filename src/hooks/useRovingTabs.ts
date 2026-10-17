import { useCallback, useRef, type KeyboardEvent } from 'react';

/**
 * Keyboard support for a tablist: arrow keys move between tabs, Home/End jump,
 * and only the selected tab is in the tab order (roving tabindex).
 */
export function useRovingTabs<T extends string>(ids: readonly T[], value: T, onChange: (id: T) => void) {
  const refs = useRef<Partial<Record<T, HTMLElement | null>>>({});

  const register = useCallback(
    (id: T) => (el: HTMLElement | null) => {
      refs.current[id] = el;
    },
    [],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const count = ids.length;
    const index = ids.indexOf(value);
    let next = index;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (index + 1) % count;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (index - 1 + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(ids[next]);
    refs.current[ids[next]]?.focus();
  };

  return { register, onKeyDown, tabIndex: (id: T) => (id === value ? 0 : -1) };
}
