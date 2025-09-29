Oke, gw rapihin biar lebih rapi, jelas, dan gampang dipahami tim lain. Gw juga tambahin section yang biasanya penting di project modern React. Cek ini:

---

# 🚀 Project Spec

## 🛠️ Tech Stack

* **API Client**: [Axios](https://axios-http.com/) (custom http client + interceptor)
* **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
* **Data Fetching & Caching**: [React Query](https://tanstack.com/query/latest)
* **Styling**: [TailwindCSS](https://tailwindcss.com/)

---

## 📂 Project Structure

```
/src
 ├─ main.jsx              # Entry point
 ├─ libs/
 │   └─ http_client/      # Axios instance + interceptors
 ├─ features/             # App features/modules (per domain/logic)
 │   └─ auth/             # Contoh: fitur auth
 ├─ store/                # Global state (Zustand)
 ├─ components/           # Shared UI components (Button, FormField, etc.)
 ├─ layouts/              # App layouts (auth layout, dashboard layout, etc.)
 └─ pages/                # Page-level views (Login, Dashboard, etc.)
```

**Catatan**

* `// TO-DO` di code = flow bisa diadjust sesuai sistem masing-masing.
* `features/` berisi logic per domain (misal: `auth`, `users`, `products`).
* UI dipisah jadi **pages → layouts → components** biar gampang scaling.

---

## ⚙️ Development

```bash
# install deps
npm install

# run dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

---

## 📌 Guideline

### API Client

* Dikelola di `/src/libs/http_client/`
* Setup Axios instance
* Tambahin **request & response interceptors** (contoh: inject token, handle error global)

### State Management

* Gunakan **Zustand** untuk global state (contoh: user session, theme)
* Store disimpan di `/src/store/`

### Data Fetching

* Gunakan **React Query** buat fetch, cache, dan sync data server
* Query & mutation logic taruh di masing-masing `features/`

### Layouting

* **pages/** → routing level (misal: `/login`, `/dashboard`)
* **layouts/** → wrapper (misal: `AuthLayout`, `DashboardLayout`)
* **components/** → reusable UI (Button, FormField, Table, Modal, dsb.)

---

## ✅ Next Steps / TO-DO

* [ ] Setup Axios instance dengan baseURL & interceptors
* [ ] Buat store global (contoh: `useAuthStore`)
* [ ] Implementasi react-query provider di `main.jsx`
* [ ] Setup basic layout + sample page (misal: login)
* [ ] Tambahin contoh penggunaan `features/`

---

Lo mau gw bikinin juga **contoh folder tree real** (misal udah ada `auth` feature lengkap dengan react-query + store + layout), biar tinggal copy-paste buat fitur lain?
