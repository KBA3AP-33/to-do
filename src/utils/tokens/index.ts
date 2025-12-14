import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../consts';

export class Tokens {
  public static getTokens = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    return { accessToken, refreshToken };
  };

  public static setTokens = (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
    }
  };

  public static clearTokens = (): void => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  };
}
