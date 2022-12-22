import React, { useEffect, useState, useCallback, useContext } from 'react';
import api from '../api';
import * as Type from '../types/pantheon';

const KeyContext = React.createContext<[string | undefined, () => undefined]>(
  [undefined, () => undefined]);

export const KeyProvider = (props: any) => {
  const [key, setKey] = useState<string | undefined>(undefined);

  const resetKey = useCallback(async () => {
    const agentKey: string = await api.scry<Type.ScryKey>(
      {app: 'pantheon-agent', path: '/key'}).then(
      ({key}) => key);
    setKey(agentKey);
  }, [key, setKey]);

  // attempt to load the key from Urbit on the initial boot
  useEffect(() => {
    if(key === undefined) {
      resetKey();
    }
  }, [key]);

  return (
    <KeyContext.Provider value={[key, resetKey]} {...props} />
  );
}

export const useKey = () => {
  // [ key, resetKey ]
  return useContext(KeyContext);
}
