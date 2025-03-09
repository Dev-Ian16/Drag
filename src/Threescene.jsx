import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ThreeScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1, 3); // Adjust initial position

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Load GLTF Model
    const loader = new GLTFLoader();
    const robotUrl = "/assets/Robotics_4.glb"; // Ensure correct path

    loader.load(
      robotUrl,
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0.35, -4, -2);
        model.scale.set(1, 1, 1);
      },
      undefined,
      (error) => console.error("GLTF Loading Error:", error)
    );

    // Function to Create Text
    function createText(text, color, position) {
      // Create a temporary canvas to measure text size
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.font = "30px Arial";

      const textMetrics = tempCtx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = 20; // Approximate text height (30px font size)

      // Add some padding
      const padding = 1;
      const canvasWidth = Math.ceil(textWidth + 2 * padding);
      const canvasHeight = Math.ceil(textHeight + 2 * padding);

      // Create the actual canvas
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");

      // Border radius
      const borderRadius = 10;

      function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }

      // Background with rounded corners
      ctx.fillStyle = "green";
      drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, borderRadius);
      ctx.fill();

      // Text settings
      ctx.font = "20px Arial";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Create texture
      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.PlaneGeometry(canvasWidth / 50, canvasHeight / 50); // Scale appropriately
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });

      // Create Mesh
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.set(position.x, position.y, position.z);

      return textMesh;
    }

    // Create and add text labels to the scene
    const text1 = createText("1", "white", { x: -0.2, y: 1.3, z: -1 });
    const text2 = createText("2", "white", { x: -0.2, y: 0.9, z: -0.5 });
    const text3 = createText("3", "white", { x: 0.65, y: 0.5, z: -1.4 });
    const text4 = createText("4", "white", { x: 0.2, y: 1.3, z: -2.7 });
    const text5 = createText("5", "white", { x: 0.2, y: 0.4, z: 0.5 });
    const text6 = createText("6", "white", { x: 0.9, y: 0.2, z: 1.7 });

    text3.rotation.y = Math.PI / 2;
    scene.add(text1, text2, text3, text4, text5, text6);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smoother controls

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Ensure smooth camera movement
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer to track container size changes
    const resizeObserver = new ResizeObserver(() => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });

    resizeObserver.observe(container);
    renderer.setClearColor(0xffffff);

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%", // Allow dynamic resizing
        border: "1px solid black",
      }}
    />
  );
};

export default ThreeScene;