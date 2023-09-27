export interface Stage {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  children: Stage[];
}
