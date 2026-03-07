import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';


type PersistMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  config: StateCreator<T, Mps, Mcs>,
  options: PersistOptions<T>,
) => StateCreator<T, Mps, Mcs>


export const createPersistMiddleware: PersistMiddleware = (config, options) => {
  return persist(config, {
    ...options,
    // Storage par défaut : localStorage
    storage: {
      getItem: (name) => {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
      },
      setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: (name) => {
        localStorage.removeItem(name);
      },
    },
  });
};