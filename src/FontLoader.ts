import { FileLoader, Loader, LoadingManager, Shape, ShapePath } from "three";

class FontLoader extends Loader {
  constructor(manager?: LoadingManager) {
    super(manager);
  }

  load(
    url: string,
    onLoad?: (font: Font) => void,
    onProgress?: (request: ProgressEvent<EventTarget>) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    loader.load(
      url,
      (input: string | ArrayBuffer) => {
        let text: string =
          // input instanceof ArrayBuffer ? arrayBufferToString(input) : input;
          input instanceof ArrayBuffer
            ? throwError("Cannot decode ArrayBuffer")
            : input;

        let json: any;

        try {
          json = JSON.parse(text);
        } catch (e) {
          console.warn(
            "THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead."
          );
          json = JSON.parse(text.substring(65, text.length - 2));
        }

        const font = this.parse(json);

        if (onLoad) onLoad(font);
      },
      onProgress,
      onError
    );
  }

  parse(json: any) {
    return new Font(json);
  }
}

// const arrayBufferToString = (arrayBuffer: ArrayBuffer): string => {
//   return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer));
// };

const throwError = (message: string) => {
  throw new Error(message);
};

class Font {
  static isFont = true;

  readonly type = "Font";

  constructor(private data: any) {}

  generateShapes(text: string, size = 100) {
    const shapes: Shape[] = [];
    const paths = createPaths(text, size, this.data);

    for (let p = 0; p < paths.length; p++) {
      shapes.push(...paths[p].toShapes(false));
    }

    return shapes;
  }
}

function createPaths(text: string, size: number, data: any) {
  const chars = Array.from(text);
  const scale = size / data.resolution;
  const lineHeight =
    (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) *
    scale;

  const paths = [];

  let offsetX = 0,
    offsetY = 0;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char === "\n") {
      offsetX = 0;
      offsetY -= lineHeight;
    } else {
      const ret = createPath(char, scale, offsetX, offsetY, data);
      offsetX += ret.offsetX;
      paths.push(ret.path);
    }
  }

  return paths;
}

function createPath(
  char: string,
  scale: number,
  offsetX: number,
  offsetY: number,
  data: any
) {
  const glyph = data.glyphs[char];

  if (!glyph) {
    throw new Error(
      'THREE.Font: character "' +
        char +
        '" does not exists in font family ' +
        data.familyName +
        "."
    );
  }

  const path = new ShapePath();

  let x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;

  if (glyph.o) {
    const outline =
      glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(" "));

    for (let i = 0; i < outline.length; ) {
      const action = outline[i++];

      switch (action) {
        case "m": // moveTo
          x = outline[i++] * scale + offsetX;
          y = outline[i++] * scale + offsetY;

          path.moveTo(x, y);

          break;

        case "l": // lineTo
          x = outline[i++] * scale + offsetX;
          y = outline[i++] * scale + offsetY;

          path.lineTo(x, y);

          break;

        case "q": // quadraticCurveTo
          cpx = outline[i++] * scale + offsetX;
          cpy = outline[i++] * scale + offsetY;
          cpx1 = outline[i++] * scale + offsetX;
          cpy1 = outline[i++] * scale + offsetY;

          path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);

          break;

        case "b": // bezierCurveTo
          cpx = outline[i++] * scale + offsetX;
          cpy = outline[i++] * scale + offsetY;
          cpx1 = outline[i++] * scale + offsetX;
          cpy1 = outline[i++] * scale + offsetY;
          cpx2 = outline[i++] * scale + offsetX;
          cpy2 = outline[i++] * scale + offsetY;

          path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);

          break;
      }
    }
  }

  return { offsetX: glyph.ha * scale, path: path };
}

export { FontLoader, Font };
