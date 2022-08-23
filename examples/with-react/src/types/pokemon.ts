export type Pokemon = {
  avg_spawns: number;
  candy: string;
  candy_count: number;
  egg: string;
  height: number;
  id: number;
  img: string;
  multipliers: number[];
  name: string;
  next_evolution: { num: number; name: string }[];
  num: number;
  spawn_chance: number;
  spawn_time: string;
  type: string[];
  weaknesses: string[];
  weight: number;
};
