import React, { useEffect, useMemo, useState } from 'react';
import { GET } from '../../libs/api/httpClient';

/**
 * ## 🧩 Overview

`DataTable` adalah komponen reusable untuk menampilkan data dalam bentuk tabel interaktif.
Berbeda dari tabel statis, komponen ini **tidak menerima data langsung**, tapi **menerima function `fetchData()`** untuk mengambil data (biasanya dari server).
Dirancang supaya fleksibel, scalable, dan cocok untuk kebutuhan dashboard, modul master data, maupun laporan.

---

## ⚙️ Capabilities (Fitur yang Didukung)

| Fitur                     | Deskripsi Singkat                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Dynamic Column**        | Definisi kolom fleksibel via prop `columns`.                                        |
| **Server Data Fetching**  | Ambil data melalui fungsi `fetchData` dengan parameter pagination, filter, sort, dsb. |
| **Sorting**               | Urutkan data per kolom (client/server mode).                                        |
| **Pagination**            | Navigasi antar halaman data (server mode by default).                               |
| **Filtering**             | Filter per kolom (UI) & global search (server).                                     |
| **Row Selection**         | Pilih satu atau beberapa baris data.                                                |
| **Custom Renderer**       | Render cell sesuai kebutuhan (misal badge, tanggal, atau format angka).             |
| **Action Column**         | Slot khusus untuk tombol edit/delete/detail.                                        |
| **Responsive Layout**     | Support horizontal scroll & dynamic width.                                          |
| **Empty & Loading State** | Placeholder atau skeleton ketika data kosong / loading.                             |

---

## 🧠 Props Reference

### 📄 DataTable

| Prop              | Tipe                                                          | Deskripsi                                                |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| `fetchData`         | `({ page, limit, sort, filter }) => Promise<{ data, total }>` | Fungsi async untuk fetch data.                           |
| `columns`         | `Array`                                                       | Definisi kolom (lihat `ColumnDefinition`).               |
| `keyField`        | `string`                                                      | Nama field unik (default: `id`).                         |
| `pageSize`        | `number`                                                      | Jumlah data per halaman (default: `10`).                 |
| `serverPaging`    | `boolean`                                                     | Aktifkan pagination dari server (default: `true`).       |
| `serverSorting`   | `boolean`                                                     | Sorting dilakukan di server.                             |
| `serverFiltering` | `boolean`                                                     | Filtering dilakukan di server.                           |
| `onRowSelect`     | `(rows: any[]) => void`                                       | Callback ketika selection berubah.                       |
| `renderActions`   | `(row) => JSX.Element`                                        | Custom renderer untuk kolom aksi.                        |
| `loading`         | `boolean`                                                     | State loading (otomatis di-handle saat fetch).           |
| `emptyMessage`    | `string`                                                      | Pesan saat data kosong.                                  |
| `emptyRender`     | `() => JSX.Element`                                           | Custom renderer saat data kosong.                        |
| `autoRefresh`     | `boolean`                                                     | Refresh otomatis ketika props berubah (default: `true`). |
| `withForm`        | `boolean`                                                     | Jika true, tambahkan baris form di atas tabel.           |
 */
/**
 * desain dulu, taruh comment di atas berdasarkan desain itu
 * 
 * ini tuh harus jadiin state management
 * popup, alert
 */

