import { create } from "zustand";

const usePersonal = create((set) => ({
    name: null,
    setPersonName: (name) => set({ name: name }),
}));

export { usePersonal };

/**
 * Questions:
 * 1. kenapa create gabisa dibuat dan dipanggil di dalam component? apa karena component bisa mati?
 * 2. kenapa variable dan setternya gabisa di dalam component? apa karena component bisa mati?
 * 3. state management ini bisa dipakai sama kayak mekanisme get all data di getrows ifinancing ga?
 * 4. Zustand = bisa lintas component/global, useState = lokal di component itu dan turunannya doang?
 */
