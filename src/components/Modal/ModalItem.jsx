/**
 * @fileoverview Komponen individual modal item yang dirender oleh `ModalContainer`.
 * Mewakili satu instance modal global yang tersimpan dalam store Zustand.
 *
 * @example
  // Biasanya tidak digunakan langsung, tapi lewat store:
 * useModalStore.getState().push({ id: 'example', title: 'Hello World' })
 *
  // Tapi kalau mau test manual:
 * <ModalItem id="test" title="My Modal" />
 */

import useModalStore from "../../store/useModalStore";

/**
 * Single modal item dari global modal stack.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.id - ID unik modal (digunakan untuk menghapus modal tertentu).
 * @param {string} [props.title] - Judul atau konten singkat modal.
 * 
 * @returns {JSX.Element} Satu instance modal sederhana dengan tombol untuk menutup.
 *
 * @remarks
 * - `ModalItem` direpresentasikan oleh data yang disimpan di `useModalStore().modals`.
 * - Ketika tombol “Close” ditekan, `remove(id)` dari store dipanggil untuk menghapus modal ini.
 * - Biasanya tidak diimport langsung, tapi di-render otomatis oleh `ModalContainer`.
 */
const ModalItem = ({ id, title }) => {
  const RemoveModal = useModalStore(s => s.remove);

  return (
    <div>
      ModalItem {title}
      <br />
      <button onClick={() => RemoveModal(id)}>Close</button>
    </div>
  );
};

export default ModalItem;
