import React from 'react';

import '../css/tricks.css';

export const Highlight = ({ children, color }) => (
  <span className='highlight'>{children}</span>
);

export const Mdx = ({ children }) => {
  return <div className='mdx'>{children}</div>;
};

export const Tooltip = () => {
  return (
    <div className='highlight tooltip' data-tip='This css tooltip'>
      I have a Tooltip
    </div>
  );
};

export const UnderlineText = () => {
  return <div className='shadow-underline'>我是自定义 阴影下划线</div>;
};

export const UnderlineLinearText = () => {
  return <div className='shadow-underline-linear'>我是自定义 阴影下划线</div>;
};

export const ExtendButton = () => {
  return <div className='button-extend' onClick={() => alert('hello')}>扩大点击区域</div>;
};

export const FrostedGlass = () => {
  return <div className='frosted-glass'>
    <div className="box"></div>
    <img src="https://cdn.pixabay.com/photo/2020/12/13/16/21/stork-5828727_1280.jpg" />
  </div>;
};
