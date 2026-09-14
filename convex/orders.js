import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';

function assertAdmin( adminKey ) {

	const configuredKey = process.env.ADMIN_KEY;
	if ( ! configuredKey ) throw new Error( 'ADMIN_KEY is not configured in Convex.' );
	if ( adminKey !== configuredKey ) throw new Error( 'Invalid admin key.' );

}

function presentOrder( document ) {

	return {
		...document.data,
		id: document._id,
		timestamp: document.data.timestamp || new Date( document._creationTime ).toISOString()
	};

}

export const create = mutation( {
	args: { order: v.any() },
	handler: async ( ctx, { order } ) => {

		const now = Date.now();
		return await ctx.db.insert( 'orders', {
			data: {
				...order,
				status: 'new',
				timestamp: order.timestamp || new Date( now ).toISOString()
			},
			updatedAt: now
		} );

	}
} );

export const list = query( {
	args: { adminKey: v.string() },
	handler: async ( ctx, { adminKey } ) => {

		assertAdmin( adminKey );
		const documents = await ctx.db.query( 'orders' ).order( 'desc' ).collect();
		return documents.map( presentOrder );

	}
} );

export const update = mutation( {
	args: { adminKey: v.string(), id: v.id( 'orders' ), updates: v.any() },
	handler: async ( ctx, { adminKey, id, updates } ) => {

		assertAdmin( adminKey );
		const existing = await ctx.db.get( id );
		if ( ! existing ) throw new Error( 'Project not found.' );
		const { id: ignoredId, ...safeUpdates } = updates;
		void ignoredId;
		await ctx.db.patch( id, {
			data: { ...existing.data, ...safeUpdates },
			updatedAt: Date.now()
		} );

	}
} );

export const remove = mutation( {
	args: { adminKey: v.string(), id: v.id( 'orders' ) },
	handler: async ( ctx, { adminKey, id } ) => {

		assertAdmin( adminKey );
		await ctx.db.delete( id );

	}
} );

export const clear = mutation( {
	args: { adminKey: v.string() },
	handler: async ( ctx, { adminKey } ) => {

		assertAdmin( adminKey );
		const documents = await ctx.db.query( 'orders' ).collect();
		await Promise.all( documents.map( ( document ) => ctx.db.delete( document._id ) ) );

	}
} );
