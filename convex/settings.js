import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';

function assertAdmin( adminKey ) {

	const configuredKey = process.env.ADMIN_KEY;
	if ( ! configuredKey ) throw new Error( 'ADMIN_KEY is not configured in Convex.' );
	if ( adminKey !== configuredKey ) throw new Error( 'Invalid admin key.' );

}

export const get = query( {
	args: {},
	handler: async ( ctx ) => {

		const documents = await ctx.db.query( 'settings' ).collect();
		return Object.fromEntries( documents.map( ( document ) => [ document.key, document.value ] ) );

	}
} );

export const save = mutation( {
	args: {
		adminKey: v.string(),
		key: v.union( v.literal( 'catalog' ), v.literal( 'booking' ) ),
		value: v.any()
	},
	handler: async ( ctx, { adminKey, key, value } ) => {

		assertAdmin( adminKey );
		const existing = await ctx.db.query( 'settings' ).withIndex( 'by_key', ( queryBuilder ) => queryBuilder.eq( 'key', key ) ).unique();
		const update = { value, updatedAt: Date.now() };
		if ( existing ) {

			await ctx.db.patch( existing._id, update );

		} else {

			await ctx.db.insert( 'settings', { key, ...update } );

		}

	}
} );
