import React from 'react';
import PropTypes from 'prop-types';

function AppIcon({
  width = 431,
  height = 431,
  mode = 'light',
  title = 'Quest Sidenoder Logo',
}) {
  let fill = '#f8f5f0';
  let stroke = '#212121';

  if (mode !== 'light') {
    fill = '#f8f5f0';
    stroke = '#212121';
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      version="1"
      viewBox="0 0 4310 3530"
      style={{ border: '0 none' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      <g fill={fill} stroke={stroke} strokeWidth="60">
        <path d="M1880 3121 c-199 -32 -390 -107 -565 -222 -104 -69 -305 -270 -374 -374 -152 -231 -227 -465 -237 -740 -10 -246 29 -433 135 -650 197 -403 554 -678 1001 -772 119 -24 400 -24 524 1 181 36 363 113 529 223 104 69 291 259 365 371 109 164 171 315 213 512 29 140 32 392 6 524 -85 424 -343 775 -725 983 -249 137 -580 191 -872 144z m-853 -1097 c26 -8 154 -66 283 -129 247 -119 374 -170 505 -204 342 -88 589 -39 1103 218 263 131 352 156 423 114 122 -72 112 -494 -16 -708 -120 -200 -356 -308 -752 -345 -196 -18 -923 -9 -1068 14 -172 27 -262 53 -375 108 -84 41 -118 64 -170 117 -116 117 -175 266 -187 471 -10 178 23 311 85 344 36 20 110 20 169 0z" />
      </g>
    </svg>
  );
}

AppIcon.propTypes = {
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  mode: PropTypes.oneOf(['light', 'dark']),
};

export default AppIcon;
