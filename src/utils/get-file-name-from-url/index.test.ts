import { getFileNameFromUrl } from '.';

describe('getFileNameFromUrl', () => {
  describe('Успешные случаи', () => {
    test('Должен получить имя файла с 1 подчеркиванием', () => {
      const result = getFileNameFromUrl('id_fileName.png');
      expect(result).toBe('fileName.png');
    });

    test('Должен получить имя файла с большим кол-вом подчеркиваний', () => {
      const result = getFileNameFromUrl('id_my_file_name_v2.png');
      expect(result).toBe('my_file_name_v2.png');
    });

    test('Должен корректно изменить специальные символов', () => {
      const result = getFileNameFromUrl('id_my%20file%20name.png');
      expect(result).toBe('my file name.png');
    });

    test('Должен корректно сработать с специальными символами', () => {
      const cases = [
        { url: 'id_file%2Fname.png', expected: 'file/name.png' },
        { url: 'id_file%3Fquery.png', expected: 'file?query.png' },
        { url: 'id_file%23hash.png', expected: 'file#hash.png' },
        { url: 'id_file%26param.png', expected: 'file&param.png' },
        { url: 'id_file%2Bplus.png', expected: 'file+plus.png' },
        { url: 'id_%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9.png', expected: 'Русский.png' },
      ];

      cases.forEach(({ url, expected }) => {
        const result = getFileNameFromUrl(url);
        expect(result).toBe(expected);
      });
    });

    test('Должен корректно сработать с точками', () => {
      const result = getFileNameFromUrl('id_file.name.version.2.0.png');
      expect(result).toBe('file.name.version.2.0.png');
    });

    test('Должен корректно сработать с тире', () => {
      const result = getFileNameFromUrl('id_my-file-name.png');
      expect(result).toBe('my-file-name.png');
    });

    test('Должен корректно сработать с размыми символами', () => {
      const result = getFileNameFromUrl('id_file-name_v2.0_final%20release.png');
      expect(result).toBe('file-name_v2.0_final release.png');
    });

    test('Должен корректно сработать с разными расширениями', () => {
      const cases = [
        { url: 'id_file.png', expected: 'file.png' },
        { url: 'id_file.txt', expected: 'file.txt' },
        { url: 'id_file.js', expected: 'file.js' },
        { url: 'id_file.html', expected: 'file.html' },
        { url: 'id_file.css', expected: 'file.css' },
        { url: 'id_file.tsx', expected: 'file.tsx' },
      ];

      cases.forEach(({ url, expected }) => {
        const result = getFileNameFromUrl(url);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Граничные случаи', () => {
    test('Должен корректно сработать с пустой строкой', () => {
      expect(getFileNameFromUrl('')).toBeUndefined();
      expect(getFileNameFromUrl('   ')).toBeUndefined();
    });

    test('Должен корректно сработать с undefined', () => {
      expect(getFileNameFromUrl()).toBeUndefined();
    });

    test('Должен корректно сработать с null', () => {
      expect(getFileNameFromUrl(null as unknown as string)).toBeUndefined();
    });

    test('Должен корректно сработать с без подчеркивания', () => {
      expect(getFileNameFromUrl('filename.png')).toBeUndefined();
    });

    test('Должен корректно сработать с пустым именем файла', () => {
      expect(getFileNameFromUrl('id_')).toBeUndefined();
    });

    test('Должен корректно сработать с длинным именем файла', () => {
      const name = 'a'.repeat(1000) + '.png';
      const result = getFileNameFromUrl(`id_${name}`);

      expect(result).toBe(name);
    });
  });
});
