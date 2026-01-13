export const exclude = <T extends object, K extends { [key in keyof T]?: T[key] }>(obj1: T, obj2: K): Partial<T> => {
  const result = {} as T;
  Object.entries(obj1).forEach(x => {
    if (x[1] !== obj2[x[0] as keyof K]) {
      result[x[0] as keyof T] = x[1];
    }
  });
  return result;
};
