import { Tokens } from '.';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../consts';

const ls = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => (store[key] = value.toString())),
    removeItem: jest.fn((key: string) => delete store[key]),
    clear: jest.fn(() => (store = {})),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: ls,
});

describe('Tokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ls.clear();
  });

  describe('getTokens', () => {
    test('Должен проверь есть ли токены в ls', () => {
      const result = Tokens.getTokens();

      expect(result).toEqual({ accessToken: null, refreshToken: null });

      expect(ls.getItem).toHaveBeenCalledWith(ACCESS_TOKEN);
      expect(ls.getItem).toHaveBeenCalledWith(REFRESH_TOKEN);
    });

    test('Должен вернуть токены из ls', () => {
      ls.setItem(ACCESS_TOKEN, 'access-token');
      ls.setItem(REFRESH_TOKEN, 'refresh-token');

      const result = Tokens.getTokens();

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    test('Должен вернуть токены access токен', () => {
      ls.setItem(ACCESS_TOKEN, 'access-token');

      const result = Tokens.getTokens();

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: null,
      });
    });
  });

  describe('setTokens', () => {
    test('Должен сохранить access токен в ls', () => {
      Tokens.setTokens('new-access-token');

      expect(ls.setItem).toHaveBeenCalledWith(ACCESS_TOKEN, 'new-access-token');
      expect(ls.setItem).not.toHaveBeenCalledWith(REFRESH_TOKEN);
    });

    test('Должен сохранить access и refresh токены в ls', () => {
      Tokens.setTokens('new-access-token', 'new-refresh-token');

      expect(ls.setItem).toHaveBeenCalledWith(ACCESS_TOKEN, 'new-access-token');
      expect(ls.setItem).toHaveBeenCalledWith(REFRESH_TOKEN, 'new-refresh-token');
      expect(ls.setItem).toHaveBeenCalledTimes(2);
    });

    test('Должен перезаписать токены', () => {
      ls.setItem(ACCESS_TOKEN, 'old-access');
      ls.setItem(REFRESH_TOKEN, 'old-refresh');

      Tokens.setTokens('new-access', 'new-refresh');

      expect(ls.setItem).toHaveBeenCalledWith(ACCESS_TOKEN, 'new-access');
      expect(ls.setItem).toHaveBeenCalledWith(REFRESH_TOKEN, 'new-refresh');
    });
  });

  describe('clearTokens', () => {
    test('Должен удалить токены из ls', () => {
      ls.setItem(ACCESS_TOKEN, 'access-token');
      ls.setItem(REFRESH_TOKEN, 'refresh-token');

      Tokens.clearTokens();

      expect(ls.removeItem).toHaveBeenCalledWith(ACCESS_TOKEN);
      expect(ls.removeItem).toHaveBeenCalledWith(REFRESH_TOKEN);
      expect(ls.removeItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('Интеграционные тесты', () => {
    test('Должен установить токен, получить его и очистить ls', () => {
      Tokens.setTokens('access-token', 'refresh-token');

      let tokens = Tokens.getTokens();
      expect(tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      Tokens.clearTokens();

      tokens = Tokens.getTokens();
      expect(tokens).toEqual({
        accessToken: null,
        refreshToken: null,
      });
    });
  });
});
