import {
  Nullable,
  WebXRDefaultExperience,
  WebXRDefaultExperienceOptions,
} from '@babylonjs/core';
import SceneBase from './SceneBase';

/**
 * A scene which can be extended by any scene that should provide the
 * option of viewing in VR. This implementation provides on screen UI for
 * entering VR mode and provides user movement through teleportation.
 *
 * If you'd like to customize any of the VR behavior in your own class, you
 * can do so by using the interface provided by the `this.xr` property. This
 * is an instance of WebXRDefaultExperience. For example, if you would like
 * to register additional meshes that the user can teleport onto you could use
 * the `this.xr.teleporation` API like so...
```
if (this.xrExperience) {
  this.xrExperience.teleportation.addFloorMesh(myMesh);
}
```
 */
class VrSceneBase extends SceneBase {
  // Provides an API for customizing VR functionality such as teleporation.
  protected xrExperience: Nullable<WebXRDefaultExperience> = null;

  /**
   * @inheritdoc
   */
  protected async init(): Promise<void> {
    await super.init();

    // Enable basic VR functionality like teleporting. For more detail on
    // how to leverate the WebXRDefaultExperience API, see:
    // https://doc.babylonjs.com/divingDeeper/webXR/webXRExperienceHelpers
    const xrOptions = new WebXRDefaultExperienceOptions();
    xrOptions.floorMeshes = [this.ground];
    this.xrExperience = await WebXRDefaultExperience.CreateAsync(this, xrOptions);
  }
}

export default VrSceneBase;
