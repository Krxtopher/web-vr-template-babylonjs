import { Engine } from '@babylonjs/core';
import DemoScene from './DemoScene';
import './index.css';

function startScene() {
  // Initialize the BabylonJS engine.
  const renderCanvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  const engine = new Engine(renderCanvas, true, { stencil: true, preserveDrawingBuffer: true });
  engine.enableOfflineSupport = false;
  window.addEventListener('resize', () => engine.resize());

  // Create the demo scene.
  const scene = new DemoScene(engine);
  engine.runRenderLoop(() => scene.render());
}

startScene();
