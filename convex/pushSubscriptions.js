import { internalMutation, internalQuery, mutation } from './_generated/server.js';
import { v } from 'convex/values';

function assertAdmin( adminKey ) {

	const configuredKey = process.env.ADMIN_KEY;
	if ( ! configuredKey || adminKey !== configuredKey ) throw new Error( 'Invalid admin key.' );

}

export const register = mutation( {
	args: { adminKey: v.string(), subscription: v.any() },
	handler: async ( ctx, { adminKey, subscription } ) => {

		assertAdmin( adminKey );
		const endpoint = String( subscription?.endpoint || '' );
		if ( ! endpoint.startsWith( 'https://' ) ) throw new Error( 'Invalid push subscription.' );
		const existing = await ctx.db.query( 'pushSubscriptions' ).withIndex( 'by_endpoint', ( queryBuilder ) => queryBuilder.eq( 'endpoint', endpoint ) ).unique();
		const now = Date.now();
		if ( existing ) {

			await ctx.db.patch( existing._id, { subscription, updatedAt: now } );
			return existing._id;

		}
		return await ctx.db.insert( 'pushSubscriptions', { endpoint, subscription, createdAt: now, updatedAt: now } );

	}
} );

export const list = internalQuery( {
	args: {},
	handler: async ( ctx ) => await ctx.db.query( 'pushSubscriptions' ).collect()
} );

export const remove = internalMutation( {
	args: { id: v.id( 'pushSubscriptions' ) },
	handler: async ( ctx, { id } ) => await ctx.db.delete( id )
} );
