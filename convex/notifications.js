'use node';

import { internalAction } from './_generated/server.js';
import { internal } from './_generated/api.js';
import { v } from 'convex/values';
import webpush from 'web-push';

export const sendNewOrder = internalAction( {
	args: { orderId: v.id( 'orders' ), name: v.string(), service: v.string() },
	handler: async ( ctx, { orderId, name, service } ) => {

		const publicKey = process.env.VAPID_PUBLIC_KEY;
		const privateKey = process.env.VAPID_PRIVATE_KEY;
		if ( ! publicKey || ! privateKey ) return;
		webpush.setVapidDetails( 'mailto:hungne16@users.noreply.github.com', publicKey, privateKey );
		const subscriptions = await ctx.runQuery( internal.pushSubscriptions.list, {} );
		const payload = JSON.stringify( {
			title: `Yêu cầu mới từ ${name}`,
			body: `Dịch vụ: ${service}. Chạm để mở trong Admin.`,
			url: `/admin?open=${orderId}`,
			tag: `order-${orderId}`
		} );
		await Promise.allSettled( subscriptions.map( async ( item ) => {

			try {

				await webpush.sendNotification( item.subscription, payload, { TTL: 60 * 60 * 24, urgency: 'high' } );

			} catch ( error ) {

				if ( [ 404, 410 ].includes( error?.statusCode ) ) await ctx.runMutation( internal.pushSubscriptions.remove, { id: item._id } );
				else console.error( 'Unable to send push notification', error );

			}

		} ) );

	}
} );
