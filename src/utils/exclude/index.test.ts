import { exclude } from '.';

describe('exclude', () => {
  test('Должен исключить 1 эл.', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = exclude(obj, { b: 2 });
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('Должен исключить 2 эл.', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const result = exclude(obj, { b: 2, d: 4 });
    expect(result).toEqual({ a: 1, c: 3 });
  });

  test('Должен корректно отработать с пустым объектом', () => {
    const obj = { a: 1, b: 2 };
    const result = exclude(obj, { a: 1, b: 2 });
    expect(result).toEqual({});
  });

  test('Должен корректно отработать с пустым объектом 2', () => {
    const obj = {};
    const result = exclude(obj, { a: 1 });
    expect(result).toEqual({});
  });

  test('Должен корректно отработать с пустым объектом 3', () => {
    const obj = { a: 1, b: 2 };
    const result = exclude(obj, {});
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test('Должен корректно исключить свойство типа - строки', () => {
    const obj = { name: 'test', city: 'test2', age: 30 };
    const result = exclude(obj, { city: 'test2' });
    expect(result).toEqual({ name: 'test', age: 30 });
  });

  test('Должен корректно исключить свойство типа - bool', () => {
    const obj = { a: true, b: false, c: true };
    const result = exclude(obj, { b: false });
    expect(result).toEqual({ a: true, c: true });
  });

  test('Должен корректно исключить свойство типа - null и undefined', () => {
    const obj = { a: null, b: undefined, c: 'v' };
    const result = exclude(obj, { a: null });
    expect(result).toEqual({ b: undefined, c: 'v' });
  });

  test('Должен корректно отработать при строгом сравнении', () => {
    const obj = { a: { x: 1 }, b: [1, 2] };
    const result = exclude(obj, { a: { x: 1 } });
    expect(result).toEqual({ a: { x: 1 }, b: [1, 2] });
  });

  test('Должен корректно отработать с ссылкой', () => {
    const nested = { x: 1 };
    const obj = { a: nested, b: 2 };
    const result = exclude(obj, { a: nested });
    expect(result).toEqual({ b: 2 });
  });

  test('Должен сохранить исходный объект', () => {
    const original = { a: 1, b: 2, c: 3 };
    const copy = { ...original };
    exclude(original, { b: 2 });
    expect(original).toEqual(copy);
  });

  test('Должен сохранить исходный объект 2', () => {
    const exclusion = { b: 2 };
    const original = { a: 1, b: 2, c: 3 };
    const copy = { ...exclusion };
    exclude(original, exclusion);
    expect(exclusion).toEqual(copy);
  });

  test('Должен корректно отработать с большим объектом', () => {
    const obj: Record<string, number> = {};
    const exclusion: Record<string, number> = {};

    for (let i = 0; i < 1000; i++) {
      obj[`key${i}`] = i;
      if (i % 2 === 0) {
        exclusion[`key${i}`] = i;
      }
    }

    const result = exclude(obj, exclusion);

    expect(Object.keys(result)).toHaveLength(500);
    expect(result.key1).toBe(1);
    expect(result.key999).toBe(999);
    expect(result.key0).toBeUndefined();
  });
});
