self.addEventListener( 'push', ( event ) => {

	let data = {};
	try { data = event.data?.json() || {}; } catch { data = { body: event.data?.text() || '' }; }
	event.waitUntil( self.registration.showNotification( data.title || 'Pozan Market', {
		body: data.body || 'Bạn có cập nhật mới.',
		icon: '/admin-icon.svg',
		badge: '/admin-icon.svg',
		tag: data.tag || 'pozan-update',
		renotify: true,
		data: { url: data.url || '/admin' }
	} ) );

} );

self.addEventListener( 'notificationclick', ( event ) => {

	event.notification.close();
	const target = new URL( event.notification.data?.url || '/admin', self.location.origin ).href;
	event.waitUntil( clients.matchAll( { type: 'window', includeUncontrolled: true } ).then( ( windows ) => {

		const existing = windows.find( ( client ) => client.url.startsWith( self.location.origin ) );
		if ( existing ) return existing.navigate( target ).then( () => existing.focus() );
		return clients.openWindow( target );

	} ) );

} );
