import { useContext } from "react";
import { context as authContext } from "./";

export function useProtection() {
  const { isAuthenticated, signOut } = useContext(authContext);
  return { isAuthenticated, signOut };
}
