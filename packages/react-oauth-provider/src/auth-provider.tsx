import React, { Component } from "react";

import { AuthContext } from "./context";
import { Provider } from "./provider";

interface Props {
  provider: Provider;
}

export class AuthProvider extends Component<Props> {
  constructor(props: Props) {
    super(props);
    const { provider } = props;
    provider.on("change", this.forceUpdate.bind(this));
  }

  render() {
    const { children, provider } = this.props;
    return (
      <AuthContext.Provider value={provider.authObj()}>
        {children}
      </AuthContext.Provider>
    );
  }
}
