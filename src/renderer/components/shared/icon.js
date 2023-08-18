import classNames from 'classnames';

function Icon({
  set = 'md',
  icon = '',
  spin = false,
  size = '1x',
  className = '',
  ...rest
}) {
  try {
    // eslint-disable-next-line no-floating-promise/no-floating-promise
    const module = window.require(`react-icons/${set}`);

    if (!module[icon]) {
      throw new Error(`Invalid icon name "${icon}" sent to icon.js.`);
    }

    const reactIcon = module[icon]();
    const classNameList = classNames([
      'icon',
      className,
      { 'icon-spin': spin },
      { 'icon-2xs': size === '2xs' },
      { 'icon-xs': size === 'xs' },
      { 'icon-sm': size === 'sm' },
      { 'icon-1x': size === '1x' },
      { 'icon-1point5x': size === '1point5x' },
      { 'icon-2x': size === '2x' },
      { 'icon-lg': size === 'lg' },
      { 'icon-xl': size === 'xl' },
      { 'icon-2xl': size === '2xl' },
    ]);

    return (
      <span {...rest} className={classNameList}>
        {reactIcon}
      </span>
    );
  } catch (e) {
    console.error(e);

    if (e.code === 'MODULE_NOT_FOUND') {
      console.error(`Invalid icon set "${set}" sent to icon.js.`);
    }
  }
}

export default Icon;
