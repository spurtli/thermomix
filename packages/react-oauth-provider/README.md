# react-oauth-provider

> A context based auth provider for react apps.

## This useful?

If you have a React web application that needs to talk directly to one or more
OAuth provider(s) and you want your application to behave deterministic in all
possible authentication states, this package might be something for you.

It aims to provide a small set of attributes and methods, you can use to
transition between different states. The most common use case is that you want
to know if an app user has signed in yet (with `isAuthenticated()`). We use it
to hide/show certain details in our apps (e.g. the logout or the login button).

It comes with a default storage and OAuth provider implementation and also
includes some utilities to allow for testing your application.

### It can't

- provide any signup/login form components
- any form of authorization (besides the basic protection component and HOC)
- support all OAuth flows
- provide any level of security. Think of this as a form of UX utility.

## Getting started

First you should install.

**npm**

```bash
npm install --save @spurtli/react-oauth-provider
```

**yarn**

```bash
yarn add @spurtli/react-oauth-provider --save
``` 

This package uses the React [context API](https://reactjs.org/docs/context.html).
The provider component will pass down all auth related information down to all the
components in the tree.

You might have more than one provider in your application, e.g. for [theming](https://www.styled-components.com/docs/advanced#theming).
The code in this package does not care about provider order. If you are not sure 
where to put it, just make it the outermost provider.

```jsx
import {AuthProvider} from "react-oauth-provider";

function App() {
  return (
    <AuthProvider>…</AuthProvider>
  );
}
```

## API

### Context attributes and methods

**get isAuthenticated(): boolean**

Whether the current user has successfully authenticated with a configured OAuth
provider or not.
Any time this value changes, it will trigger a forced update.  

**signOut({revoke: boolean = false}): void**
- *`revoke: boolean`* Revoke token, defaults to `false`

Resets the internal authentication state and clear all potential data in the
authentication storage. If you set `revoke: false`, it will issue a request to
the configured OAuth provider, to [revoke](https://tools.ietf.org/html/rfc7009)
the current token.

### Storage

**save(data: Data}): Promise<void>**

**load(): Promise<Data>**

**delete(): Promise<void>**   

## Browser compatibility

We strongly believe that making a tool worse for 99.75%, to also support the
other 0.25% is not a good idea. We are not willing to make such a trade-off.
Therefore we only support modern browsers, which translates to this:

```
>1%, not ie 11, not op_mini all
```

Checkout [browserlist](https://browserl.ist/?q=%3E1%25%2C+not+ie+11%2C+not+op_mini+all)
for a complete list of supported browsers. If you really need support for older
browsers, we'd like to recommend to configure your [bundler](https://medium.com/@ajmeyghani/javascript-bundlers-a-comparison-e63f01f2a364)
in way so that it capable of compiling the ES6 version of this package. 

## License

We like it [simple an permissive](https://choosealicense.com/). MIT [license](./LICENSE) it is. 
