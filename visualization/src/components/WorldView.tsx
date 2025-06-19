import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useWebSocket } from '../websocket/client';
import { AgentMesh } from '../three/AgentMesh';
import { HouseMesh } from '../three/HouseMesh';
import { ResourceMesh } from '../three/ResourceMesh';

interface WorldViewProps {
  width: number;
  height: number;
  onAgentClick?: (agentId: string) => void;
}

export const WorldView: React.FC<WorldViewProps> = ({ width, height, onAgentClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const agentMeshes = useRef<Map<string, AgentMesh>>(new Map());
  const houseMeshes = useRef<Map<string, HouseMesh>>(new Map());
  const resourceMeshes = useRef<Map<string, ResourceMesh>>(new Map());
  
  const { worldState } = useWebSocket();
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 50, 100);
    
    const camera = new THREE.PerspectiveCamera(
      75, width / height, 0.1, 1000
    );
    camera.position.set(20, 20, 20);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x3a5f3a
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Raycaster for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      const agentMeshArray = Array.from(agentMeshes.current.values()).map(a => a.mesh);
      const intersects = raycaster.intersectObjects(agentMeshArray);
      
      if (intersects.length > 0 && onAgentClick) {
        const clicked = intersects[0].object;
        for (const [id, agentMesh] of agentMeshes.current.entries()) {
          if (agentMesh.mesh === clicked) {
            onAgentClick(id);
            break;
          }
        }
      }
    };
    
    renderer.domElement.addEventListener('click', handleClick);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Update world objects based on state
      if (worldState) {
        // Update agents
        if (worldState.agents) {
          Object.entries(worldState.agents).forEach(([id, agent]: [string, any]) => {
            let agentMesh = agentMeshes.current.get(id);
            if (!agentMesh) {
              agentMesh = new AgentMesh(id, agent.name);
              scene.add(agentMesh.mesh);
              agentMeshes.current.set(id, agentMesh);
            }
            agentMesh.updatePosition(agent.position);
            agentMesh.updateNeeds(agent.needs);
          });
        }
        
        // Update houses
        if (worldState.houses) {
          Object.entries(worldState.houses).forEach(([id, house]: [string, any]) => {
            if (!houseMeshes.current.has(id)) {
              const houseMesh = new HouseMesh(house);
              scene.add(houseMesh.mesh);
              houseMeshes.current.set(id, houseMesh);
            }
          });
        }
        
        // Update resources
        if (worldState.resources) {
          Object.entries(worldState.resources).forEach(([id, resource]: [string, any]) => {
            if (!resourceMeshes.current.has(id)) {
              const resourceMesh = new ResourceMesh(resource);
              scene.add(resourceMesh.mesh);
              resourceMeshes.current.set(id, resourceMesh);
            }
          });
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('click', handleClick);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [width, height, worldState, onAgentClick]);
  
  return <div ref={mountRef} style={{ width, height }} />;
};