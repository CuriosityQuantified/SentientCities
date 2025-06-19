import * as THREE from 'three';

export class ResourceMesh {
  mesh: THREE.Group;
  
  constructor(resource: any) {
    this.mesh = new THREE.Group();
    
    if (resource.type === 'lake') {
      // Create lake
      const lakeGeometry = new THREE.CircleGeometry(resource.radius || 5, 32);
      const lakeMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x006994,
        transparent: true,
        opacity: 0.8
      });
      const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
      lake.rotation.x = -Math.PI / 2;
      lake.position.y = 0.01;
      lake.receiveShadow = true;
      this.mesh.add(lake);
      
      // Add some visual interest with a darker center
      const centerGeometry = new THREE.CircleGeometry(resource.radius * 0.6, 32);
      const centerMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x004d6d,
        transparent: true,
        opacity: 0.9
      });
      const center = new THREE.Mesh(centerGeometry, centerMaterial);
      center.rotation.x = -Math.PI / 2;
      center.position.y = 0.02;
      this.mesh.add(center);
      
    } else if (resource.type === 'plant') {
      // Create plant
      const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5);
      const trunkMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8b4513 
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 0.25;
      trunk.castShadow = true;
      this.mesh.add(trunk);
      
      // Leaves
      const leavesGeometry = new THREE.SphereGeometry(0.5, 8, 6);
      const leavesMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x228b22 
      });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 0.7;
      leaves.scale.y = 0.8;
      leaves.castShadow = true;
      leaves.receiveShadow = true;
      this.mesh.add(leaves);
    }
    
    // Position resource
    this.mesh.position.set(
      resource.position.x,
      resource.position.y,
      resource.position.z
    );
  }
}