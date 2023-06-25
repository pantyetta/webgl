// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    antialias: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x2e2e2e);

// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set(25, 25, 20);

// orbitControls
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 5, 0 );
controls.update();
controls.enablePan = true;
controls.autoRotate = true;
controls.autoRotateSpeed = .5
controls.enableDamping = true;
controls.dampingFactor = .035

// 平行光源1
var directionalLight1 = new THREE.DirectionalLight(0x3f3f3f);
directionalLight1.position.set(100, 100, 100);
scene.add(directionalLight1);

// 平行光源2
var directionalLight2 = new THREE.DirectionalLight(0x3f3f3f);
directionalLight2.position.set(-100, 100, 100);
scene.add(directionalLight2);

// 平行光源3
var directionalLight3 = new THREE.DirectionalLight(0x1f1f1f);
directionalLight3.position.set(0, 100, -100);
scene.add(directionalLight3);

//照明
// const spotLight = new THREE.SpotLight(0xffffff, 15, 10, Math.PI / 4, 1.5, 2)
const spotLight_bulb = new THREE.PointLight(0xFFFFFF, 5, 3, 1.0);
scene.add(spotLight_bulb)
spotLight_bulb.position.y = 11;

const spotLight = new THREE.SpotLight(0xffffff, 15, 10, Math.PI / 4, 1.5, 2)
scene.add(spotLight)
spotLight.position.y = 11;

// helper
// const gridHelper = new THREE.GridHelper(50, 50); // size, step
// scene.add(gridHelper);

var geometry = new THREE.PlaneGeometry( 50, 50, 24, 24 );
var map1 = THREE.ImageUtils.loadTexture( './img/flooring.png' );
map1.repeat.set( 10, 5 )
map1.wrapS = THREE.RepeatWrapping
map1.wrapT = THREE.RepeatWrapping
var ground = new THREE.Mesh(
    geometry,
    new THREE.MeshLambertMaterial( { map: map1 } )
);

ground.rotation.x = Math.PI / -2;
scene.add( ground );

// desk
const deskgltfLoader = new THREE.GLTFLoader();
deskgltfLoader.load('./desk.glb', function (data) {
  const gltf = data;
  let object = gltf.scene
  scene.add(object);
});

// saboten
const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('./saboten/sabotenlowpori.glb', function (data) {
  const gltf = data;
  let object = gltf.scene
  object.position.y = 5
  scene.add(object);
});


// light
const lightgltfLoader = new THREE.GLTFLoader();
lightgltfLoader.load('./light.glb', function (data) {
  const gltf = data;
  let object = gltf.scene
  object.position.y = 17.5
  scene.add(object);
});



// 毎フレーム時に実行されるループイベントです
function tick() {
    requestAnimationFrame(tick);
    controls.update();

    renderer.render(scene, camera);
}

tick();



window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};