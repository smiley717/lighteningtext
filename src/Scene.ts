import * as THREE from "three";
import { FontLoader } from "./FontLoader";
import { TextGeometry } from "./TextGeometry";

import fontData from "./fonts/droid_sans_regular.typeface.json";

export default class Scene {
  static FIELD_OF_VIEW = 30;
  static Z_NEAR = 1;
  static Z_FAR = 1000;

  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraTarget: THREE.Vector3;
  private renderer: THREE.WebGLRenderer;
  private textMesh: THREE.Mesh;
  private textGeometry: TextGeometry;

  private destroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    THREE.Cache.enabled = true;

    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("lightblue");
    this.scene.fog = new THREE.Fog(0, 250, 1400);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.125);
    directionalLight.position.set(0, 0, 1).normalize();
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    pointLight.color.setHSL(Math.random(), 1, 0.5);
    this.scene.add(pointLight);

    this.camera = new THREE.PerspectiveCamera(
      Scene.FIELD_OF_VIEW,
      canvas.clientWidth / canvas.clientHeight,
      Scene.Z_NEAR,
      Scene.Z_FAR
    );
    this.camera.position.set(0, 400, 700);
    this.cameraTarget = new THREE.Vector3(0, 150, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    const loader = new FontLoader();
    const font = loader.parse(fontData);
    this.textGeometry = new TextGeometry("FACTS", {
      font: font,

      size: 70,
      height: 20,
      curveSegments: 4,

      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1.5,
    });

    this.textGeometry.computeBoundingBox();

    if (!this.textGeometry.boundingBox) {
      throw new Error("missing textGeometry.boundingBox");
    }

    const centerOffset =
      -0.5 *
      (this.textGeometry.boundingBox.max.x -
        this.textGeometry.boundingBox.min.x);

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
    ];
    this.textMesh = new THREE.Mesh(this.textGeometry, materials);

    this.textMesh.position.x = centerOffset;
    this.textMesh.position.y = 30 + 100;
    this.textMesh.position.z = 0;

    this.textMesh.rotation.x = 0;
    this.textMesh.rotation.y = Math.PI * 2;
    this.scene.add(this.textMesh);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
      })
    );
    plane.position.y = 100;
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);

    window.addEventListener("resize", this.onWindowResize);

    this.render();
  }

  destroy() {
    this.destroyed = true;
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // this.canvas.style.width = `${window.innerWidth}px`;
    // this.canvas.style.height = `${window.innerHeight}px`;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  };

  render = () => {
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);

    if (this.destroyed) {
      return;
    }

    requestAnimationFrame(this.render);
  };
}
