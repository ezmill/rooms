var FBObject = function(params){
	this.scene1;
	this.scene2;
	this.w, this.h;
	this.renderTargets = [];
	this.planeGeometry;
	this.mesh1, this.mesh2;
	this.material1, this.material2;
	this.vertexShader, this.fragmentShader1, this.fragmentShader2;
	this.uniforms, this.uniforms1, this.uniforms2;
	this.texture;
	this.model;
	this.mainScene;
	this.x;
	this.init = function(){
		this.initScenes();
		this.initRTTs(this.w, this.h);
		this.planeGeometry = new THREE.PlaneBufferGeometry(this.w, this.h);
		this.initShaders(this.vertexShader, this.fragmentShader1, this.fragmentShader2);
		// this.initUniforms(this.uniforms);
		// this.initTexture(this.texture);
		this.createBackgroundScene();
		this.createFeedbackScene();
		// this.loadModel(this.model);
		this.addObject(this.x);
	}
	this.initScenes = function(){
		this.scene1 = new THREE.Scene();
		this.scene2 = new THREE.Scene();
	}

	this.initRTTs = function(w, h){
		for(var i = 0; i < 2; i++){
			var rtt = new THREE.WebGLRenderTarget(w, h);
			rtt.minFilter = THREE.LinearFilter;
		    rtt.magFilter = THREE.NearestFilter;
		    rtt.format = THREE.RGBFormat;
		    this.renderTargets.push(rtt);
		}
	}
	this.initShaders = function(vs, fs1, fs2){
		this.vertexShader = document.getElementById(vs).textContent;
		this.fragmentShader1 = document.getElementById(fs1).textContent;
		this.fragmentShader2 = document.getElementById(fs2).textContent;
	}

	// this.initUniforms = function(uniforms){
	// 	this.uniforms1 = uniforms;
	// 	this.uniforms2 = uniforms;
	// }

	// this.initTexture = function(textureString){
	// 	var tex = THREE.ImageUtils.loadTexture(textureString);
	// 	this.uniforms1.texture = {type: "t", value: tex }
	// 	this.uniforms2.texture = {type: "t", value: this.renderTargets[0] }
		
	// }

	this.createBackgroundScene = function(){
		var tex = THREE.ImageUtils.loadTexture(this.texture);
		this.uniforms1 = {
			texture: {type: "t", value: tex},
			time: this.uniforms.time,
			resolution: this.uniforms.resolution,
			mouseX: this.uniforms.mouseX,
			mouseY: this.uniforms.mouseY,
			tv_resolution: this.uniforms.tv_resolution,
			tv_resolution_y: this.uniforms.tv_resolution_y
		}
		this.material1 = new THREE.ShaderMaterial( {
			uniforms: this.uniforms1,
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader1
		} );
		console.log(this.material1.uniforms.texture);
		this.mesh1 = new THREE.Mesh( this.planeGeometry, this.material1 );
		this.scene1.add( this.mesh1 );
	}

	this.createFeedbackScene = function(){
		this.uniforms2 = {
			texture: {type: "t", value: this.renderTargets[0]},
			time: this.uniforms.time,
			resolution: this.uniforms.resolution,
			mouseX: this.uniforms.mouseX,
			mouseY: this.uniforms.mouseY,
			tv_resolution: this.uniforms.tv_resolution,
			tv_resolution_y: this.uniforms.tv_resolution_y
		}
		this.material2 = new THREE.ShaderMaterial( {
			uniforms: this.uniforms2,
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader2
		} );
		this.mesh2 = new THREE.Mesh( this.planeGeometry, this.material2 );
		this.scene2.add( this.mesh2 );
	}
	this.createModel = function(geometry, material){
		this.modelMesh = new THREE.Mesh(geometry, material);
		var scale = 10.0;
		modelMesh.position.set(0,0,0);
		modelMesh.scale.set(scale,scale,scale);
		this.mainScene.add(modelMesh);
	}

	this.loadModel = function(model){
		var loader = new THREE.BinaryLoader(true);
		loader.load(model, function(geometry){
			this.createModel(geometry, new THREE.MeshBasicMaterial({map: this.renderTargets[1]}));
		})
	}
	this.addObject = function(x){
		var geometry = new THREE.BoxGeometry(1000,1000,1000);
		var material = new THREE.MeshBasicMaterial({map: this.renderTargets[1]});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x,0,-100);
		this.mainScene.add(mesh);
	}
	this.loadModelMaterial = function(rtt){
		this.modelMaterial = new THREE.MeshBasicMaterial({map: rtt});
	}

	this.passTex = function(){
	    this.material1.uniforms.texture.value = this.material1.uniforms.texture.value;
	    this.material2.uniforms.texture.value = this.renderTargets[0];
	}

	this.getFrame = function(camera){
		renderer.render(this.scene1, camera, this.renderTargets[0], true);
	}
	this.scale = function(scale){
		this.mesh1.scale.set(scale,scale,scale);
		this.mesh2.scale.set(scale,scale,scale);
	}
	this.render = function(camera){
		renderer.render(this.scene2, camera, this.renderTargets[1], true);
		// renderer.render(this.scene2, camera, this.renderTargets[2], true);
	}
	this.cycle = function(){
		var a = this.renderTargets[1];
		this.renderTargets[1] = this.renderTargets[0];
		this.renderTargets[0] = a;
	}
}