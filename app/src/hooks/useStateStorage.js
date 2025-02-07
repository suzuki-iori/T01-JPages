import { useState } from "react";

function useStateStorage(key, def) {
  // storage check
  const item = window.localStorage.getItem(key);

  // default value
  const [value, setValue] = useState(
    item?JSON.parse(item):def
  );

  const set = (v) => {
    setValue(v);
    window.localStorage.setItem(key, JSON.stringify(v));
  };

  return [value, set];
}

export default useStateStorage;
