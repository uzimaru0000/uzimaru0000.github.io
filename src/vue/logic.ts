export const BLACK = 'BLACK' as const;
export const WHITE = 'WHITE' as const;
export const NONE = 'NONE' as const;

export type Panel = typeof BLACK | typeof WHITE | typeof NONE;

export type Field = Panel[];

const EVAL = [
  30,
  -12,
  0,
  -1,
  -1,
  0,
  -12,
  30,
  -12,
  -15,
  -3,
  -3,
  -3,
  -3,
  -15,
  -12,
  0,
  -3,
  0,
  -1,
  -1,
  0,
  -3,
  0,
  -1,
  -3,
  -1,
  -1,
  -1,
  -1,
  -3,
  -1,
  -1,
  -3,
  -1,
  -1,
  -1,
  -1,
  -3,
  -1,
  0,
  -3,
  0,
  -1,
  -1,
  0,
  -3,
  0,
  -12,
  -15,
  -3,
  -3,
  -3,
  -3,
  -15,
  -12,
  30,
  -12,
  0,
  -1,
  -1,
  0,
  -12,
  30,
];

export const init = (): Field => [
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  WHITE,
  BLACK,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  BLACK,
  WHITE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
  NONE,
];

export const putPanel = (field: Field) => (
  panel: Panel,
  x: number,
  y: number
) => {
  if (field[x + y * 8] !== NONE) {
    return field;
  }

  const copy = [...field];
  flip(copy, panel, x, y);
  copy[x + y * 8] = panel;

  return copy;
};

export const isPutable = (field: Field) => (
  panel: Panel,
  x: number,
  y: number
) => {
  if (field[x + y * 8] !== NONE) {
    return false;
  }

  return check(field)(panel, x, y).some((x) => x !== 0);
};

export const aggregate = (field: Field) =>
  field.reduce(
    (acc, x) => ({
      [BLACK]: acc[BLACK] + (x === BLACK ? 1 : 0),
      [WHITE]: acc[WHITE] + (x === WHITE ? 1 : 0),
      [NONE]: acc[NONE] + (x === NONE ? 1 : 0),
    }),
    { [BLACK]: 0, [WHITE]: 0, [NONE]: 0 }
  );

export const cpuLogic = (puttable: number[]): number =>
  puttable
    .map((x) => [x, EVAL[x]])
    .reduce(
      ({ value, pos }, [p, e]) =>
        value < e ? { value: e, pos: p } : { value, pos },
      {
        value: -10e10,
        pos: undefined,
      }
    ).pos;

const flip = (field: Field, panel: Panel, x: number, y: number) => {
  const dir = direction();
  check(field)(panel, x, y)
    .map<[number, number]>((n, i) => [n, i])
    .filter(([n]) => n !== 0)
    .map(([n, i]) =>
      [...Array(n)]
        .map((_) => dir[i])
        .map<[number, number]>(([dx, dy], j) => [
          x + dx * (j + 1),
          y + dy * (j + 1),
        ])
    )
    .reduce((acc, xs) => [...acc, ...xs], [])
    .reduce((acc, [dx, dy]) => ((acc[dx + dy * 8] = panel), acc), field);
};

const direction = () => [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const check = (field: Field) => (panel: Panel, x: number, y: number) => {
  const memo = checkLine(field)(panel, x, y);
  return direction().map(([dx, dy]) => memo(dx, dy, 0));
};

const checkLine = (field: Field) => (panel: Panel, x: number, y: number) => (
  dx: number,
  dy: number,
  counter: number
): number => {
  if (
    x + dx < 0 ||
    8 <= x + dx ||
    y + dy < 0 ||
    8 <= y + dy ||
    field[x + dx + (y + dy) * 8] === NONE
  ) {
    return 0;
  } else if (field[x + dx + (y + dy) * 8] === panel) {
    return counter;
  } else {
    return checkLine(field)(panel, x + dx, y + dy)(dx, dy, counter + 1);
  }
};
