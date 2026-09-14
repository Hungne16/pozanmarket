import * as THREE from 'three';

const PALETTE = [
	[ 0x8b78ff, 0x60e6ed ],
	[ 0xff8c5f, 0xb868ff ],
	[ 0x5ed8ff, 0x7667ff ],
	[ 0xffc768, 0xff6ca8 ],
	[ 0x8df0c8, 0x6f7dff ],
	[ 0xff756f, 0xffbc5d ],
	[ 0xc0a6ff, 0x62dfe8 ]
];

function makeMaterial( color, wireframe = false ) {

	return new THREE.MeshStandardMaterial( {
		color,
		roughness: wireframe ? 0.42 : 0.23,
		metalness: wireframe ? 0.45 : 0.78,
		wireframe,
		transparent: true,
		opacity: wireframe ? 0.48 : 0.92
	} );

}

function createObject( index, primary, secondary ) {

	const group = new THREE.Group();
	const solid = makeMaterial( primary );
	const wire = makeMaterial( secondary, true );
	const add = ( geometry, material = solid, position = [ 0, 0, 0 ], rotation = [ 0, 0, 0 ] ) => {

		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( ...position );
		mesh.rotation.set( ...rotation );
		group.add( mesh );
		return mesh;

	};

	switch ( index % 7 ) {

		case 0:
			add( new THREE.BoxGeometry( 1.45, 0.92, 0.14 ), wire, [ 0, 0.05, 0 ], [ 0.08, - 0.28, - 0.08 ] );
			add( new THREE.BoxGeometry( 1.1, 0.62, 0.12 ), solid, [ 0.2, - 0.08, 0.28 ], [ 0.08, - 0.28, - 0.08 ] );
			add( new THREE.TorusGeometry( 0.52, 0.015, 8, 72 ), wire, [ 0.05, 0.02, 0.12 ], [ 1.3, 0.15, 0.4 ] );
			break;
		case 1:
			add( new THREE.TorusKnotGeometry( 0.48, 0.14, 96, 12, 2, 3 ), solid, [ 0, 0, 0 ], [ 0.25, 0.2, 0 ] );
			add( new THREE.TorusGeometry( 0.8, 0.012, 6, 80 ), wire, [ 0, 0, 0 ], [ 1.2, 0.1, 0.2 ] );
			break;
		case 2:
			add( new THREE.IcosahedronGeometry( 0.65, 1 ), wire );
			add( new THREE.SphereGeometry( 0.34, 24, 16 ), solid, [ 0.08, - 0.02, 0.06 ] );
			break;
		case 3:
			[ - 0.42, - 0.14, 0.14, 0.42 ].forEach( ( x, layer ) => add( new THREE.BoxGeometry( 0.82, 1.08, 0.065 ), layer % 2 ? solid : wire, [ x, layer * 0.055 - 0.08, layer * 0.11 ], [ 0.12, - 0.22, - 0.14 ] ) );
			break;
		case 4:
			add( new THREE.TorusGeometry( 0.52, 0.19, 20, 64 ), solid, [ 0, 0, 0 ], [ 0.75, 0.2, 0.15 ] );
			add( new THREE.OctahedronGeometry( 0.34, 0 ), wire, [ 0.05, 0.05, 0.18 ] );
			break;
		case 5:
			add( new THREE.OctahedronGeometry( 0.65, 0 ), solid, [ - 0.08, 0, 0 ], [ 0.35, 0.4, 0.2 ] );
			add( new THREE.TorusGeometry( 0.78, 0.018, 8, 64 ), wire, [ 0, 0, 0 ], [ 1.15, 0.2, 0 ] );
			break;
		default: {

			const geometry = new THREE.BufferGeometry();
			const positions = [];
			for ( let point = 0; point < 90; point ++ ) {

				const radius = 0.28 + ( point % 13 ) * 0.04;
				const angle = point * 2.399;
				positions.push( Math.cos( angle ) * radius, Math.sin( angle * 1.35 ) * radius * 0.7, Math.sin( angle ) * radius );

			}
			geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
			const points = new THREE.Points( geometry, new THREE.PointsMaterial( { color: primary, size: 0.045, transparent: true, opacity: 0.9 } ) );
			group.add( points );
			add( new THREE.IcosahedronGeometry( 0.4, 1 ), wire );

		}

	}
	group.userData.materials = [ solid, wire ];
	return group;

}

