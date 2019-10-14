import React, {ReactNode} from 'react';
import {UserContext} from './context';
import {UserContextType} from './types';

interface Props<T> {
  children: ReactNode;
  user: UserContextType<T>;
}

export function UserProvider<T>({children, user}: Props<T>) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
