export type LineType = "H" | "V";

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
