import {useContext} from "react";
import {UserContext} from "./context";

export function useUser<T = Record<any, string>>() {
  return useContext(UserContext) as T;
}
