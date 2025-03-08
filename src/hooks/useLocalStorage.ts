import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useUuid = () => {
  const [uuid, setUuid] = useState(null);

  useEffect(() => {
    let storedUuid = localStorage.getItem('my-uuid');
    if (!storedUuid) {
      storedUuid = uuidv4();
      localStorage.setItem('my-uuid', storedUuid);
    }
    setUuid(storedUuid);
  }, []);

  return uuid;
};

export default useUuid;
