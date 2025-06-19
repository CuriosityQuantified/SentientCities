import * as THREE from 'three';

export class HouseMesh {
  mesh: THREE.Group;
  
  constructor(house: any) {
    this.mesh = new THREE.Group();
    
    // House base
    const baseGeometry = new THREE.BoxGeometry(5, 3, 5);
    const baseMaterial = new THREE.MeshLambertMaterial({ 
      color: house.color === 'red' ? 0xff6b6b : 0x4ecdc4 
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1.5;
    base.castShadow = true;
    base.receiveShadow = true;
    this.mesh.add(base);
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(4, 2, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8b4513 
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 4;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    roof.receiveShadow = true;
    this.mesh.add(roof);
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
    const doorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x654321 
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1, 2.5);
    this.mesh.add(door);
    
    // Position house
    this.mesh.position.set(
      house.position.x,
      house.position.y,
      house.position.z
    );
  }
}