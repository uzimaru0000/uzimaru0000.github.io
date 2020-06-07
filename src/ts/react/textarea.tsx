import * as React from 'react';
import { Style } from './style';

export type Props = {
  value: string;
  onInput: (_: string) => void;
};

export default ({ value, onInput }: Props) => (
  <textarea
    className={style}
    value={value}
    onChange={(e) => onInput((e.target as HTMLTextAreaElement).value)}
  ></textarea>
);

const style = Style.registerStyle({
  width: '100%',
  height: '100%',
  resize: 'none',
  boxSizing: 'border-box',
  padding: '1rem',
});
