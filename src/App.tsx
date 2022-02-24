import { css, Global } from "@emotion/react";
import { useLayoutEffect } from "react";

import Scene from "./Scene";
import Faq from "./Faq";
import useId from "./hooks/useId";

const App = () => {
  const canvasId = useId();

  useLayoutEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Missing canvas");
    }

    const scene = new Scene(canvas);

    return () => {
      scene.destroy();
    };
  }, []);

  return (
    <>
      <Global styles={globalStyle} />
      <canvas id={canvasId} css={canvasStyle} />
      <Faq />
    </>
  );
};

const globalStyle = css`
  html,
  body {
    margin: 0;
    height: 100%;
    position: relative;
    font-family: sans-serif;
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