export const DataTable = ({
  children,
  fetchData,
  keyField = 'id-data-table',
  pageSize = 10,
  serverLimit = 100,
  serverPaging = true,
  serverSorting = false,
  multipleSort = false,
  serverFiltering = true,
  emptyMessage,
  emptyRender,
  onRowSelect,
  withForm = false,
  renderActions,
}) => {
  const [keyword, setKeyword] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(serverLimit); // default 100, max 10.000, harus kelipatan 10

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [data, setData] = useState([]);

  const [sortFields, setSortFields] = useState([]); // { field: 'name', order: 'asc' }
  const [filterFields, setFilterFields] = useState([]); // { field: 'name', value: 'John' }

  const [currentPage, setCurrentPage] = useState(0);// client-side pagination
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);// client-side pagination, harus kelipatan 10
  const [batchCount, setBatchCount] = useState(1);

  const timeRef = useRef(null);

  const columns =
    React.Children.toArray(children)
      .filter(child => child.type == 'DataTableColumn')
      .map(child => child.props);

  // if withForm is true, we add a form row at the top
  if (withForm) {
    // columns.unshift({
    //   field: 'form',
    //   label: 'Form',
    //   width: '100%',
    // });
  }

  // ini yang berhubungan dengan server side
  useEffect(() => {
    let isMounted = true;
    // make sure to abort fetch when component unmounts
    const abortController = new AbortController();

    (async () => {
      setIsLoading(true);
      if (!isMounted) return;

      try {
        const { data, dataCount } = await fetchData({ offset, limit, keyword, signal: abortController.signal });

        if (dataCount > 0) {
          // jika data ada
          if (batchCount > 1) {
            setCurrentPage(1);
            setItemsPerPage(pageSize);
          }

          if (isMounted) setData(data);
        }
        else {
          // jika data tidak ada
          if (batchCount > 1) {
            return;
          }
          else {
            if (isMounted) throw new Error("Data not found");
          }
        }
      } catch (error) {
        console.error(error);

        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      abortController.abort();
      isMounted = false; // TODO: pikirin lagi ini perlu gasih
      setData([]);
    }
  }, [offset, limit, keyword, batchCount, fetchData]);

  useEffect(() => {
    if (batchCount == 0) return; // ngeskip fetch di first render
    let isMounted = true;
    // make sure to abort fetch when component unmounts
    const abortController = new AbortController();

    (async () => {
      setIsLoading(true);
      if (!isMounted) return;

      try {
        // TODO: narik data lagi, nge set value baru ke datanya kalo ada, kalo gaada ya skip
        const response = await fetchData({ offset, limit, keyword, signal: abortController.signal });
        //ketika click lebih dari jumlah page di awal, tambah lagi total pagenya, simpen data dari 1 batch sebelumnya ke cache, jangan di fetch lagi
        if (response.dataCount < 1) return; // then what
        else {
          setData(response);
          setIsError(false);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      abortController.abort();
      isMounted = false;
      setData([]);
    }
  }, []);

  // buat nyimpen data hasil transformasi dari fetch data atau data yang di sort
  // ini yang berhubungan dengan client side
  const filteredAndsortedData = useMemo(() => {
    if ([filterFields.length, sortFields.length].every(v => v < 1)) return data;

    let filteredData = [...data];

    if (filterFields.length < 1) {
      filteredData = [...data];
    } else {
      filteredData = filterFields.forEach(filterField => {
        const { field, value } = filterField;

        filteredData = filteredData.filter(item => item[field].contains(value));
      });
    }

    let sortedData = [...filteredData];
    filteredData = null; //reset biar ga ada memory leak

    if (sortFields.length < 1) return sortedData; // for make sure sortFields ada isinya
    else {
      // dilooping for handling multiple sort
      sortFields.forEach(element => {
        const { field, order } = element;

        sortedData.sort((a, b) => {
          if (order === 'asc') {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
          } else {
            if (a[field] > b[field]) return -1;
            if (a[field] < b[field]) return 1;
            return 0;
          }
        });

        // TODO: tambahin loading state
        // TODO: pelajari useMemo dan bawahnya

        // ini mekanisme sort yang berat banget
        // karena setiap loop, data di sort ulang
        // jadi misal ada 3 field yang di sort, data akan di sort 3 kali
        // harusnya sih gini, data di sort sekali aja, tapi dengan multiple field
        // tapi aku gak tau gimana caranya
        // jadi yaudah ini aja dulu
      });
    }

    // limit data (pagination)
    let paginatedData = [...sortedData];
    sortedData = null; //reset biar ga ada memory leak

    const { startIndex, endIndex } =
    {
      startIndex: (currentPage - 1) * itemsPerPage,
      endIndex: currentPage * itemsPerPage,
    }

    paginatedData = paginatedData.slice(startIndex, endIndex == paginatedData.length ? paginatedData.length : endIndex);

    return paginatedData;
  }, [data, sortFields, filterFields, currentPage, itemsPerPage]);

  const pageInfo = useMemo(() => {
    return filteredAndsortedData.length / pageSize;
  }, [filteredAndsortedData, pageSize]);

  // ini ngetrigger useEffect yang ngefetch data, karena ini server side
  const searchDataByKeywordHandler = (value) => {
    if (timeRef.current) clearTimeout(timeRef.current);

    timeRef.current = setTimeout(() => {
      setKeyword(value);
    }, 2000);
  };

  // ini ngetrigger useMemo yang ngefilter data, karena ini client side
  const searchDataByFieldHandler = (fieldColumn, value) => {
    const fieldKey = filterFields.findIndex(f => f.field === fieldColumn);
    const field = filterFields[fieldKey]; // { field: 'name', value: 'John' }

    if (field) {
      setFilterFields(prev => prev.splice(fieldKey, 1)); // remove old field
      setFilterFields([...filterFields, { field: fieldColumn, value }]); // add updated field
    } else {
      setFilterFields(prev => [...prev, { field: fieldColumn, value }]);
    }
  }

  const sortDataHandler = (fieldColumn) => {
    if (serverSorting) {
      // server side sorting
      // TODO: implement server sorting
      return;
    }

    if (multipleSort) {
      // handle multiple sorting

      const fieldKey = sortFields.findIndex(f => f.field === fieldColumn);
      const field = sortFields[fieldKey];

      if (field) {
        const order = field.order === 'asc' ? 'desc' : 'asc';

        setSortFields(prev => prev.splice(fieldKey, 1)); // remove old field
        setSortFields([...sortFields, { field: fieldColumn, order }]); // add updated field
      } else {
        setSortFields(prev => [...prev, { field: fieldColumn, order: 'asc' }]);
      }
    } else {
      const fieldKey = sortFields.findIndex(f => f.field === fieldColumn);
      const field = sortFields[fieldKey];

      if (field) {
        const order = field.order === 'asc' ? 'desc' : 'asc';

        setSortFields(prev => prev.splice(fieldKey, 1)); // remove old field
        setSortFields([...sortFields, { field, order }]); // add updated field
      } else {
        if (sortFields.length > 0) setSortFields([]); // reset sort fields for single sort
        setSortFields([{ field, order: 'asc' }]); // add new field
      }
    }
  }

  return <table>
    <input type="text" onChange={(e) => searchDataHandler(e.target.value)} />

    <thead>
      {
        columns.map((column, index) => (
          <th key={index} style={{ width: column.width }} onClick={() => { sortDataHandler(column.field) }}>
            {column.label} <span>==</span>
          </th>
        ))
      }
    </thead>

    <tbody>
      {
        isLoading ?
          (
            <tr>is loading...</tr>
          ) :
          (
            <>
              {
                filteredAndsortedData.map(
                  (row, rowIndex) =>
                  (
                    <tr key={rowIndex}>
                      {
                        columns.map((column, colIndex) => (
                          <td key={`${column.field}-${colIndex}`}>
                            {row[column.field]}
                          </td>
                        ))
                      }
                    </tr>
                  )
                )
              }

              {
                filteredAndsortedData.length < 1 && (
                  <tr>
                    <td colSpan={columns.length}>
                      Tidak ada data
                    </td>
                  </tr>
                )
              }
            </>
          )
      }
    </tbody>

    <p>{filteredAndsortedData.length} data</p>
    <p>current page {currentPage}</p>
    <button onClick={() => {
      setCurrentPage(prev => prev == 1 ? prev : prev - -1);
    }}>prev</button>
    <button onClick={() => {

      setCurrentPage(prev => prev + 1)
    }}>next</button>

    {/* harus kelipatan 10 */}
    <input type="number" onBlur={e => setItemsPerPage(e.target.value)} />
  </table>;
}

/**
 * 
### 📄 ColumnDefinition

| Prop         | Tipe                                 | Deskripsi                                 |
| ------------ | ------------------------------------ | ----------------------------------------- |
| `field`      | `string`                             | Nama properti dari data yang ditampilkan. |
| `label`      | `string`                             | Header kolom.                             |
| `width`      | `string                              | number`                                   |
| `align`      | `'left'                              | 'center'                                  |
| `sortable`   | `boolean`                            | Aktifkan sort di kolom ini.               |
| `filterable` | `boolean`                            | Aktifkan filter di kolom ini.             |
| `formatter`  | `(value, row) => string`             | Format data sebelum tampil.               |
| `render`     | `(value, row, index) => JSX.Element` | Custom renderer cell.                     |
| `style`      | `(row) => object`                    | Custom style tiap row.                    |
| `className`  | `string`                             | CSS class tambahan untuk cell.            |
 */

export const DataTableColumn = () => {
  return null; // This component is used only for structure, no rendering needed
}
