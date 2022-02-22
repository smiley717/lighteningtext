import { useState } from "react";
import * as uuid from "uuid";

const useId = (id_?: string) => {
  const [id] = useState(id_ || uuid.v4);
  return id;
};

export default useId;
