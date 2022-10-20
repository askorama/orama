export type EventJson = {
  result: {
    events: {
      date: string;
      description: string;
      granularity: string;
      category1: string;
      category2: string;
    }[];
  };
};
