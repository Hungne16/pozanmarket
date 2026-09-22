import { ConvexClient, ConvexHttpClient } from 'convex/browser';
import { makeFunctionReference } from 'convex/server';

const backendUrl = import.meta.env.VITE_CONVEX_URL;
const client = backendUrl ? new ConvexHttpClient( backendUrl ) : null;
let liveClient = null;

const functions = {
	getSettings: makeFunctionReference( 'settings:get' ),
	saveSettings: makeFunctionReference( 'settings:save' ),
	createOrder: makeFunctionReference( 'orders:create' ),
	listOrders: makeFunctionReference( 'orders:list' ),
	updateOrder: makeFunctionReference( 'orders:update' ),
	removeOrder: makeFunctionReference( 'orders:remove' ),
	clearOrders: makeFunctionReference( 'orders:clear' )
};

function requireClient() {

	if ( ! client ) throw new Error( 'Convex is not configured. Add VITE_CONVEX_URL.' );
	return client;

}

export function isBackendConfigured() {

	return Boolean( client );

}

export async function loadRemoteSettings() {

	if ( ! client ) return null;
	return await client.query( functions.getSettings, {} );

}

export async function saveRemoteSettings( key, value, adminKey ) {

	return await requireClient().mutation( functions.saveSettings, { key, value, adminKey } );

}

export async function createRemoteOrder( order ) {

	return await requireClient().mutation( functions.createOrder, { order } );

}

export async function loadRemoteOrders( adminKey ) {

	return await requireClient().query( functions.listOrders, { adminKey } );

}

export function subscribeRemoteOrders( adminKey, onOrders, onError = console.error ) {

	if ( ! backendUrl ) return () => {};
	liveClient ||= new ConvexClient( backendUrl, { unsavedChangesWarning: false } );
	return liveClient.onUpdate( functions.listOrders, { adminKey }, onOrders, onError );

}

export async function updateRemoteOrder( id, updates, adminKey ) {

	return await requireClient().mutation( functions.updateOrder, { id, updates, adminKey } );

}

export async function removeRemoteOrder( id, adminKey ) {

	return await requireClient().mutation( functions.removeOrder, { id, adminKey } );

}

export async function clearRemoteOrders( adminKey ) {

	return await requireClient().mutation( functions.clearOrders, { adminKey } );

}
