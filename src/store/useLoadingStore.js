import { create } from "zustand";

// biar bisa kayak gini bilang ke chatgpt "buatin JSdoc buat function ini"

/**
 * Global loading state store (Zustand)
 *
 * @description
 * Simple global store for managing a loading state across your app.
 *
 * ✅ Recommended: use `toggleLoading(true/false)` for explicit control.
 *
 * - `toggleLoading(true)`  → start loading
 * - `toggleLoading(false)` → stop loading
 * - `toggleLoading()`      → toggle manually
 *
 * @example
 * const { loading, toggleLoading } = useLoadingStore();
 *
  // Explicit usage (best practice)
 * toggleLoading(true);
 * await fetchData();
 * toggleLoading(false);
 *
  // Manual toggle
 * toggleLoading();
 */

const useLoadingStore = create((set) => ({
    /**
     * Indicates whether the app is currently in a loading state.
     * @type {boolean}
     */
    loading: false,

    /**
     * Sets or toggles the loading state.
     *
     * @param {boolean} [value] - Optional. If provided, sets loading to the given value.
     *                            If omitted, toggles the current state.
     * @example
     * toggleLoading(true);  // sets loading to true
     * toggleLoading(false); // sets loading to false
     * toggleLoading();      // toggles loading (true <-> false)
     */
    toggleLoading: (value) =>
        set((state) => ({
            loading: typeof value === "boolean" ? value : !state.loading,
        })),
}));

export default useLoadingStore;
