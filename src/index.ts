import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  GammaCorrectionPlugin,
  AssetManagerBasicPopupPlugin,

  // Color, // Import THREE.js internals
  // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: false,
  });

  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;

  // Add some plugins
  const manager = await viewer.addPlugin(AssetManagerPlugin);

  // Add a popup(in HTML) with download progress when any asset is downloading.
  await viewer.addPlugin(AssetManagerBasicPopupPlugin);

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(true));
  await viewer.addPlugin(GammaCorrectionPlugin);
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  await viewer.addPlugin(BloomPlugin);

  // This must be called once after all plugins are added.
  viewer.renderer.refreshPipeline();

  // Import and add a GLB file.
  await viewer.load("./assets/3d.zip");

  function setupScrollAnimation() {
    const tl = gsap.timeline();

    //First section

    tl.to(position, {
      x: 1,
      y: 1,
      z: 1,
      scrollTrigger: {
        trigger: ".section-two",
        start: "top bottom",
        end: "top top",
        scrub: 2,
        immediateRender: false,
      },
      onUpdate,
    }).to(target, {
      x: 3.7086320317,
      y: -0.2239182218,
      z: -5.5107544031,
      scrollTrigger: {
        trigger: ".section-two",
        start: "top bottom",
        end: "top top",
        scrub: 2,
        immediateRender: false,
      },
    });
  }

  setupScrollAnimation();

  //webgi update

  let needsUpdate = true;

  function onUpdate() {
    needsUpdate = true;
    viewer.renderer.resetShadows();
  }

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionUpdated(false);
      camera.targetUpdated(true);
      needsUpdate = false;
    }
  });
}

setupViewer();
