import { useState } from 'react';

function useFields(fields) {
  const [state, setState] = useState(fields);

  const getField = (name) => state[name];

  const setField = (name, value) => {
    setState({ ...state, ...{ [name]: value } });
  };

  const allFields = () => state;

  return [getField, setField, allFields];
}

export default useFields;
