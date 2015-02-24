var mainScene, camera, renderer, controls;
var container;
var loader;
var w = window.innerWidth;
var h = window.innerHeight;
var mouseX, mouseY;
var mapMouseX, mapMouseY;
var FBObject1, FBObject2, FBObject3;
var globalUniforms;
initScene();
function initScene(){
	container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, w / h, 1, 100000);
    camera.position.set(0,0, 2000);
    cameraRTT = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, -10000, 10000 );
	cameraRTT.position.z = 100;
	controls = new THREE.OrbitControls(camera);

	renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff, 1);
    container.appendChild(renderer.domElement);


    mainScene = new THREE.Scene();

    FBObject1 = new FBObject();
	FBObject2 = new FBObject();
	FBObject3 = new FBObject();

	FBObject1.mainScene = mainScene;
	FBObject2.mainScene = mainScene;

	FBObject1.texture = "textures/1.jpg";
	FBObject2.texture = "textures/1.jpg";

	FBObject1.w = w;
	FBObject2.w = w;
	FBObject1.h = h;
	FBObject2.h = h;
	FBObject1.x = 1000;
	FBObject2.x = -1000;
	FBObject1.vertexShader = "vs";
	FBObject2.vertexShader = "vs";
	FBObject1.fragmentShader1 = "fs";
	FBObject2.fragmentShader1 = "syrup-fs";
	FBObject1.fragmentShader2 = "fs-2";
	FBObject2.fragmentShader2 = "syrup-fs-2";

    globalUniforms = {
		time: { type: "f", value: 0.0 } ,
		resolution: {type: "v2", value: new THREE.Vector2(w,h)},
		step_w: {type: "f", value: 1/w},
		step_h: {type: "f", value: 1/h},
		mouseX: {type: "f", value: 1.0},
		mouseY: {type: "f", value: 1.0},
		tv_resolution: {type: "f", value: 640.0},
		tv_resolution_y: {type: "f", value: 1600.0}
	}
	FBObject1.uniforms = globalUniforms;
	FBObject2.uniforms = globalUniforms;

	FBObject1.init(w,h);
	FBObject2.init(w,h);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);

	// var geometry = new THREE.BoxGeometry(1000,1000,1000);
	// var material = new THREE.MeshBasicMaterial({color:0xff0000});
	// var mesh = new THREE.Mesh(geometry, material);
	// mesh.position.set(0,0,0);
	// mainScene.add(mesh);

    addLights();
    // onWindowResize();
	animate();

}
function addLights(){
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	mainScene.add(hemiLight)
}
function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}

function onDocumentMouseMove(event){
	mouseX = (event.clientX );
    mouseY = (event.clientY );
    mapMouseX = map(mouseX, window.innerWidth, -1.0,1.0);
    mapMouseY = map(mouseY, window.innerHeight, -1.0,1.0);
    resX = map(mouseX, window.innerWidth, 4000.0,2000.0);
    resY = map(mouseX, window.innerWidth, 10000.0,1600.0);
	globalUniforms.mouseX.value = mapMouseX;
	globalUniforms.mouseX.value = mapMouseX;
	globalUniforms.mouseY.value = mapMouseY;
	globalUniforms.mouseY.value = mapMouseY;
	globalUniforms.tv_resolution.value = resX;
	globalUniforms.tv_resolution_y.value = resY;


}
function onWindowResize( event ) {
	globalUniforms.resolution.value.x = window.innerWidth;
	globalUniforms.resolution.value.y = window.innerHeight;
	globalUniforms.resolution.value.x = window.innerWidth;
	globalUniforms.resolution.value.y = window.innerHeight;
	globalUniforms.resolution.value.x = window.innerWidth;
	globalUniforms.resolution.value.y = window.innerHeight;
	globalUniforms.resolution.value.x = window.innerWidth;
	globalUniforms.resolution.value.y = window.innerHeight;
	w = window.innerWidth;
	h = window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown(event){
	FBObject1.getFrame(cameraRTT);
	FBObject2.getFrame(cameraRTT);
}
var inc = 0;
var addFrames = true;
var translate = false;
var time = 0;
function render(){

	controls.update();

	time +=0.01;
    camera.lookAt(mainScene.position);

	globalUniforms.time.value = time;
	globalUniforms.time.value = time;
	globalUniforms.time.value = time;
	globalUniforms.time.value = time;

    FBObject1.passTex();
    FBObject2.passTex();


    inc++
	if(inc >= 10){
		addFrames = false;
	}
	if(addFrames){
		FBObject1.getFrame(cameraRTT);
		FBObject2.getFrame(cameraRTT);
		translate = true;
	}
	if(translate = true){
		FBObject1.scale(1.1);
		FBObject2.scale(1.01);
	}

	FBObject1.render(cameraRTT);
	FBObject2.render(cameraRTT);
	renderer.render(mainScene, camera);

	FBObject1.cycle();globalUniforms
	FBObject2.cycle();


}
function animate(){
	window.requestAnimationFrame(animate);
	render();

}