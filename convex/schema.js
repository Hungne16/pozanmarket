import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema( {
	orders: defineTable( {
		data: v.any(),
		updatedAt: v.number()
	} ),
	settings: defineTable( {
		key: v.string(),
		value: v.any(),
		updatedAt: v.number()
	} ).index( 'by_key', [ 'key' ] ),
	pushSubscriptions: defineTable( {
		endpoint: v.string(),
		subscription: v.any(),
		createdAt: v.number(),
		updatedAt: v.number()
	} ).index( 'by_endpoint', [ 'endpoint' ] )
} );
