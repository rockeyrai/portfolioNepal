import { useSelector, useDispatch } from 'react-redux';
import { hydrateAuthAction, signIn, signOut, TokenType, UserInfo } from '../../redux/slices/authSlice';
import { AppDispatch, RootState, store } from '../../redux/store';

interface UseAuthReturn {
  token: TokenType | null;
  status: 'idle' | 'loading' | 'signIn' | 'signOut';
  signIn: (token: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
  user: UserInfo | null
}

/**
 * React hook to access auth state
 */
export const useAuth = (): UseAuthReturn => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return {
    token: auth.token,
    status: auth.status,
    signIn: (token: TokenType) => dispatch(signIn(token)),
    signOut: () => dispatch(signOut()),
    hydrate: () => dispatch(hydrateAuthAction()),
    user: auth.user,
  };
};

export const signInDirect = (token: TokenType) => (store.dispatch as AppDispatch)(signIn(token));
export const signOutDirect = () => (store.dispatch as AppDispatch)(signOut());
export const hydrateAuthDirect = () => (store.dispatch as AppDispatch)(hydrateAuthAction());
