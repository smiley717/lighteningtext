import { css, Global } from "@emotion/react";
import { useEffect } from "react";
import Scene from "./Scene";

import useStateRef from "./hooks/useStateRef";

const App = () => {
  const [canvas, canvasRef] = useStateRef<HTMLCanvasElement>();
  const [scene, setScene] = useStateRef<Scene>();

  useEffect(() => {
    if (scene || !canvas) {
      return;
    }

    const scene_ = new Scene(canvas);
    setScene(scene_);
  }, [canvas]);

  return (
    <>
      <Global styles={globalStyle} />
      {/* TODO type */}
      <canvas css={canvasStyle} ref={canvasRef as any} />
    </>
  );
};

const globalStyle = css`
  html,
  body {
    margin: 0;
    height: 100%;
  }

  #root {
    height: 100%;
  }
`;

const canvasStyle = css`
  width: 100%;
  height: 100%;
`;

export default App;
