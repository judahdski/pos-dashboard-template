import { useSnackBarStore } from "../../store/useSnackBarStore";

import { SnackBarItem } from "./SnackBarItem";

/**
 * SnackBarContainer
 * 
 * - Komponen wrapper buat nampung semua SnackBarItem aktif.
 * - Ambil `snackbars` langsung dari Zustand store.
 * - Render list of <SnackBarItem />.
 * 
 * Catatan:
 *   - Urutan render = urutan muncul di store (atas duluan).
 *   - Bisa di-style sesuai kebutuhan (posisi kanan atas default).
 */

function SnackBarContainer() {
    const snackbars = useSnackBarStore((state) => state.snackbars);

    return (
        <div className="absolute top-0 right-0 w-[320px] bg-amber-100 p-1 flex flex-col gap-2 z-10">
            {snackbars.map((snackbar, index) => <SnackBarItem key={index} {...snackbar} />)}
        </div>
    );
}

export default SnackBarContainer;
