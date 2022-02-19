import * as THREE from "three";

export default class Scene {
  static FIELD_OF_VIEW = 75;
  static Z_NEAR = 0.1;
  static Z_FAR = 1000;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.Renderer;
  private cube: THREE.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      Scene.FIELD_OF_VIEW,
      canvas.clientWidth / canvas.clientHeight,
      Scene.Z_NEAR,
      Scene.Z_FAR
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: "blue" });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.render();
  }

  render = () => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render);
  };
}
