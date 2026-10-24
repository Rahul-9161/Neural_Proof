/**
 * ProofLens AI — The Evidence Observatory (Three.js Hero)
 * A sculptural, transparent optical verification lens suspended above a precision
 * scientific research caliper, surrounded by floating source documents, claim nodes,
 * restrained orbital structures, and verified connection rays.
 *
 * Palette: Forest Green (#123D32, #205747), Translucent Ivory (#F6F5EF), Electric Lime (#C7F36B).
 */

(function (window) {
  'use strict';

  class EvidenceObservatory {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;

      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.mainGroup = null;
      this.lensGroup = null;
      this.baseGroup = null;
      
      this.orbitNodes = [];
      this.floatingDocuments = [];
      this.connectingLines = [];
      this.particles = null;
      this.pulseRing = null;

      // Interaction state
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetRotY = 0;
      this.targetRotX = 0;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2(-999, -999);
      this.hoveredObject = null;
      this.isPulsing = false;
      this.pulseStartTime = 0;

      this.animationFrameId = null;

      this.init();
    }

    init() {
      if (!this.isWebGLAvailable()) {
        this.renderFallback();
        return;
      }

      const width = this.container.clientWidth || 540;
      const height = this.container.clientHeight || 520;

      // 1. Scene setup
      this.scene = new THREE.Scene();

      // 2. Camera setup - Scientific orthographic-feel perspective
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      this.camera.position.set(0, 0.8, 8.2);
      this.camera.lookAt(0, 0, 0);

      // 3. Renderer with antialiasing and natural transparency
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);

      // 4. Studio Lighting (Warm research laboratory illumination)
      const ambientLight = new THREE.AmbientLight(0xf6f5ef, 2.2);
      this.scene.add(ambientLight);

      // Key Warm Ivory Spotlight
      const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
      keyLight.position.set(5, 8, 6);
      this.scene.add(keyLight);

      // Forest Green Rim Light
      const forestRimLight = new THREE.DirectionalLight(0x205747, 1.8);
      forestRimLight.position.set(-6, -2, -4);
      this.scene.add(forestRimLight);

      // Subtle Electric Lime Reflector
      this.limePointLight = new THREE.PointLight(0xc7f36b, 1.4, 12);
      this.limePointLight.position.set(0, 0.2, 0);
      this.scene.add(this.limePointLight);

      // 5. Main Observatory Hierarchy
      this.mainGroup = new THREE.Group();
      this.scene.add(this.mainGroup);

      this.buildScientificPedestal();
      this.buildSculpturalLens();
      this.buildRestrainedOrbitals();
      this.buildFloatingEvidenceDocuments();
      this.buildInformationDust();
      this.buildPulseWave();

      // 6. Bind User Interaction Events
      this.bindEvents();

      // 7. Start Loop
      this.animate(0);
    }

    isWebGLAvailable() {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

    renderFallback() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="observatory-fallback">
          <div class="fallback-lens-disc">
            <div class="fallback-lens-core"></div>
            <div class="fallback-orbit-ring"></div>
            <div class="fallback-doc-chip top">NEJM 2024</div>
            <div class="fallback-doc-chip bottom">NATURE</div>
          </div>
        </div>
      `;
    }

    /**
     * Precision research caliper base / pedestal
     */
    buildScientificPedestal() {
      this.baseGroup = new THREE.Group();
      this.baseGroup.position.set(0, -2.1, 0);

      // Circular measurement caliper disc
      const baseGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.08, 64);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0xe5ede3,
        roughness: 0.6,
        metalness: 0.2
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      this.baseGroup.add(baseMesh);

      // Forest Green Brass Caliper Ring
      const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 96);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x205747,
        metalness: 0.8,
        roughness: 0.3
      });
      const caliperRing = new THREE.Mesh(ringGeo, ringMat);
      caliperRing.rotation.x = Math.PI / 2;
      caliperRing.position.y = 0.05;
      this.baseGroup.add(caliperRing);

      // Subtle degree tick markers
      const tickMat = new THREE.MeshBasicMaterial({ color: 0x68736b });
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const tickGeo = new THREE.BoxGeometry(0.02, 0.01, 0.16);
        const tick = new THREE.Mesh(tickGeo, tickMat);
        tick.position.set(Math.cos(angle) * 2.1, 0.06, Math.sin(angle) * 2.1);
        tick.rotation.y = -angle;
        this.baseGroup.add(tick);
      }

      this.mainGroup.add(this.baseGroup);
    }

    /**
     * Sculptural, transparent optical lens in translucent ivory and forest green
     */
    buildSculpturalLens() {
      this.lensGroup = new THREE.Group();

      // Double-convex optical glass element
      const lensGeo = new THREE.SphereGeometry(1.42, 64, 64);
      lensGeo.scale(1.0, 1.0, 0.38); // Flattened into precision magnifying lens optic

      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0xfaf9f5,
        transparent: true,
        opacity: 0.82,
        roughness: 0.08,
        metalness: 0.1,
        transmission: 0.92,
        ior: 1.52,
        thickness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
      this.lensMesh = new THREE.Mesh(lensGeo, lensMat);
      this.lensGroup.add(this.lensMesh);

      // Precision Beveled Forest-Green Optical Frame
      const bezelGeo = new THREE.TorusGeometry(1.44, 0.055, 32, 96);
      const bezelMat = new THREE.MeshStandardMaterial({
        color: 0x123d32,
        roughness: 0.35,
        metalness: 0.85
      });
      const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
      this.lensGroup.add(bezelMesh);

      // Subtle Electric Lime Crosshair Aperture
      const crosshairGeo = new THREE.RingGeometry(0.18, 0.20, 32);
      const crosshairMat = new THREE.MeshBasicMaterial({
        color: 0xc7f36b,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      this.aperture = new THREE.Mesh(crosshairGeo, crosshairMat);
      this.aperture.position.z = 0.02;
      this.lensGroup.add(this.aperture);

      // Fine horizontal & vertical sighting hair lines
      const hairMat = new THREE.LineBasicMaterial({ color: 0x205747, transparent: true, opacity: 0.35 });
      const hLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.9, 0, 0.02), new THREE.Vector3(0.9, 0, 0.02)]),
        hairMat
      );
      const vLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.9, 0.02), new THREE.Vector3(0, 0.9, 0.02)]),
        hairMat
      );
      this.lensGroup.add(hLine);
      this.lensGroup.add(vLine);

      this.mainGroup.add(this.lensGroup);
    }

    /**
     * Restrained orbital trajectories & verified claim-evidence lines
     */
    buildRestrainedOrbitals() {
      // 2 Graceful Elliptical Orbit Rings
      const orbitParams = [
        { radiusX: 2.7, radiusY: 2.2, tiltX: 0.35, tiltY: 0.25, color: 0xdde3d9 },
        { radiusX: 3.1, radiusY: 2.5, tiltX: -0.4, tiltY: 0.5, color: 0x205747 }
      ];

      orbitParams.forEach(param => {
        const curve = new THREE.EllipseCurve(0, 0, param.radiusX, param.radiusY, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(96);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color: param.color,
          transparent: true,
          opacity: 0.4
        });
        const orbitLine = new THREE.Line(geo, mat);
        orbitLine.rotation.x = param.tiltX;
        orbitLine.rotation.y = param.tiltY;
        this.mainGroup.add(orbitLine);
      });

      // Claim Nodes on the orbits
      const nodeConfigs = [
        { label: 'Claim 1', status: 'verified', color: 0x237a52, radius: 2.6, angle: 0.6 },
        { label: 'Claim 2', status: 'partial', color: 0xb7791f, radius: 2.8, angle: 2.4 },
        { label: 'Claim 3', status: 'refuted', color: 0xc44545, radius: 2.5, angle: 4.2 }
      ];

      nodeConfigs.forEach((cfg, idx) => {
        const x = Math.cos(cfg.angle) * cfg.radius;
        const z = Math.sin(cfg.angle) * (cfg.radius * 0.7);
        const y = Math.sin(cfg.angle * 1.5) * 0.4;

        const sphereGeo = new THREE.SphereGeometry(0.09, 24, 24);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.3,
          metalness: 0.5,
          emissive: cfg.color,
          emissiveIntensity: 0.25
        });
        const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
        nodeMesh.position.set(x, y, z);
        nodeMesh.userData = { isNode: true, ...cfg };
        this.mainGroup.add(nodeMesh);
        this.orbitNodes.push({ mesh: nodeMesh, ...cfg });

        // Ray line connecting from central lens optic to verified node
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, z)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.45
        });
        const ray = new THREE.Line(lineGeo, lineMat);
        this.mainGroup.add(ray);
        this.connectingLines.push({ ray, targetPos: new THREE.Vector3(x, y, z), origColor: cfg.color });
      });
    }

    /**
     * Floating peer-reviewed evidence source tablets with crisp editorial typography
     */
    buildFloatingEvidenceDocuments() {
      const documents = [
        {
          badge: 'SOURCE C-1',
          journal: 'THE LANCET',
          year: '2024',
          x: 2.4, y: 1.1, z: 1.0,
          rotY: -0.35,
          color: '#237a52'
        },
        {
          badge: 'SOURCE C-2',
          journal: 'NATURE MED',
          year: '2023',
          x: -2.6, y: -0.4, z: 1.4,
          rotY: 0.45,
          color: '#205747'
        },
        {
          badge: 'SOURCE C-3',
          journal: 'CLINICAL TRIAL',
          year: 'REGISTRY',
          x: 1.6, y: -1.2, z: 1.6,
          rotY: -0.2,
          color: '#b7791f'
        }
      ];

      this.floatingDocuments = documents.map(doc => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 130;
        const ctx = canvas.getContext('2d');

        // Crisp White Card surface with soft border
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#DDE3D9';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(8, 8, 284, 114, 16);
        ctx.fill();
        ctx.stroke();

        // Accent top indicator
        ctx.fillStyle = doc.color;
        ctx.beginPath();
        ctx.roundRect(16, 16, 70, 20, 6);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px "IBM Plex Mono", monospace';
        ctx.fillText(doc.badge, 22, 30);

        // Journal Title in Editorial Ink Black
        ctx.fillStyle = '#18211D';
        ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(doc.journal, 16, 68);

        // Subtext / Year
        ctx.fillStyle = '#68736B';
        ctx.font = '12px "IBM Plex Mono", monospace';
        ctx.fillText(`VERIFIED ARCHIVE • ${doc.year}`, 16, 96);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;

        // Card Geometry
        const cardGeo = new THREE.PlaneGeometry(1.25, 0.54);
        const cardMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });
        const cardMesh = new THREE.Mesh(cardGeo, cardMat);
        cardMesh.position.set(doc.x, doc.y, doc.z);
        cardMesh.rotation.y = doc.rotY;
        cardMesh.userData = { isDocument: true, ...doc };

        this.mainGroup.add(cardMesh);

        return {
          mesh: cardMesh,
          initialPos: new THREE.Vector3(doc.x, doc.y, doc.z),
          rotY: doc.rotY,
          floatPhase: Math.random() * Math.PI * 2
        };
      });
    }

    /**
     * Soft particles representing ambient information / verified evidence data
     */
    buildInformationDust() {
      const count = 75;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const ivory = new THREE.Color(0xf6f5ef);
      const lime = new THREE.Color(0xc7f36b);
      const forest = new THREE.Color(0x205747);

      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 1.6 + Math.random() * 2.2;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.7;
        positions[i * 3 + 2] = r * Math.cos(phi);

        const chosen = Math.random() < 0.6 ? ivory : (Math.random() < 0.85 ? lime : forest);
        colors[i * 3] = chosen.r;
        colors[i * 3 + 1] = chosen.g;
        colors[i * 3 + 2] = chosen.b;
      }

      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      dustGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Circular canvas texture for smooth dots
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(8, 8, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      const dustMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        map: texture,
        depthWrite: false
      });

      this.particles = new THREE.Points(dustGeo, dustMat);
      this.mainGroup.add(this.particles);
    }

    /**
     * Soft emerald & lime verification shockwave ripple
     */
    buildPulseWave() {
      const ringGeo = new THREE.RingGeometry(0.1, 0.18, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc7f36b,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      this.pulseRing = new THREE.Mesh(ringGeo, ringMat);
      this.pulseRing.visible = false;
      this.lensGroup.add(this.pulseRing);
    }

    /**
     * Triggers soft scientific verification pulse
     */
    triggerVerificationPulse() {
      this.isPulsing = true;
      this.pulseStartTime = performance.now();
      this.pulseRing.visible = true;
      this.pulseRing.scale.set(1, 1, 1);
      if (this.limePointLight) this.limePointLight.intensity = 3.5;
    }

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.mouseX = x;
        this.mouseY = y;
        this.targetRotY = x * 0.28;
        this.targetRotX = -y * 0.18;

        // Raycasting for interactive hover
        if (this.container) {
          const rect = this.container.getBoundingClientRect();
          this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        }
      });

      this.container.addEventListener('click', (e) => {
        this.triggerVerificationPulse();
      });

      window.addEventListener('resize', () => {
        if (!this.renderer || !this.camera || !this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      });
    }

    animate(time) {
      this.animationFrameId = requestAnimationFrame((t) => this.animate(t));

      if (this.prefersReducedMotion) {
        this.renderer.render(this.scene, this.camera);
        return;
      }

      // 1. Smooth Gentle Lens Rotation & Pointer Parallax
      this.mainGroup.rotation.y += (this.targetRotY - this.mainGroup.rotation.y) * 0.04 + 0.0018;
      this.mainGroup.rotation.x += (this.targetRotX - this.mainGroup.rotation.x) * 0.04;

      // 2. Subtle Lens Axis Precession
      if (this.lensGroup) {
        this.lensGroup.rotation.y = Math.sin(time * 0.0008) * 0.15;
        this.lensGroup.rotation.z = Math.cos(time * 0.0006) * 0.08;
      }

      // 3. Floating Source Document Dynamics
      this.floatingDocuments.forEach((doc, i) => {
        const floatY = Math.sin(time * 0.0015 + doc.floatPhase) * 0.12;
        doc.mesh.position.y = doc.initialPos.y + floatY;
        // Make documents face slightly towards camera
        doc.mesh.lookAt(this.camera.position.x * 0.5, this.camera.position.y, this.camera.position.z);
      });

      // 4. Ambient Information Dust gentle drift
      if (this.particles) {
        this.particles.rotation.y += 0.0008;
      }

      // 5. Verification Shockwave Pulse
      if (this.isPulsing) {
        const elapsed = (performance.now() - this.pulseStartTime) / 1000;
        const duration = 0.9;

        if (elapsed < duration) {
          const progress = elapsed / duration;
          this.pulseRing.scale.set(1 + progress * 16, 1 + progress * 16, 1);
          this.pulseRing.material.opacity = (1 - progress) * 0.75;
        } else {
          this.isPulsing = false;
          this.pulseRing.visible = false;
          if (this.limePointLight) this.limePointLight.intensity = 1.4;
        }
      }

      // 6. Aperture rotation
      if (this.aperture) {
        this.aperture.rotation.z -= 0.004;
      }

      // 7. Render
      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      if (this.renderer) this.renderer.dispose();
    }
  }

  window.ProofLensHero3D = EvidenceObservatory;

})(window);
