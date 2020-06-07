import * as React from 'react';
import { Style } from './style';
import Textarea from './textarea';
import List from './list';

type Memo = {
  id: string;
  title: string;
  content: string;
};

const createMemo = () => {
  const id = Math.random().toString(32).slice(2);
  return {
    id,
    title: '新規のメモ',
    content: '新規のメモ',
  };
};

export default () => {
  const initMemo = createMemo();
  const [memos, setMemos] = React.useState<{ [key: string]: Memo }>({
    [initMemo.id]: initMemo,
  });
  const [selectedMemo, setSelectedMemo] = React.useState<string>(initMemo.id);

  return (
    <div className={wrapper}>
      <List
        style={{ width: '50%' }}
        items={Object.values(memos).map((x) => ({
          ...x,
          isActive: x.id === selectedMemo,
          description: x.content.slice(0, 10),
        }))}
        onAdd={() => {
          const newMemo = createMemo();
          setMemos({
            ...memos,
            [newMemo.id]: newMemo,
          });
          setSelectedMemo(newMemo.id);
        }}
        onSelect={(id) => setSelectedMemo(id)}
      />
      <Textarea
        value={memos[selectedMemo].content}
        onInput={(str) => {
          const [head] = str.split('\n');

          setMemos({
            ...memos,
            [selectedMemo]: {
              ...memos[selectedMemo],
              title: head,
              content: str,
            },
          });
        }}
      />
    </div>
  );
};

const wrapper = Style.registerStyle({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
});
