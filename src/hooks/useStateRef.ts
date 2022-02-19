import { useState } from "react";

const useStateRef = <T>(
  default_?: T
): [T | undefined, (value: T | undefined) => void] => {
  return useState<T | undefined>(default_);
};

export default useStateRef;
