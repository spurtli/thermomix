import React, {ReactNode, useEffect, useState} from 'react';
import moment from 'moment';
import qs from 'qs';

import {context} from './context';
import {Record} from './storage';
import {AuthEvent, Service as AuthService} from './service';

interface AuthProviderProps {
  children?: ReactNode;
  service: AuthService;
}

const unauthenticated: Record = {
  accessToken: '',
  refreshToken: '',
  expiresAt: moment(0)
};

export function AuthProvider(props: AuthProviderProps) {
  const {service} = props;
  const [auth, setAuth] = useState(unauthenticated);

  function onAuthentication() {
    setAuth(service.getToken());
  }

  function onSignout() {
    setAuth(unauthenticated);
  }

  useEffect(() => {
    service.addListener(AuthEvent.Authenticated, onAuthentication);
    service.addListener(AuthEvent.Unauthenticated, onSignout);

    // refresh tokens in background (or exchange auth code)
    async function startRefetch() {
      try {
        if (service.hasToken()) {
          const token = await service.refreshToken();
          setAuth(token);
        }
      } catch (err) {
        console.error(
          'There was a valid token, but refresh failed. Signing out now!'
        );
        await service.revokeToken();
      }

      const {search} = window.location;
      const authorization = qs.parse(search, {ignoreQueryPrefix: true});
      if (!!(authorization.code && authorization.scope)) {
        const token = await service.exchangeCodeForToken(authorization);
        setAuth(token);
      }
    }

    startRefetch();

    const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
    const interval = setInterval(async () => {
      const token = await service.refreshToken();
      setAuth(token);
    }, REFRESH_INTERVAL);

    return () => {
      service.removeListener(AuthEvent.Authenticated, onAuthentication);
      service.removeListener(AuthEvent.Unauthenticated, onSignout);
      clearInterval(interval);
    };
  }, []);

  async function signOut() {
    try {
      await service.revokeToken();
    } catch (err) {
      console.error(err);
    }
  }

  const value = {
    ...auth,
    isAuthenticated: service.hasValidToken(),
    signOut
  };

  const {children} = props;
  const {Provider} = context;
  return <Provider value={value}>{children}</Provider>;
}
