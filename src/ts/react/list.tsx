import * as React from 'react';
import { Style } from './style';

export type Props = {
  items: Array<Item>;
  style: React.CSSProperties;
  onSelect: (_: string) => void;
  onAdd: () => void;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
};

export default (props: Props) => {
  return (
    <div className={style} style={props.style}>
      <ul className={ulStyle}>
        {props.items.map((x) => (
          <ItemView key={x.id} onSelect={props.onSelect} {...x} />
        ))}
      </ul>
      <AddButton onClick={props.onAdd} />
    </div>
  );
};

const style = Style.registerStyle({
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--gray25)',
  overflowY: 'scroll',
});

const ulStyle = Style.registerStyle({
  margin: '0',
  padding: '0',
});

const ItemView = ({
  onSelect,
  ...item
}: Item & { onSelect: (_: string) => void }) => (
  <li
    className={`${itemStyle} ${item.isActive ? activeItemStyle : ''}`}
    onClick={() => onSelect(item.id)}
  >
    <div className={titleStyle}>{item.title || '無題のメモ'}</div>
    <div>{item.description}</div>
  </li>
);

const itemStyle = Style.registerStyle({
  display: 'flex',
  flexDirection: 'column',
  color: 'var(--base)',
  listStyle: 'none',
  padding: '0.5rem',
  borderBottom: '1px solid var(--base)',
  boxSizing: 'border-box',
  cursor: 'pointer',
  '&:hover': {
    background: 'var(--gray50)',
  },
  '&:active': {
    background: 'var(--base50)',
  },
});

const activeItemStyle = Style.registerStyle({
  background: 'var(--gray)',
  color: 'var(--text)',
  '&:hover': {
    background: 'var(--gray)',
  },
});

const titleStyle = Style.registerStyle({
  fontWeight: 'bold',
});

type AddButtonProps = {
  onClick: () => void;
};

const AddButton = (props: AddButtonProps) => (
  <button className={buttonStyle} onClick={() => props.onClick()}>
    +
  </button>
);

const buttonStyle = Style.registerStyle({
  padding: '0.25rem 0.5rem',
  fontSize: '1rem',
  border: 'none',
  background: 'transparent',
  '&:hover': {
    background: 'var(--gray25)',
  },
  '&:active': {
    background: 'var(--gray50)',
  },
});
