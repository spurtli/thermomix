import React from "react";
import {shallow} from "enzyme";
import {useProtection} from "../hook";

function HookWrapper() {
  const {isAuthenticated} = useProtection();

  if (isAuthenticated) {
    return <>logged in</>;
  }
  return <>logged out</>;
}

describe("useProtection()", () => {
  it("returns isAuthenticated false when a user is not authenticated", () => {
    let wrapper = shallow(<HookWrapper />);

    expect(wrapper.text()).toEqual("logged out");
  });
});
