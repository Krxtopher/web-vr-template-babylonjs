import {
  Scene,
  Vector3,
  Color4,
  MeshBuilder,
  Texture,
  DirectionalLight,
  CubeTexture,
  ArcRotateCamera,
  Engine,
  Mesh,
  PBRMaterial,
  ShadowGenerator,
  Nullable,
} from '@babylonjs/core';
import '@babylonjs/loaders'; // Plugins for loading glTF files

/**
 * This is a basic scene class that includes a simple environment, lighting,
 * and camera. You can extend this class to add in your own additional content
 * and interactivity.
 */
class SceneBase extends Scene {
  // The primary shadow casting light in the scene.
  protected keyLight!: DirectionalLight;

  // The ground plane.
  protected ground!: Mesh;

  // The shadow caster for the keyLight.
  protected shadowGenerator: Nullable<ShadowGenerator> = null;

  constructor(engine: Engine) {
    super(engine);

    this.init();
  }

  /**
   * Called immediately when this scene instance is created. Use this to do
   * any initial setup for the scene.
   *
   * @returns Promise<void> A Promise which resolves when initialization is
   * complete.
   */
  protected async init(): Promise<void> {
    this.setUpEnvironment();
    this.setUpLighting();
    this.setUpCamera();

    // WARNING: Shadow casting has a computation cost. If you experience
    // performance issues - particularly in VR - experiment with commenting out
    // the line below.
    this.enableShadows();
  }

  /**
   * Creates the environment for this scene.
   */
  protected setUpEnvironment(): void {
    this.clearColor = new Color4(0, 0, 0, 1);

    this.ground = MeshBuilder.CreateGround('Ground', { width: 20, height: 20 });

    // Ensure the ground plane is drawn under other transparent objects.
    this.ground.alphaIndex = -1;

    const groundMaterial = new PBRMaterial('GroundMaterial');
    groundMaterial.opacityTexture = new Texture('./assets/textures/ground-fade.png');
    const diffuseTexture = new Texture('./assets/textures/grey-grid.png');
    diffuseTexture.uScale = 12;
    diffuseTexture.vScale = 12;
    groundMaterial.albedoTexture = diffuseTexture;
    groundMaterial.roughness = 1;

    this.ground.material = groundMaterial;
  }

  /**
   * Creates the lighting for this scene.
   */
  protected setUpLighting(): void {
    // Set up image-based lighting (IBL).
    const iblTexture = new CubeTexture('./assets/textures/environment.env', this);
    this.environmentTexture = iblTexture;
    this.environmentIntensity = 0.8;

    // Create a key light.
    this.keyLight = new DirectionalLight('KeyLight', new Vector3(-1, -2, -1), this);
    this.keyLight.position.y = 4;
    this.keyLight.intensity = 0.4;
  }

  /**
   * Creates a camera for the scene.
   */
  protected setUpCamera(): void {
    const target = new Vector3(0, 0.6, -0.2);
    const camera = new ArcRotateCamera('Camera', 0.6, 0.7, 3, target);
    camera.minZ = 0.001;
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 0.5;
    camera.attachControl();
  }

  /**
   * Enabling shadows allows the keyLight to cast shadows on the ground, but
   * it has a computational cost. If you experience performance issues -
   * especially in VR - you may want to experiment with not enabling shadows.
   *
   * If you would like shadows to be cast onto other objects besides the ground,
   * use code similar to the following...
```
this.shadowGenerator?.addShadowCaster(myMesh, true);
```
   */
  protected enableShadows(): void {
    this.keyLight.shadowEnabled = true;
    this.ground.receiveShadows = true;
    this.shadowGenerator = new ShadowGenerator(1024, this.keyLight);
  }
}

export default SceneBase;
