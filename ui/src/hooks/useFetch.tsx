import { useState, useEffect } from 'react';
import config from '../config';
//const configIndex = process.env.REACT_APP_NODE_ENV ? 1 : 0;
const configIndex = 0;
const apiUrl: string = config[configIndex].apiUrl;

export const useFetch = (urlRoute: string) => {
  const [data, setData] = useState<any>([]);
  const [err, setErr] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
      fetch(apiUrl + urlRoute)
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