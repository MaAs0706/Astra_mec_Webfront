export interface Department {
  id: string;
  name: string;
  /** How many open seats to render as placeholder cards until real members are added. */
  placeholderCount: number;
}
