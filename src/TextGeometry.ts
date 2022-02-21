import * as THREE from "three";
import { ExtrudeGeometryOptions } from "three";
import { Font } from "./FontLoader";

type Parameters = {
  font?: Font;
  size?: number;
  height?: number;
} & ExtrudeGeometryOptions;

/**
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float>, // how far from text outline (including bevelOffset) is bevel
 *  bevelOffset: <float> // how far from text outline does bevel start
 * }
 */
class TextGeometry extends THREE.ExtrudeGeometry {
  constructor(text: string, parameters: Parameters = {}) {
    const font = parameters.font;

    if (font === undefined) {
      super(); // generate default extrude geometry
    } else {
      const shapes = font.generateShapes(text, parameters.size);

      // translate parameters to ExtrudeGeometry API

      parameters.depth =
        parameters.height !== undefined ? parameters.height : 50;

      // defaults

      if (parameters.bevelThickness === undefined)
        parameters.bevelThickness = 10;
      if (parameters.bevelSize === undefined) parameters.bevelSize = 8;
      if (parameters.bevelEnabled === undefined)
        parameters.bevelEnabled = false;

      super(shapes, parameters);
    }

    this.type = "TextGeometry";
  }
}

export { TextGeometry };
