import { isBackendConfigured, loadClientProject, respondToProject, subscribeClientProject } from './backend.js';
import { getPackage, getService, initializeStudioData } from './data.js';
import { getLanguage, initializePreferences, localizeValue, t } from './preferences.js';

const root = document.querySelector( '[data-client-root]' );
const toast = document.querySelector( '[data-client-toast]' );
const params = new URLSearchParams( window.location.search );
const projectId = params.get( 'project' ) || '';
const trackingToken = params.get( 'token' ) || '';
let project = null;
let toastTimer = 0;

function escapeHtml( value ) {

	return String( value ?? '' ).replaceAll( '&', '&amp;' ).replaceAll( '<', '&lt;' ).replaceAll( '>', '&gt;' ).replaceAll( '"', '&quot;' ).replaceAll( '\'', '&#039;' );

}

function formatDate( value, includeTime = false ) {

	if ( ! value ) return t( 'client.notSet' );
	const date = new Date( value.length === 10 ? `${value}T00:00:00` : value );
	if ( Number.isNaN( date.getTime() ) ) return value;
	return new Intl.DateTimeFormat( getLanguage() === 'vi' ? 'vi-VN' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric', ...( includeTime ? { hour: '2-digit', minute: '2-digit' } : {} ) } ).format( date );

}

function formatMoney( value ) {

	return new Intl.NumberFormat( getLanguage() === 'vi' ? 'vi-VN' : 'en-US' ).format( Number( value ) || 0 ) + ' VND';

}

function serviceName() {

	return localizeValue( getService( project.service )?.name || project.service ) || t( 'client.project' );

}

function packageName() {

	return localizeValue( getPackage( project.service, project.package )?.name || project.package ) || t( 'client.notSet' );

}

function safeLink( value ) {

	try {

		const url = new URL( value );
		return [ 'http:', 'https:' ].includes( url.protocol ) ? url : null;

	} catch {

		return null;

	}

}

function statusLabel( status ) {

	return t( `client.status.${status}` );

}

function phaseLabel( phase ) {

	return t( `client.phase.${phase || 'discovery'}` );

}

function showToast( message ) {

	clearTimeout( toastTimer );
	toast.textContent = message;
	toast.classList.add( 'is-visible' );
	toastTimer = window.setTimeout( () => toast.classList.remove( 'is-visible' ), 2600 );

}

function renderInvalid() {

	root.innerHTML = `<section class="client-state client-error"><span>◇</span><h1>${t( 'client.invalidTitle' )}</h1><p>${t( 'client.invalidText' )}</p><a class="client-button primary" href="./">${t( 'client.backSite' )}</a></section>`;

}

function renderMilestones() {

	const milestones = Array.isArray( project.milestones ) ? project.milestones : [];
	if ( ! milestones.length ) return `<div class="portal-empty">${t( 'client.noMilestones' )}</div>`;
	return `<div class="portal-milestones">${milestones.map( ( item, index ) => `<article class="portal-milestone is-${escapeHtml( item.status || 'planned' )}"><span>${String( index + 1 ).padStart( 2, '0' )}</span><div><strong>${escapeHtml( item.title )}</strong><small>${item.dueDate ? formatDate( item.dueDate ) : t( 'client.noDeadline' )}</small></div><em>${t( `client.milestone.${item.status || 'planned'}` )}</em></article>` ).join( '' )}</div>`;

}

function renderLinks() {

	const links = ( project.resourceLinks || [] ).map( safeLink ).filter( Boolean );
	if ( ! links.length ) return `<div class="portal-empty">${t( 'client.noFiles' )}</div>`;
	return `<div class="portal-links">${links.map( ( url ) => `<a href="${escapeHtml( url.href )}" target="_blank" rel="noreferrer"><span>↗</span><div><strong>${escapeHtml( url.hostname.replace( 'www.', '' ) )}</strong><small>${escapeHtml( url.pathname === '/' ? url.href : url.pathname )}</small></div></a>` ).join( '' )}</div>`;

}

function renderPayment() {

	if ( ! project.budget ) return `<div class="portal-empty">${t( 'client.paymentPending' )}</div>`;
	const paid = Math.min( project.budget, project.paid || 0 );
	const percentage = Math.round( paid / project.budget * 100 );
	return `<div class="payment-summary"><div><small>${t( 'client.totalBudget' )}</small><strong>${formatMoney( project.budget )}</strong></div><div><small>${t( 'client.paid' )}</small><strong>${formatMoney( paid )}</strong></div><div><small>${t( 'client.remaining' )}</small><strong>${formatMoney( project.budget - paid )}</strong></div></div><div class="payment-track"><i style="width:${percentage}%"></i></div><p>${percentage}% ${t( 'client.paymentComplete' )}</p>`;

}

function renderProject() {

	if ( ! project ) return renderInvalid();
	const progress = Math.max( 0, Math.min( 100, Number( project.progress ) || 0 ) );
	const approval = project.approval || 'not-sent';
	root.innerHTML = `
		<section class="portal-hero">
			<div class="portal-hero-top"><p><span>CLIENT PORTAL</span> / ${escapeHtml( projectId.slice( -8 ).toUpperCase() )}</p><span class="portal-status status-${escapeHtml( project.status )}"><i></i>${escapeHtml( statusLabel( project.status ) )}</span></div>
			<div class="portal-hero-grid"><div><small>${escapeHtml( serviceName() )} · ${escapeHtml( packageName() )}</small><h1>${escapeHtml( localizeValue( project.goal ) || serviceName() )}</h1><p>${t( 'client.hello' )} ${escapeHtml( project.name )}. ${t( 'client.heroText' )}</p></div><div class="progress-orbit" style="--progress:${progress * 3.6}deg"><div><strong>${progress}%</strong><span>${t( 'client.complete' )}</span></div></div></div>
			<div class="hero-progress"><i style="width:${progress}%"></i></div>
		</section>
		<section class="portal-overview">
			<article><small>${t( 'client.phase' )}</small><strong>${escapeHtml( phaseLabel( project.phase ) )}</strong><span>${t( 'client.phaseHint' )}</span></article>
			<article><small>${t( 'client.delivery' )}</small><strong>${escapeHtml( formatDate( project.targetDate ) )}</strong><span>${t( 'client.deliveryHint' )}</span></article>
			<article><small>${t( 'client.nextAction' )}</small><strong>${escapeHtml( project.nextAction || t( 'client.waitingUpdate' ) )}</strong><span>${project.nextActionDate ? formatDate( project.nextActionDate ) : t( 'client.noDate' )}</span></article>
			<article><small>${t( 'client.approval' )}</small><strong>${escapeHtml( t( `client.approval.${approval}` ) )}</strong><span>${project.clientFeedbackAt ? `${t( 'client.updated')} ${formatDate( project.clientFeedbackAt, true )}` : t( 'client.approvalHint' )}</span></article>
		</section>
		${project.clientMessage ? `<section class="client-message-card"><span>${t( 'client.updateFromStudio' )}</span><p>${escapeHtml( project.clientMessage )}</p></section>` : ''}
		<div class="portal-grid">
			<section class="portal-card milestones-card"><header><div><span>01</span><h2>${t( 'client.milestones' )}</h2></div><p>${t( 'client.milestonesText' )}</p></header>${renderMilestones()}</section>
			<section class="portal-card payment-card"><header><div><span>02</span><h2>${t( 'client.payment' )}</h2></div></header>${renderPayment()}</section>
			<section class="portal-card files-card"><header><div><span>03</span><h2>${t( 'client.files' )}</h2></div><p>${t( 'client.filesText' )}</p></header>${renderLinks()}</section>
			<section class="portal-card approval-card"><header><div><span>04</span><h2>${t( 'client.review' )}</h2></div><p>${t( 'client.reviewText' )}</p></header><label><span>${t( 'client.feedback' )}</span><textarea rows="4" data-client-feedback placeholder="${t( 'client.feedbackPlaceholder' )}">${escapeHtml( project.clientFeedback || '' )}</textarea></label><div class="approval-actions"><button class="client-button secondary" type="button" data-client-response="changes">${t( 'client.requestChanges' )}</button><button class="client-button primary" type="button" data-client-response="approved">${t( 'client.approve' )} ✓</button></div></section>
		</div>`;

}

async function handleResponse( approval ) {

	const feedback = root.querySelector( '[data-client-feedback]' ).value.trim();
	if ( approval === 'changes' && ! feedback ) {

		showToast( t( 'client.feedbackRequired' ) );
		root.querySelector( '[data-client-feedback]' ).focus();
		return;

	}
	root.querySelectorAll( '[data-client-response]' ).forEach( ( button ) => { button.disabled = true; } );
	try {

		await respondToProject( projectId, trackingToken, approval, feedback );
		showToast( approval === 'approved' ? t( 'client.approvedToast' ) : t( 'client.changesToast' ) );

	} catch ( error ) {

		console.error( 'Unable to submit client response', error );
		showToast( t( 'client.responseError' ) );
		renderProject();

	}

}

async function initialize() {

	await initializeStudioData();
	initializePreferences( renderProject );
	if ( ! projectId || ! trackingToken ) return renderInvalid();
	root.addEventListener( 'click', ( event ) => {

		const button = event.target.closest( '[data-client-response]' );
		if ( button ) handleResponse( button.dataset.clientResponse );

	} );
	if ( isBackendConfigured() ) {

		project = await loadClientProject( projectId, trackingToken );
		renderProject();
		subscribeClientProject( projectId, trackingToken, ( value ) => { project = value; renderProject(); }, () => renderInvalid() );
		return;

	}
	const local = JSON.parse( localStorage.getItem( 'portfolio_orders' ) || '[]' ).find( ( item ) => item.id === projectId && item.trackingToken === trackingToken );
	project = local || null;
	renderProject();

}

initialize().catch( ( error ) => { console.error( 'Unable to open client portal', error ); renderInvalid(); } );
