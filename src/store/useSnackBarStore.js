import { create } from "zustand";

/**
 * 🧩 Global SnackBar Store (Zustand)
 *
 * @description
 * Global store buat manage semua snackbar aktif di aplikasi.
 * Tiap snackbar disimpan sebagai object di array `snackbars`.
 *
 * ---
 * ### State
 * - `snackbars`: `Array<SnackBar>`
 *
 * ### Actions
 * - `notify(snackbar)`:  
 *   Tambah snackbar baru ke list.  
 *   Otomatis generate `id` unik (pakai timestamp).
 *
 * - `remove(snackbarID?)`:  
 *   Kalau dikasih `snackbarID`, hapus snackbar spesifik.  
 *   Kalau nggak dikasih, hapus item pertama (queue behavior).
 *
 * ---
 * ### Struktur snackbar
 * ```ts
 * interface SnackBar {
 *   id: string; // auto generate
 *   type: 'success' | 'failed' | 'warning'; // case-sensitive
 *   title?: string; // optional — kalau nggak ada body, title jadi pesan utama
 *   body?: string;  // optional — detail tambahan
 * }
 * ```
 *
 * ---
 * @example
 * const { snackbars, notify, remove } = useSnackBarStore();
 *
  // Tambah snackbar baru
 * notify({ type: 'success', title: 'Data saved!' });
 *
  // Hapus snackbar tertentu
 * remove('1739843759123');
 *
  // Hapus snackbar paling awal (FIFO)
 * remove();
 */

const useSnackBarStore = create((set) => ({
    /**
     * Array berisi semua snackbar aktif.
     * @type {Array<{ id: string, type: 'success' | 'failed' | 'warning', title?: string, body?: string }>}
     */
    snackbars: [],

    /**
     * Tambah snackbar baru ke list global.
     * @param {{ type: 'success' | 'failed' | 'warning', title?: string, body?: string }} snackbar - Data snackbar baru.
     * @example
     * notify({ type: 'warning', title: 'Low disk space' });
     */
    notify: (snackbar) => {
        snackbar.id = new Date().getTime().toString();

        set(({ snackbars }) => ({
            snackbars: [...snackbars, snackbar],
        }));
    },

    /**
     * Hapus snackbar berdasarkan ID, atau hapus item pertama kalau ID gak dikasih.
     * @param {string} [snackbarID] - ID snackbar yang mau dihapus. Optional.
     * @example
     * remove('1739843759123'); // hapus by ID
     * remove(); // hapus paling awal
     */
    remove: (snackbarID) => {
        if (snackbarID) {
            set(({ snackbars }) => ({
                snackbars: snackbars.filter((s) => s.id !== snackbarID),
            }));
        } else {
            set(({ snackbars }) => ({
                snackbars: [...snackbars.slice(1)],
            }));
        }
    },
}));

export default useSnackBarStore;
