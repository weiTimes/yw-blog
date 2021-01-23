import React, { useEffect } from 'react';
import { debounce, throttle } from '../utils';

export default function Test() {
  function handleChange(e) {
    console.log('hello', e);
  }

  useEffect(() => {
    const throttleAction = throttle((e) => {
      console.log(e.target.innerHeight);
    }, 5000);

    window.addEventListener('resize', throttleAction);
  }, []);

  const debounceAction = debounce(handleChange, 600, true); // 防抖

  return (
    <div
      onClick={() => {
        debounceAction.cancel();
      }}>
      <input onChange={debounceAction} />
    </div>
  );
}
