import { CollectionReference, getCountFromServer } from "firebase/firestore";
import { useState, useEffect } from "react";

// react hook to fetch docs count from FireStore
export const useDocsCount = (col: CollectionReference): [number, boolean] => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCountFromServer(col).then((val) => {
      setCount(val.data().count);
      setLoading(false);
    });
  }, []);

  return [count, loading];
};
