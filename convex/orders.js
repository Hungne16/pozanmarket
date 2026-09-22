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

function presentClientOrder( document ) {

	const order = document.data;
	return {
		id: document._id,
		name: order.name || '',
		service: order.service || '',
		package: order.package || '',
		goal: order.goal || '',
		status: order.status || 'new',
		timestamp: order.timestamp || new Date( document._creationTime ).toISOString(),
		completedAt: order.completedAt || '',
		phase: order.phase || 'discovery',
		progress: Number( order.progress ) || 0,
		targetDate: order.targetDate || order.deadline || '',
		milestones: Array.isArray( order.milestones ) ? order.milestones : [],
		nextAction: order.nextAction || '',
		nextActionDate: order.nextActionDate || '',
		approval: order.approval || 'not-sent',
		budget: Number( order.budget ) || 0,
		paid: Number( order.paid ) || 0,
		resourceLinks: Array.isArray( order.resourceLinks ) ? order.resourceLinks : [],
		clientMessage: order.clientMessage || '',
		clientUpdates: Array.isArray( order.clientUpdates ) ? order.clientUpdates : [],
		clientFeedback: order.clientFeedback || '',
		clientFeedbackAt: order.clientFeedbackAt || ''
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

export const clientView = query( {
	args: { id: v.id( 'orders' ), trackingToken: v.string() },
	handler: async ( ctx, { id, trackingToken } ) => {

		const document = await ctx.db.get( id );
		if ( ! document || ! trackingToken || document.data.trackingToken !== trackingToken ) return null;
		return presentClientOrder( document );

	}
} );

export const clientRespond = mutation( {
	args: {
		id: v.id( 'orders' ),
		trackingToken: v.string(),
		approval: v.union( v.literal( 'approved' ), v.literal( 'changes' ) ),
		feedback: v.string()
	},
	handler: async ( ctx, { id, trackingToken, approval, feedback } ) => {

		const document = await ctx.db.get( id );
		if ( ! document || ! trackingToken || document.data.trackingToken !== trackingToken ) throw new Error( 'Invalid project access.' );
		const now = new Date().toISOString();
		await ctx.db.patch( id, {
			data: { ...document.data, approval, clientFeedback: feedback.trim().slice( 0, 2000 ), clientFeedbackAt: now },
			updatedAt: Date.now()
		} );

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
