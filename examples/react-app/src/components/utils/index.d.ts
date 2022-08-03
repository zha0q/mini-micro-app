import { Rnd } from '.';

export type LineType = 'H' | 'V';

export type Box = {
  vt: Line;
  vm: Line;
  vb: Line;
  hl: Line;
  hm: Line;
  hr: Line;
  instance: HTMLElement;
};

export type Line = {
  pos: number;
  type: LineType;
  box: Box | null;
  instance: HTMLElement;
};

export type Layout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type RndOptions = {
  default: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  draggable: boolean;
  resizable: boolean;
  sensitive: number;
  nearLineDistance: number;
};
