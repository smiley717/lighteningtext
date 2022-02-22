import { RefCallback, useState } from "react";

const useStateRef = <T>(default_?: T): [T | undefined, (value: T) => void] => {
  return useState<T | undefined>(default_);
};

export default useStateRef;
