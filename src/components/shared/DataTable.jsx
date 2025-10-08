import React, { useEffect, useState } from 'react';

export const DataTable = ({ children, getData, withForm = false }) => {
  const [dataCount, setDataCount] = useState(10);
  const [dataPage, setDataPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(getData());

  /**
   * desain dulu, taruh comment di atas berdasarkan desain itu
   * 
   * ini tuh harus jadiin state management
   * popup, alert
   */

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

  useEffect(() => {
    let isMounted = true;
    // make sure to abort fetch when component unmounts
    const abortController = new AbortController();

    (async () => {
      setIsLoading(true);

      try {
        const result = await getData({ offset, limit, keyword, signal: abortController.signal });

        if (isMounted) {
          setData(result);
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
    }
  }, [offset, limit, keyword, getData]);

  return <table>
    <thead>
      {
        columns.map((column, index) => (
          <th key={index} style={{ width: column.width }}>
            {column.label}
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
                getData().map(
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
                data.length < 1 && (
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

    <p>{data.length} data</p>
    <p>current page {dataCount}</p>
    <input type="number" onBlur={e => setDataCount(e.target.value)} />
  </table>;
}

export const DataTableColumn = () => {
  return null; // This component is used only for structure, no rendering needed
}
