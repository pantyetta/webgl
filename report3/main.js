const canvas = document.querySelector("#myCanvas");

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x2e2e2e);

// マウス座標管理用のベクトルを作成
const mouse = new THREE.Vector2();

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

const box_geometry = new THREE.BoxBufferGeometry(1, 1, 1);

// マウスとの交差を調べたいものは配列に格納する
const meshList = [];
for (let i = 0; i < 20; i++) {
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const mesh = new THREE.Mesh(box_geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 50;
  mesh.position.y = (Math.random()) * 10;
  mesh.position.z = (Math.random() - 0.5) * 50;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  scene.add(mesh);

  // 配列に保存
  meshList.push(mesh);
}

// レイキャストを作成
const raycaster = new THREE.Raycaster();

canvas.addEventListener("click", handleMouseMove);

// マウスを動かしたときのイベント
function handleMouseMove(event) {
  const element = event.currentTarget;
  // canvas要素上のXY座標
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  // canvas要素の幅・高さ
  const w = element.offsetWidth;
  const h = element.offsetHeight;

  // -1〜+1の範囲で現在のマウス座標を登録する
  mouse.x = (x / w) * 2 - 1;
  mouse.y = -(y / h) * 2 + 1;
}

// 毎フレーム時に実行されるループイベントです
function tick() {
    // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    raycaster.setFromCamera(mouse, camera);

    // その光線とぶつかったオブジェクトを得る
    const intersects = raycaster.intersectObjects(meshList);

    meshList.map((mesh) => {
      // 交差しているオブジェクトが1つ以上存在し、
      // 交差しているオブジェクトの1番目(最前面)のものだったら
      if (intersects.length > 0 && mesh === intersects[0].object) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();



window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};