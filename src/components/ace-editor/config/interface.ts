export interface Position {
  row: number;
  column: number;
}
export interface Completer {
  name?: string;
  value: string;
  score?: number;
  meta?: string;
  type?: string;
}
