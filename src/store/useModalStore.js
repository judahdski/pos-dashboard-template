/**
 * @fileoverview Global modal store menggunakan Zustand.
 * Menyimpan daftar modal global (`modals`) dan menyediakan aksi untuk menambah (`push`) atau menghapus (`remove`) modal.
 *
 * @example
 * import useModalStore from "@/store/useModalStore";
 *
  // Tambah modal baru dari mana pun
 * useModalStore.getState().push({ id: "confirm-delete", title: "Delete item?" });
 *
  // Hapus modal terakhir
 * useModalStore.getState().remove();
 */

import { create } from "zustand";

/**
 * Zustand store untuk mengelola stack modal global.
 *
 * @typedef {Object} Modal
 * @property {string} id - ID unik modal.
 * @property {string} [title] - Judul atau isi singkat modal.
 * @property {any} [props] - Properti tambahan yang bisa dipakai di `ModalItem`.
 *
 * @typedef {Object} ModalStore
 * @property {Modal[]} modals - Daftar semua modal aktif.
 * @property {(modal: Modal) => void} push - Menambahkan modal baru ke stack.
 * @property {(id?: string) => void} remove - Menghapus modal berdasarkan `id` atau, jika kosong, menghapus modal terakhir (LIFO).
 *
 * @type {import("zustand").UseBoundStore<import("zustand").StoreApi<ModalStore>>}
 */
const useModalStore = create((set) => ({
    modals: [],

    push: (modal) =>
        set((state) => ({
            modals: [...state.modals, modal],
        })),

    remove: (id) => {
        if (id) {
            // Hapus modal spesifik berdasarkan ID
            set((state) => ({
                modals: state.modals.filter((modal) => modal.id !== id),
            }));
        } else {
            // Hapus modal terakhir (karena sifatnya stack: LIFO)
            set((state) => ({
                modals: state.modals.slice(0, -1),
            }));
        }
    },
}));

export default useModalStore;
