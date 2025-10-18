import { useEffect } from "react";

import { useSnackBarStore } from "../../store/useSnackBarStore";

/**
 * SnackBarItem
 * 
 * - Komponen individual buat satu snackbar.
 * - Props auto-dipass dari store:
 *     { id, type, title, body, ... }
 * 
 * Behavior:
 *   - Auto-dismiss setelah 5 detik (setTimeout).
 *   - Bisa ditutup manual lewat tombol close.
 * 
 * Catatan:
 *   - `remove(id)` dipanggil dari store untuk hapus snackbar.
 *   - Bisa dikustom tampilannya sesuai type (icon, warna, dsb).
 */

const SnackBarItem = ({ id, type, title, body, message, action }) => {
  const SnackBarRemove = useSnackBarStore(s => s.remove);

  useEffect(() => {
    setTimeout(() => {
      SnackBarRemove(id);
    }, 5000)
  });

  return (
    <div className="p-2 border rounded-2xl">
      {id}
      <button className="bg-red-100" onClick={() => SnackBarRemove(id)}>XXXXX</button>
    </div>
  );
}

export default SnackBarItem;