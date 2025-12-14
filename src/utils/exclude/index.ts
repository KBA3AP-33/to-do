export const exclude = <T extends object, K extends { [key in keyof T]?: T[key] }>(
  objSrc: T,
  objExc: K
): Partial<T> => {
  const result = {} as T;
  Object.entries(objSrc).forEach(x => {
    if (x[1] !== objExc[x[0] as keyof K]) {
      result[x[0] as keyof T] = x[1];
    }
  });
  return result;
};
