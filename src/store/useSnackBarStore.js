import { create } from "zustand";

/**
 * Global SnackBar Store (Zustand)
 *
 * - Nyimpen state global semua snackbar yang lagi aktif.
 * - Tiap snackbar direpresentasikan sebagai object di array `snackbars`.
 *
 * State:
 *   snackbars: Array<SnackBar>
 *
 * Action:
 *   - notify(snackbar):
 *       Tambah snackbar baru ke list.
 *       Otomatis generate `id` unik (timestamp).
 *
 *   - remove(snackbarID):
 *       Kalo dikasih ID → hapus snackbar spesifik.
 *       Kalo gak dikasih → pop item paling awal (queue behavior).
 *
 * Struktur snackbar:
 * {
 *   id: string (auto generate),
 *   type: 'success' | 'failed' | 'warning', // case-sensitive
 *   title?: string,   // optional — kalau gak ada body, title jadi message tunggal
 *   body?: string     // optional — detail tambahan
 * }
 */

const useSnackBarStore = create((set) => ({
    snackbars: [],
    notify: (snackbar) => {
        snackbar.id = new Date().getTime().toString();

        set(({ snackbars }) => ({
            snackbars: [...snackbars, snackbar],
        }));
    },
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
