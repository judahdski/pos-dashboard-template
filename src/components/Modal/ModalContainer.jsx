/**
 * @fileoverview Global modal container component.
 * Menampung dan me-render seluruh modal global yang disimpan di Zustand store (`useModalStore`).
 * Komponen ini berfungsi sebagai root-level container untuk semua modal global
 * yang bisa ditrigger dari mana pun di dalam app (bukan dari satu component saja).
 *
 * @example
  // Biasanya ditempatkan di level tertinggi, misalnya di _app.js atau Layout utama:
 * <AppLayout>
 *   <MainContent />
 *   <ModalContainer />
 * </AppLayout>
 *
  // Tambah modal dari mana pun:
 * useModalStore.getState().push({ id: 'confirm-logout', title: 'Confirm Logout' })
 */

import useModalStore from "../../store/useModalStore";

import ModalItem from "./ModalItem";

/**
 * Global modal container.
 * Me-render semua item modal yang tersimpan di Zustand store (`modals` array).
 * 
 * @component
 * @returns {JSX.Element} Wrapper yang berisi daftar <ModalItem /> aktif.
 *
 * @remarks
 * - `ModalContainer` berfungsi sebagai penampung global modal yang tidak terikat pada virtual DOM lokal.
 * - Modal baru bisa didorong (`push`) ke store kapan pun melalui fungsi global, tanpa perlu ada state di komponen tertentu.
 * - Ini berbeda dengan komponen `Modal` yang bersifat lokal dan tergantung pada prop `open`.
 */

const ModalContainer = () => {
  const modals = useModalStore((state) => state.modals);

  return (
    <div
      className={`absolute top-0 left-0 right-0 bg-amber-100 ${modals.length > 0 ? "bottom-0" : ""}`}
    >
      {modals.map((modal, index) => (
        <ModalItem key={`${modal.id}-${index}`} {...modal} />
      ))}
    </div>
  );
};

export default ModalContainer;
