import {createContext} from 'react';
import {default as moment} from 'moment';
import {Record} from './storage';

interface AuthContext extends Record {
  isAuthenticated: boolean;
  signOut: (...args: []) => any;
}

const defaultAuthValues: AuthContext = {
  accessToken: '',
  refreshToken: '',
  expiresAt: moment(),
  isAuthenticated: false,
  signOut: () => {}
};

export const context = createContext<AuthContext>(defaultAuthValues);
