import { atom, useAtom } from 'jotai';
import { User } from '../../interfaces/auth.interface';

const userAtom = atom<User | null>(null);
const accessTokenAtom = atom<string | null>(null);
const refreshTokenAtom = atom<string | null>(null);

export const useAuthStore = () => {
  const [user, setUser] = useAtom(userAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);

  const setAuth = (
    userData: User,
    accessToken: string,
    refreshToken: string,
  ) => {
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return {
    user,
    accessToken,
    refreshToken,
    setAuth,
    clearAuth,
  };
};
