import { plural } from '.';

describe('plural', () => {
  describe('Ru', () => {
    const ru = { one: 'проект', few: 'проекта', many: 'проектов' };

    test('Должно корректно работать для: 1, 21, 101', () => {
      expect(plural(1, ru)).toBe(`1 ${ru.one}`);
      expect(plural(21, ru)).toBe(`21 ${ru.one}`);
      expect(plural(101, ru)).toBe(`101 ${ru.one}`);
    });

    test('Должно корректно работать для: 2-4, 22-24, 102-104', () => {
      expect(plural(2, ru)).toBe(`2 ${ru.few}`);
      expect(plural(3, ru)).toBe(`3 ${ru.few}`);
      expect(plural(4, ru)).toBe(`4 ${ru.few}`);
      expect(plural(22, ru)).toBe(`22 ${ru.few}`);
      expect(plural(23, ru)).toBe(`23 ${ru.few}`);
      expect(plural(24, ru)).toBe(`24 ${ru.few}`);
      expect(plural(102, ru)).toBe(`102 ${ru.few}`);
      expect(plural(103, ru)).toBe(`103 ${ru.few}`);
      expect(plural(104, ru)).toBe(`104 ${ru.few}`);
    });

    test('Должно корректно работать для: 0, 5-20, 25-30, 105', () => {
      expect(plural(0, ru)).toBe(`0 ${ru.many}`);
      expect(plural(5, ru)).toBe(`5 ${ru.many}`);
      expect(plural(10, ru)).toBe(`10 ${ru.many}`);
      expect(plural(11, ru)).toBe(`11 ${ru.many}`);
      expect(plural(19, ru)).toBe(`19 ${ru.many}`);
      expect(plural(20, ru)).toBe(`20 ${ru.many}`);
      expect(plural(25, ru)).toBe(`25 ${ru.many}`);
      expect(plural(30, ru)).toBe(`30 ${ru.many}`);
      expect(plural(100, ru)).toBe(`100 ${ru.many}`);
      expect(plural(105, ru)).toBe(`105 ${ru.many}`);
    });

    test('Должно корректно работать для отрицательных чисел', () => {
      expect(plural(-1, ru)).toBe(`-1 ${ru.one}`);
      expect(plural(-2, ru)).toBe(`-2 ${ru.few}`);
      expect(plural(-5, ru)).toBe(`-5 ${ru.many}`);
    });
  });

  describe('En', () => {
    const en = { one: 'project', few: 'projects', many: 'projects' };

    test('Должно корректно работать для: 1, 21, 101', () => {
      expect(plural(1, en)).toBe(`1 ${en.one}`);
      expect(plural(21, en)).toBe(`21 ${en.one}`);
      expect(plural(101, en)).toBe(`101 ${en.one}`);
    });

    test('Должно корректно работать для: 0, 2-20, 22-30, 100+', () => {
      expect(plural(0, en)).toBe(`0 ${en.many}`);
      expect(plural(2, en)).toBe(`2 ${en.many}`);
      expect(plural(3, en)).toBe(`3 ${en.many}`);
      expect(plural(4, en)).toBe(`4 ${en.many}`);
      expect(plural(5, en)).toBe(`5 ${en.many}`);

      expect(plural(10, en)).toBe(`10 ${en.many}`);
      expect(plural(11, en)).toBe(`11 ${en.many}`);
      expect(plural(19, en)).toBe(`19 ${en.many}`);
      expect(plural(20, en)).toBe(`20 ${en.many}`);

      expect(plural(22, en)).toBe(`22 ${en.many}`);
      expect(plural(23, en)).toBe(`23 ${en.many}`);
      expect(plural(24, en)).toBe(`24 ${en.many}`);
      expect(plural(25, en)).toBe(`25 ${en.many}`);
      expect(plural(30, en)).toBe(`30 ${en.many}`);

      expect(plural(100, en)).toBe(`100 ${en.many}`);
      expect(plural(102, en)).toBe(`102 ${en.many}`);
      expect(plural(105, en)).toBe(`105 ${en.many}`);
    });

    test('Должно корректно работать для отрицательных чисел', () => {
      expect(plural(-1, en)).toBe(`-1 ${en.one}`);
      expect(plural(-2, en)).toBe(`-2 ${en.many}`);
      expect(plural(-5, en)).toBe(`-5 ${en.many}`);
    });
  });
});
