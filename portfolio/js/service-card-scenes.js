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

function createObject( kind, primary, secondary ) {

	const group = new THREE.Group();
	const panel = new THREE.MeshStandardMaterial( { color: 0x191824, roughness: 0.62, metalness: 0.18 } );
	const solid = makeMaterial( primary );
	const highlight = new THREE.MeshBasicMaterial( { color: secondary, transparent: true, opacity: 0.92 } );
	const muted = new THREE.MeshBasicMaterial( { color: 0x77738a, transparent: true, opacity: 0.7 } );
	const frame = makeMaterial( secondary, true );
	const add = ( geometry, material = solid, position = [ 0, 0, 0 ], rotation = [ 0, 0, 0 ] ) => {

		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( ...position );
		mesh.rotation.set( ...rotation );
		group.add( mesh );
		return mesh;

	};
	const box = ( width, height, depth, x, y, z, material = panel, rotationZ = 0 ) => add( new THREE.BoxGeometry( width, height, depth ), material, [ x, y, z ], [ 0, 0, rotationZ ] );
	const dot = ( radius, x, y, z, material = highlight ) => add( new THREE.CylinderGeometry( radius, radius, 0.025, 20 ), material, [ x, y, z ], [ Math.PI / 2, 0, 0 ] );
	const connect = ( points ) => {

		const geometry = new THREE.BufferGeometry().setFromPoints( points.map( ( point ) => new THREE.Vector3( ...point ) ) );
		const line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: secondary, transparent: true, opacity: 0.6 } ) );
		group.add( line );

	};

	if ( kind === 'website' ) {

		box( 1.7, 1.08, 0.08, - 0.12, 0.03, 0, panel );
		box( 1.7, 0.12, 0.035, - 0.12, 0.51, 0.07, muted );
		[ - 0.81, - 0.73, - 0.65 ].forEach( ( x ) => dot( 0.025, x, 0.51, 0.095 ) );
		box( 0.88, 0.28, 0.035, - 0.37, 0.2, 0.07, solid );
		box( 0.38, 0.28, 0.035, 0.36, 0.2, 0.07, frame );
		[ - 0.54, - 0.1, 0.34 ].forEach( ( x ) => box( 0.34, 0.2, 0.03, x, - 0.26, 0.07, x === - 0.1 ? highlight : muted ) );
		box( 0.46, 0.92, 0.09, 0.82, - 0.17, 0.35, panel, - 0.04 );
		box( 0.31, 0.3, 0.03, 0.82, 0.05, 0.41, solid, - 0.04 );
		box( 0.25, 0.05, 0.025, 0.82, - 0.25, 0.41, highlight, - 0.04 );

	} else if ( kind === 'landing' ) {

		box( 1.02, 1.62, 0.08, 0, 0, 0, panel, - 0.035 );
		box( 0.82, 0.09, 0.03, 0, 0.66, 0.07, muted, - 0.035 );
		box( 0.82, 0.46, 0.03, 0, 0.34, 0.07, solid, - 0.035 );
		box( 0.35, 0.085, 0.035, - 0.22, 0.19, 0.11, highlight, - 0.035 );
		[ - 0.12, - 0.37, - 0.62 ].forEach( ( y, index ) => box( index === 1 ? 0.82 : 0.55, index === 1 ? 0.32 : 0.12, 0.03, 0, y, 0.07, index === 1 ? frame : muted, - 0.035 ) );
		[ 0.72, 0.54, 0.36, 0.18, 0, - 0.18, - 0.36, - 0.54 ].forEach( ( y, index ) => dot( index === 0 ? 0.035 : 0.018, 0.72, y, 0.14, index < 3 ? highlight : muted ) );

	} else if ( kind === 'uiux' ) {

		[ - 0.62, 0, 0.62 ].forEach( ( x, index ) => {

			box( 0.52, 1.15, 0.08, x, index === 1 ? 0.08 : - 0.03, index === 1 ? 0.18 : 0, index === 1 ? panel : frame, ( index - 1 ) * 0.045 );
			box( 0.36, 0.22, 0.025, x, index === 1 ? 0.3 : 0.2, index === 1 ? 0.24 : 0.07, index === 1 ? solid : muted, ( index - 1 ) * 0.045 );
			[ 0.02, - 0.17, - 0.36 ].forEach( ( y, row ) => box( row === 2 ? 0.2 : 0.34, 0.055, 0.02, x, y + ( index === 1 ? 0.08 : 0 ), index === 1 ? 0.24 : 0.07, row === 2 ? highlight : muted, ( index - 1 ) * 0.045 ) );

		} );
		connect( [ [ - 0.34, 0.46, 0.1 ], [ - 0.08, 0.58, 0.2 ], [ 0.33, 0.48, 0.1 ] ] );

	} else if ( kind === 'presentation' ) {

		[ - 0.22, 0, 0.22 ].forEach( ( offset, index ) => {

			const z = index * 0.13;
			const rotation = ( index - 1 ) * 0.07;
			box( 1.55, 0.88, 0.055, offset, offset * 0.35, z, index === 2 ? panel : frame, rotation );
			box( 0.62, 0.1, 0.025, offset - 0.31, 0.22 + offset * 0.35, z + 0.05, index === 2 ? highlight : muted, rotation );
			box( 0.55, 0.42, 0.025, offset + 0.3, - 0.08 + offset * 0.35, z + 0.05, index === 2 ? solid : muted, rotation );

		} );

	} else if ( kind === 'canva' ) {

		box( 1.05, 1.05, 0.07, 0, 0, 0.16, panel );
		box( 0.86, 0.38, 0.03, 0, 0.23, 0.22, solid );
		box( 0.58, 0.085, 0.025, - 0.1, - 0.13, 0.22, highlight );
		box( 0.4, 0.055, 0.025, - 0.19, - 0.29, 0.22, muted );
		box( 0.52, 0.86, 0.06, - 0.76, - 0.08, - 0.02, frame, - 0.11 );
		box( 0.7, 0.7, 0.06, 0.72, 0.18, - 0.02, frame, 0.1 );
		[ [ - 0.52, 0.52 ], [ 0.52, 0.52 ], [ - 0.52, - 0.52 ], [ 0.52, - 0.52 ] ].forEach( ( [ x, y ] ) => dot( 0.035, x, y, 0.27, highlight ) );

	} else if ( kind === 'poster' ) {

		box( 1.08, 1.5, 0.075, 0, 0, 0, panel, 0.035 );
		box( 0.86, 0.5, 0.03, 0, 0.35, 0.07, solid, 0.035 );
		add( new THREE.RingGeometry( 0.17, 0.25, 32 ), highlight, [ 0.23, 0.37, 0.115 ], [ 0, 0, 0.035 ] );
		box( 0.72, 0.12, 0.03, - 0.05, 0.02, 0.07, highlight, 0.035 );
		box( 0.6, 0.09, 0.03, - 0.11, - 0.18, 0.07, muted, 0.035 );
		[ - 0.42, - 0.54 ].forEach( ( y, index ) => box( index ? 0.46 : 0.72, 0.045, 0.025, - 0.12, y, 0.07, muted, 0.035 ) );

	} else {

		box( 1.55, 0.96, 0.07, 0, 0, 0, panel );
		[ [ - 0.5, 0.25 ], [ 0, 0.34 ], [ 0.5, 0.18 ], [ - 0.38, - 0.28 ], [ 0.28, - 0.3 ] ].forEach( ( [ x, y ], index ) => {

			dot( index === 1 ? 0.13 : 0.09, x, y, 0.12, index === 1 ? solid : highlight );

		} );
		connect( [ [ - 0.5, 0.25, 0.11 ], [ 0, 0.34, 0.11 ], [ 0.5, 0.18, 0.11 ], [ 0.28, - 0.3, 0.11 ], [ - 0.38, - 0.28, 0.11 ], [ - 0.5, 0.25, 0.11 ] ] );
		box( 0.38, 0.1, 0.025, 0, - 0.02, 0.12, muted );

	}
	group.rotation.set( - 0.08, 0.08, 0 );
	group.userData.materials = [ panel, solid, highlight, muted, frame ];
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
		const object = createObject( canvas.dataset.serviceScene, primary, secondary );
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
			const targetY = 0.08 + state.pointerX + Math.sin( time * 0.52 + index ) * 0.09;
			const targetX = - 0.08 - state.pointerY + Math.cos( time * 0.44 + index ) * 0.04;
			state.object.rotation.y += ( targetY - state.object.rotation.y ) * 0.035;
			state.object.rotation.x += ( targetX - state.object.rotation.x ) * 0.04;
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
