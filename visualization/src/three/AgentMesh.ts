import * as THREE from 'three';

export class AgentMesh {
  mesh: THREE.Group;
  body: THREE.Mesh;
  nameLabel: THREE.Sprite;
  needsBars: THREE.Group;
  thoughtBubble?: THREE.Sprite;
  
  constructor(public id: string, public name: string) {
    this.mesh = new THREE.Group();
    
    // Create body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ 
      color: id.includes('001') ? 0xff6b6b : 0x4ecdc4 
    });
    this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.mesh.add(this.body);
    
    // Create name label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    
    context.font = 'Bold 48px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(name, 128, 48);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    this.nameLabel = new THREE.Sprite(spriteMaterial);
    this.nameLabel.scale.set(2, 0.5, 1);
    this.nameLabel.position.y = 2.5;
    this.mesh.add(this.nameLabel);
    
    // Create needs bars
    this.needsBars = new THREE.Group();
    this.needsBars.position.y = 2;
    this.mesh.add(this.needsBars);
    
    this.createNeedsBars();
  }
  
  createNeedsBars() {
    const needs = ['hunger', 'thirst', 'energy'];
    const colors = [0xff0000, 0x0066ff, 0xffff00];
    
    needs.forEach((need, index) => {
      const barBg = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x333333 })
      );
      barBg.position.y = index * 0.15;
      this.needsBars.add(barBg);
      
      const bar = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 0.1),
        new THREE.MeshBasicMaterial({ color: colors[index] })
      );
      bar.position.y = index * 0.15;
      bar.position.z = 0.01;
      bar.name = need;
      this.needsBars.add(bar);
    });
  }
  
  updatePosition(position: [number, number, number]) {
    this.mesh.position.set(position[0], position[1] + 1, position[2]);
    
    // Make needs bars face camera
    this.needsBars.lookAt(
      this.needsBars.position.x + 10,
      this.needsBars.position.y,
      this.needsBars.position.z + 10
    );
  }
  
  updateNeeds(needs: any) {
    this.needsBars.children.forEach(child => {
      if (child.name && needs[child.name] !== undefined) {
        const value = needs[child.name] / 100;
        child.scale.x = value;
        child.position.x = (value - 1) * 0.5;
      }
    });
  }
  
  showThought(thought: string) {
    // Create thought bubble sprite
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 256;
    
    // Draw bubble background
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    
    // Bubble shape
    const x = 20, y = 20, w = 472, h = 180;
    const radius = 20;
    
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + w - radius, y);
    context.quadraticCurveTo(x + w, y, x + w, y + radius);
    context.lineTo(x + w, y + h - radius);
    context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    context.lineTo(x + 40, y + h);
    context.lineTo(x + 20, y + h + 30); // Tail
    context.lineTo(x + 50, y + h);
    context.lineTo(x + radius, y + h);
    context.quadraticCurveTo(x, y + h, x, y + h - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    
    context.fill();
    context.stroke();
    
    // Draw text
    context.fillStyle = 'black';
    context.font = '24px Arial';
    
    // Word wrap
    const words = thought.split(' ');
    let line = '';
    let yPos = 60;
    const maxWidth = 440;
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = context.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        context.fillText(line, 40, yPos);
        line = word + ' ';
        yPos += 30;
      } else {
        line = testLine;
      }
    });
    context.fillText(line, 40, yPos);
    
    // Create sprite
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true 
    });
    
    if (this.thoughtBubble) {
      this.mesh.remove(this.thoughtBubble);
    }
    
    this.thoughtBubble = new THREE.Sprite(material);
    this.thoughtBubble.scale.set(5, 2.5, 1);
    this.thoughtBubble.position.set(3, 3, 0);
    this.mesh.add(this.thoughtBubble);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (this.thoughtBubble) {
        this.mesh.remove(this.thoughtBubble);
        this.thoughtBubble = undefined;
      }
    }, 5000);
  }
}