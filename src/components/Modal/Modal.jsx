/**
 * @fileoverview Komponen modal lokal (tidak global).
 * 
 * Beda dengan `ModalContainer` dan `ModalItem`, komponen ini
 * didefinisikan dan dikontrol langsung oleh parent component via prop `open`.
 * Biasanya dipakai buat kebutuhan modal yang tidak perlu global state.
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <Modal open={open} onClose={() => setOpen(false)} size="lg">
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 */

/**
 * Modal lokal yang muncul berdasarkan prop `open`.
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Menentukan apakah modal ditampilkan atau tidak.
 * @param {() => void} props.onClose - Handler untuk menutup modal.
 * @param {"sm" | "md" | "lg"} [props.size] - Ukuran modal (opsional).
 * @param {React.ReactNode} [props.children] - Konten yang ditampilkan di dalam modal.
 * @param {boolean} [props.isLocal=true] - Menandakan modal ini bukan bagian dari global container.
 *
 * @returns {JSX.Element | null} Modal yang ditampilkan saat `open === true`.
 */
const Modal = ({ children, isLocal = true, open, onClose, size }) => {
  return (
    open && (
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-blue-200">
        {children || "do something here"}

        <button
          className="bg-red-400 px-4 py-2 rounded-lg text-white cursor-pointer"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    )
  );
};

export default Modal;