export function initializeServiceCardScenes( container ) {

	const canvases = [ ...container.querySelectorAll( '[data-service-scene]' ) ];
	if ( ! canvases.length || ! window.WebGLRenderingContext ) return () => {};
	const reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	const scenes = canvases.map( ( canvas, index ) => {

		const renderer = new THREE.WebGLRenderer( { canvas, alpha: true, antialias: true, powerPreference: 'low-power' } );
		renderer.setPixelRatio( Math.min( window.devicePixelRatio, 1.5 ) );
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera( 32, 1, 0.1, 20 );
		camera.position.set( 0, 0, 4.2 );
		const [ primary, secondary ] = PALETTE[ index % PALETTE.length ];
		const object = createObject( index, primary, secondary );
		scene.add( object );
		scene.add( new THREE.HemisphereLight( 0xffffff, 0x171224, 2.2 ) );
		const key = new THREE.PointLight( secondary, 16, 8 );
		key.position.set( 2.4, 1.8, 3 );
		scene.add( key );
		const state = { canvas, renderer, scene, camera, object, active: false, pointerX: 0, pointerY: 0 };
		const card = canvas.closest( '.service-card' );
		card.addEventListener( 'pointermove', ( event ) => {

			const bounds = card.getBoundingClientRect();
			state.pointerX = ( ( event.clientX - bounds.left ) / bounds.width - 0.5 ) * 0.7;
			state.pointerY = ( ( event.clientY - bounds.top ) / bounds.height - 0.5 ) * 0.45;

		}, { passive: true } );
		return state;

	} );

	const resize = new ResizeObserver( ( entries ) => {

		entries.forEach( ( entry ) => {

			const state = scenes.find( ( item ) => item.canvas === entry.target );
			if ( ! state ) return;
			const width = Math.max( 1, Math.round( entry.contentRect.width ) );
			const height = Math.max( 1, Math.round( entry.contentRect.height ) );
			state.renderer.setSize( width, height, false );
			state.camera.aspect = width / height;
			state.camera.updateProjectionMatrix();
			state.renderer.render( state.scene, state.camera );

		} );

	} );
	const visibility = new IntersectionObserver( ( entries ) => entries.forEach( ( entry ) => {

		const state = scenes.find( ( item ) => item.canvas === entry.target );
		if ( state ) state.active = entry.isIntersecting;

	} ), { rootMargin: '120px' } );
	scenes.forEach( ( state ) => {

		resize.observe( state.canvas );
		visibility.observe( state.canvas );

	} );
	let frame = 0;
	const start = performance.now();
	function render( now ) {

		const time = ( now - start ) * 0.001;
		scenes.forEach( ( state, index ) => {

			if ( ! state.active && ! reducedMotion ) return;
			state.object.rotation.y += ( state.pointerX + time * ( 0.16 + index * 0.008 ) - state.object.rotation.y ) * 0.035;
			state.object.rotation.x += ( - state.pointerY + Math.sin( time * 0.55 + index ) * 0.08 - state.object.rotation.x ) * 0.04;
			state.object.position.y = Math.sin( time * 0.72 + index ) * 0.055;
			state.renderer.render( state.scene, state.camera );

		} );
		if ( ! reducedMotion ) frame = requestAnimationFrame( render );

	}
	frame = requestAnimationFrame( render );
	return () => {

		cancelAnimationFrame( frame );
		resize.disconnect();
		visibility.disconnect();
		scenes.forEach( ( state ) => {

			state.object.traverse( ( child ) => {

				child.geometry?.dispose();
				if ( Array.isArray( child.material ) ) child.material.forEach( ( material ) => material.dispose() );
				else child.material?.dispose();

			} );
			state.renderer.dispose();

		} );

	};

}
