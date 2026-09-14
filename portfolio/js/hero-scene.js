import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function createCore() {

	const sculpture = new THREE.Group();
	const material = new THREE.MeshPhysicalMaterial( {
		color: 0x8070ef, metalness: 0.92, roughness: 0.23,
		clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.5
	} );
	const geometry = new RoundedBoxGeometry( 2.75, 0.54, 0.54, 4, 0.23 );
	const frame = new THREE.Group();
	for ( let index = 0; index < 4; index ++ ) {

		const beam = new THREE.Mesh( geometry, material );
		const vertical = index % 2 === 1;
		beam.rotation.z = vertical ? Math.PI / 2 : 0;
		beam.position.set( vertical ? ( index === 1 ? 1.1 : - 1.1 ) : 0, vertical ? 0 : ( index === 0 ? 1.1 : - 1.1 ), 0 );
		frame.add( beam );

	}

	const secondFrame = frame.clone();
	secondFrame.rotation.set( Math.PI / 2, Math.PI / 4, 0 );
	secondFrame.scale.setScalar( 0.82 );
	sculpture.add( frame, secondFrame );
	const pearl = new THREE.Mesh( new THREE.SphereGeometry( 0.4, 32, 24 ), new THREE.MeshPhysicalMaterial( {
		color: 0xd9e4ff, metalness: 0.8, roughness: 0.12, clearcoat: 1
	} ) );
	sculpture.add( pearl );
	sculpture.rotation.set( 0.36, - 0.42, - 0.32 );
	return sculpture;

}

export function initHeroScene( canvas ) {

	const reducedMotion = matchMedia( '(prefers-reduced-motion: reduce)' );
	const renderer = new THREE.WebGLRenderer( { canvas, antialias: true, alpha: true } );
	renderer.setPixelRatio( Math.min( devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5 ) );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.3;
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 35, 1, 0.1, 30 );
	camera.position.z = 7.7;
	const room = new RoomEnvironment();
	const pmrem = new THREE.PMREMGenerator( renderer );
	const environment = pmrem.fromScene( room, 0.04 );
	scene.environment = environment.texture;
	room.dispose();
	pmrem.dispose();
	const core = createCore();
	scene.add( core );
	const key = new THREE.DirectionalLight( 0xe5dcff, 4 );
	key.position.set( - 3, 4, 5 );
	scene.add( key );
	const rim = new THREE.PointLight( 0x7667ff, 28 );
	rim.position.set( 2, - 1, 3 );
	scene.add( rim );
	const pointer = new THREE.Vector2();
	const target = new THREE.Vector2();
	let frame = 0;
	let visible = true;
	let disposed = false;
	let elapsed = 0;
	let previous = performance.now();

	function draw( time = performance.now() ) {

		frame = 0;
		if ( disposed ) return;
		elapsed += Math.min( ( time - previous ) / 1000, 0.05 );
		previous = time;
		pointer.lerp( target, 0.05 );
		if ( ! reducedMotion.matches ) {

			core.rotation.set( 0.36 + pointer.y * 0.22 + Math.sin( elapsed * 0.18 ) * 0.12, - 0.42 + pointer.x * 0.32 + Math.sin( elapsed * 0.14 ) * 0.22, - 0.32 );
			core.position.y = Math.sin( elapsed * 0.65 ) * 0.1;

		}

		renderer.render( scene, camera );
		if ( visible && ! document.hidden && ! reducedMotion.matches ) frame = requestAnimationFrame( draw );

	}

	function resume() {

		cancelAnimationFrame( frame );
		previous = performance.now();
		if ( visible && ! document.hidden ) draw();

	}

	function resize() {

		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		renderer.setSize( width, height, false );
		camera.aspect = width / Math.max( height, 1 );
		camera.updateProjectionMatrix();
		resume();

	}

	function move( event ) {

		if ( reducedMotion.matches ) return;
		const bounds = canvas.getBoundingClientRect();
		target.set( ( event.clientX - bounds.left ) / bounds.width * 2 - 1, ( event.clientY - bounds.top ) / bounds.height * 2 - 1 );

	}

	function leave() {

		target.set( 0, 0 );

	}

	const observer = new IntersectionObserver( ( entries ) => {

		visible = entries[ 0 ].isIntersecting;
		resume();

	} );
	const resizeObserver = new ResizeObserver( resize );
	observer.observe( canvas );
	resizeObserver.observe( canvas );
	canvas.addEventListener( 'pointermove', move, { passive: true } );
	canvas.addEventListener( 'pointerleave', leave );
	document.addEventListener( 'visibilitychange', resume );
	reducedMotion.addEventListener( 'change', resume );
	resize();
	canvas.closest( '.core-visual' ).classList.add( 'is-ready' );

	return () => {

		disposed = true;
		cancelAnimationFrame( frame );
		observer.disconnect();
		resizeObserver.disconnect();
		canvas.removeEventListener( 'pointermove', move );
		canvas.removeEventListener( 'pointerleave', leave );
		document.removeEventListener( 'visibilitychange', resume );
		reducedMotion.removeEventListener( 'change', resume );
		const resources = new Set();
		scene.traverse( ( object ) => {

			if ( object.geometry ) resources.add( object.geometry );
			if ( object.material ) resources.add( object.material );

		} );
		resources.forEach( ( resource ) => resource.dispose() );
		environment.dispose();
		renderer.dispose();

	};

}
