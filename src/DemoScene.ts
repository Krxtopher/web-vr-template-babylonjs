import {
  SceneLoader,
  Vector3,
  Mesh,
  Nullable,
} from '@babylonjs/core';
import '@babylonjs/loaders'; // Plugins for loading glTF files
import VrSceneBase from './VrSceneBase';

class DemoScene extends VrSceneBase {
  // The main mesh loaded into the scene.
  private heroMesh: Nullable<Mesh> = null;

  /**
   * @inheritdoc
   */
  protected async init(): Promise<void> {
    await super.init();

    await this.loadHeroMesh();

    this.dismissLoadingScreen();
    this.showWelcomeScreen();
  }

  /**
   * Loads the main content for this scene. This is an asynchronous operation.
   * It returns a Promise which is resolved when loading is complete.
   *
   * @returns Promise<void> - A promise that can be used to determine
   * when the content load completes.
   */
  protected async loadHeroMesh(): Promise<void> {
    let result;
    try {
      console.log('Starting hero mesh load.');

      const heroMeshUrl = './assets/models/Biplane.glb';
      result = await SceneLoader.ImportMeshAsync('', heroMeshUrl, undefined, this);

      console.log('Hero mesh loaded.');
    } catch (e: any) {
      console.error(e.message);
      return;
    }

    const { meshes } = result;

    this.heroMesh = meshes[0] as Mesh;
    this.heroMesh.position = Vector3.Zero();

    // Add the hero mesh and its children as shadow casters.
    this.shadowGenerator?.addShadowCaster(this.heroMesh, true);
  }

  /**
   * Closes the initial loading screen.
   */
  protected dismissLoadingScreen(): void {
    document.getElementById('loadingScreen')!.classList.remove('show');
  }

  protected showWelcomeScreen(): void {
    document.getElementById('welcomeScreen')!.classList.add('show');
  }
}

export default DemoScene;
