// 防抖
export function debounce(fn, delay, immediate) {
  let timer = null;
  let result;

  function debounced(...params) {
    if (timer) clearTimeout(timer);

    console.log(timer, 'timer');

    if (immediate) {
      // 立刻执行

      const callNow = !timer; // 第一次进来 timer = null，先保存下这个变量
      timer = setTimeout(() => {
        timer = null;
      }, delay);

      // timer 为 null 时才执行，也就是执行完一个延时器
      if (callNow) result = fn.apply(this, params); // 返回函数调用的结果
    } else {
      timer = setTimeout(() => {
        fn.apply(this, params);
      }, delay);
    }

    return result;
  }

  debounced.cancel = function () {
    timer = null;
  };

  return debounced;
}

// 节流
// export function throttle(fn, delay) {
//   let flag = true;
//   let timer = null;

//   return function (...params) {
//     if (!flag) return;

//     flag = false;
//     timer = setTimeout(() => {
//       fn.apply(this, params);
//       flag = true;
//     }, delay);
//   };
// }

// 使用时间戳
// export function throttle(fn, delay) {
//   let previous = 0;

//   return function (...params) {
//     const current = +new Date();

//     if (current - previous > delay) {
//       fn.apply(fn, params);
//       previous = current;
//     }
//   };
// }

// 使用定时器
// export function throttle(fn, delay) {
//   let timer = null;

//   return function (...params) {
//     if (!timer) {
//       timer = setTimeout(() => {
//         fn.apply(fn, params);
//         clearTimeout(timer);
//         timer = null;
//       }, delay);
//     }
//   };
// }

// 结合两者的优势
export function throttle(fn, delay) {
  let timer = null;
  let previous = 0;

  return function (...params) {
    let current = +new Date();
    let remain = delay - (current - previous); // 剩余等多久 = 需要等多久 - 已经等了多久

    if (remain < 0 || remain > delay) {
      // 时间隔了很久才触发，肯定走这里，会立马触发回调
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      fn.apply(this, params);
      previous = current;
    } else if (!timer) {
      // 在需要等的时间内触发，延时触发，触发间隔为剩余需要等的时间
      timer = setTimeout(() => {
        fn.apply(this, params);
        timer = null;
        previous = +new Date();
      }, remain);
    }
  };
}
