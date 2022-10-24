import { useState, useEffect } from 'react';

const baseUrl = 'http://localhost:8080';

export const useFetch = (urlRoute: string) => {
  const [data, setData] = useState<any>([]);
  const [err, setErr] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
      fetch(baseUrl + urlRoute)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Cannot convert response to json');
        }
      })
      .then(json => {
        setData(json)
      })
      .catch(e => setErr(e))
      .finally(() => setLoad(false));
    }, [urlRoute]);

  return { data, setData, err, load };
};