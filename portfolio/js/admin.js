import {
	CONTENT_OPTIONS,
	PROJECT_GOALS,
	PROJECT_TYPES,
	SERVICES,
	STYLE_OPTIONS,
	getDefaultStudioSettings,
	getPackage,
	getService,
	initializeStudioData,
	saveBookingOptions,
	saveCatalog
} from './data.js';
import {
	clearRemoteOrders,
	createRemoteOrder,
	isBackendConfigured,
	loadRemoteOrders,
	removeRemoteOrder,
	updateRemoteOrder
} from './backend.js';
import { getLanguage, initializePreferences, localizeValue, t } from './preferences.js';

const STORAGE_KEY = 'portfolio_orders';
const ADMIN_KEY_STORAGE = 'pozan_admin_key';
const STATUS_OPTIONS = [
	{ value: 'new', key: 'admin.status.new' },
	{ value: 'contacted', key: 'admin.status.contacted' },
	{ value: 'in-progress', key: 'admin.status.in-progress' },
	{ value: 'completed', key: 'admin.status.completed' },
	{ value: 'archived', key: 'admin.status.archived' }
];
const VIEW_META = {
	all: { title: 'admin.all', eyebrow: 'admin.pipeline' },
	new: { title: 'admin.new', eyebrow: 'admin.needsResponse' },
	active: { title: 'admin.active', eyebrow: 'admin.activeWork' },
	completed: { title: 'admin.completed', eyebrow: 'admin.finishedWork' },
	archived: { title: 'admin.archived', eyebrow: 'admin.archive' }
};
const elements = {
	list: document.querySelector( '[data-inquiry-list]' ),
	search: document.querySelector( '[data-search]' ),
	serviceFilter: document.querySelector( '[data-service-filter]' ),
	sort: document.querySelector( '[data-sort]' ),
	resultsCount: document.querySelector( '[data-results-count]' ),
	viewTitle: document.querySelector( '[data-view-title]' ),
	viewEyebrow: document.querySelector( '[data-view-eyebrow]' ),
	dialog: document.querySelector( '[data-detail-dialog]' ),
	detailTitle: document.querySelector( '[data-detail-title]' ),
	detailBody: document.querySelector( '[data-detail-body]' ),
	toast: document.querySelector( '[data-toast]' )
};

let orders = [];
let catalog = JSON.parse( JSON.stringify( SERVICES ) );
let bookingSettings = {
	projectTypes: [ ...PROJECT_TYPES ],
	projectGoals: [ ...PROJECT_GOALS ],
	contentOptions: [ ...CONTENT_OPTIONS ],
	styles: STYLE_OPTIONS.map( ( style ) => ( { ...style } ) )
};
let activeOrderId = '';
let activeView = 'all';
let activeWorkspace = 'projects';
let toastTimer = 0;
let adminKey = '';

function escapeHtml( value ) {

	return String( value ?? '' ).replaceAll( '&', '&amp;' ).replaceAll( '<', '&lt;' ).replaceAll( '>', '&gt;' ).replaceAll( '"', '&quot;' ).replaceAll( '\'', '&#039;' );

}

function loadLocalOrders() {

	try {

		const stored = JSON.parse( localStorage.getItem( STORAGE_KEY ) || '[]' );
		if ( ! Array.isArray( stored ) ) return [];
		return stored.map( ( order, index ) => ( {
			...order,
			id: order.id || `${order.timestamp || 'legacy'}-${index}`,
			status: order.status || 'new'
		} ) );

	} catch ( error ) {

		console.error( 'Unable to read projects', error );
		return [];

	}

}

function saveLocalOrders() {

	localStorage.setItem( STORAGE_KEY, JSON.stringify( orders ) );

}

function serviceName( serviceId ) {

	return localizeValue( catalog.find( ( service ) => service.id === serviceId )?.name || getService( serviceId )?.name || serviceId ) || t( 'admin.notSpecified' );

}

function packageName( serviceId, packageId ) {

	const service = catalog.find( ( item ) => item.id === serviceId );
	return localizeValue( service?.packages?.find( ( item ) => item.id === packageId )?.name || getPackage( serviceId, packageId )?.name || packageId ) || t( 'admin.notSpecified' );

}

function formatDate( value, includeTime = false ) {

	if ( ! value ) return t( 'admin.notSpecified' );
	const date = new Date( value );
	if ( Number.isNaN( date.getTime() ) ) return value;
	return new Intl.DateTimeFormat( getLanguage() === 'vi' ? 'vi-VN' : 'en-GB', {
		day: '2-digit', month: 'short', year: 'numeric',
		...( includeTime ? { hour: '2-digit', minute: '2-digit' } : {} )
	} ).format( date );

}

function initials( name ) {

	return String( name || '?' ).trim().split( /\s+/ ).slice( 0, 2 ).map( ( part ) => part[ 0 ] ).join( '' ).toUpperCase();

}

function statusOptions( selected ) {

	return STATUS_OPTIONS.map( ( option ) => `<option value="${option.value}" ${option.value === selected ? 'selected' : ''}>${t( option.key )}</option>` ).join( '' );

}

function isInView( order ) {

	if ( activeView === 'all' ) return order.status !== 'archived';
	if ( activeView === 'active' ) return [ 'contacted', 'in-progress' ].includes( order.status );
	return order.status === activeView;

}

function filteredOrders() {

	const query = elements.search.value.trim().toLowerCase();
	const service = elements.serviceFilter.value;
	const results = orders.filter( ( order ) => {

		const haystack = [
			order.name, order.email, order.phone, order.service, serviceName( order.service ),
			order.projectType, order.goal, order.requirements, order.style, order.contentStatus
		].join( ' ' ).toLowerCase();
		return isInView( order ) && ( ! query || haystack.includes( query ) ) && ( service === 'all' || order.service === service );

	} );
	return results.sort( ( first, second ) => {

		if ( elements.sort.value === 'oldest' ) return new Date( first.timestamp || 0 ) - new Date( second.timestamp || 0 );
		if ( elements.sort.value === 'deadline' ) {

			const firstDeadline = first.flexibleDeadline || ! first.deadline ? Number.MAX_SAFE_INTEGER : new Date( first.deadline ).getTime();
			const secondDeadline = second.flexibleDeadline || ! second.deadline ? Number.MAX_SAFE_INTEGER : new Date( second.deadline ).getTime();
			return firstDeadline - secondDeadline;

		}

		return new Date( second.timestamp || 0 ) - new Date( first.timestamp || 0 );

	} );

}

function counts() {

	return {
		all: orders.filter( ( order ) => order.status !== 'archived' ).length,
		new: orders.filter( ( order ) => order.status === 'new' ).length,
		active: orders.filter( ( order ) => [ 'contacted', 'in-progress' ].includes( order.status ) ).length,
		completed: orders.filter( ( order ) => order.status === 'completed' ).length,
		archived: orders.filter( ( order ) => order.status === 'archived' ).length
	};

}

function renderStats() {

	const totals = counts();
	document.querySelector( '[data-stat-total]' ).textContent = totals.all;
	document.querySelector( '[data-stat-new]' ).textContent = totals.new;
	document.querySelector( '[data-stat-progress]' ).textContent = totals.active;
	document.querySelector( '[data-stat-completed]' ).textContent = totals.completed;
	Object.entries( totals ).forEach( ( [ key, value ] ) => {

		const node = document.querySelector( `[data-count-${key}]` );
		if ( node ) node.textContent = value;

	} );

}

function requestSummary( order ) {

	if ( order.requirements?.trim() ) return order.requirements.trim();
	const parts = [ order.goal, order.contentStatus ].filter( Boolean ).map( localizeValue );
	return parts.length ? parts.join( ' — ' ) : t( 'admin.noBrief' );

}

function emptyState() {

	const hasOrders = orders.length > 0;
	return `<div class="empty-state"><div><div class="empty-visual" aria-hidden="true"></div><h3>${hasOrders ? t( 'admin.noResults' ) : t( 'admin.empty' )}</h3><p>${hasOrders ? t( 'admin.noResultsText' ) : t( 'admin.emptyText' )}</p>${hasOrders ? `<button class="admin-button secondary" type="button" data-reset-filters>${t( 'admin.showAll' )}</button>` : `<a class="admin-button primary" href="./">${t( 'admin.viewPortfolio' )} ↗</a>`}</div></div>`;

}

function clampProgress( value ) {

	return Math.max( 0, Math.min( 100, Number( value ) || 0 ) );

}

function progressStageLabel( stage = 'discovery' ) {

	return t( `admin.phase.${stage}` );

}

function progressStages( selected ) {

	return [ 'discovery', 'planning', 'design', 'development', 'review', 'delivery' ].map( ( stage ) => `<option value="${stage}" ${stage === selected ? 'selected' : ''}>${progressStageLabel( stage )}</option>` ).join( '' );

}

function progressSummary( order ) {

	const progress = clampProgress( order.progress );
	const stage = order.phase || 'discovery';
	return `<div class="progress-summary"><div class="progress-summary-head"><span>${progressStageLabel( stage )}</span><b>${progress}%</b></div><div class="progress-track" style="--progress: ${progress}%"><i></i></div></div>`;

}

function renderOrders() {

	const visibleOrders = filteredOrders();
	const viewMeta = VIEW_META[ activeView ];
	elements.viewTitle.textContent = t( viewMeta.title );
	elements.viewEyebrow.innerHTML = t( viewMeta.eyebrow );
	elements.resultsCount.textContent = visibleOrders.length;
	elements.list.innerHTML = visibleOrders.length ? visibleOrders.map( ( order ) => `
		<article class="project-row" data-order-id="${escapeHtml( order.id )}">
			<div class="client-cell">
				<span class="client-avatar" aria-hidden="true">${escapeHtml( initials( order.name ) )}</span>
				<div class="client-copy">
					<small>${t( 'admin.client' )}</small>
					<strong>${escapeHtml( order.name || t( 'admin.unnamed' ) )}</strong>
					<span>${escapeHtml( order.email || order.phone || t( 'admin.noContact' ) )}</span>
				</div>
			</div>
			<div class="request-cell">
				<small>${t( 'admin.need' )}</small>
				<h3>${escapeHtml( localizeValue( order.goal ) || serviceName( order.service ) )}</h3>
				<p>${escapeHtml( requestSummary( order ) )}</p>
				<div class="project-tags">
					${order.projectType ? `<span>${escapeHtml( localizeValue( order.projectType ) )}</span>` : ''}
					${order.style ? `<span>${escapeHtml( localizeValue( order.style ) )}</span>` : ''}
					${order.contentStatus ? `<span>${escapeHtml( localizeValue( order.contentStatus ) )}</span>` : ''}
				</div>
				${! [ 'completed', 'archived' ].includes( order.status ) ? progressSummary( order ) : ''}
			</div>
			<div class="project-meta-cell">
				<div><small>${t( 'admin.service' )}</small><strong>${escapeHtml( serviceName( order.service ) )}</strong><span>${escapeHtml( packageName( order.service, order.package ) )}</span></div>
				<div><small>${t( 'admin.deadline' )}</small><strong>${order.flexibleDeadline ? t( 'date.flexible' ) : escapeHtml( formatDate( order.deadline ) )}</strong><span>${t( 'admin.received' )} ${escapeHtml( formatDate( order.timestamp ) )}</span></div>
			</div>
			<div class="project-actions">
				<label class="status-wrap" data-status="${escapeHtml( order.status )}"><span class="sr-only">${t( 'admin.statusFor' )} ${escapeHtml( order.name )}</span><select class="status-select" data-status-select="${escapeHtml( order.id )}">${statusOptions( order.status )}</select></label>
				<button class="view-project" type="button" data-view-order="${escapeHtml( order.id )}">${t( 'admin.viewBrief' )} <span aria-hidden="true">↗</span></button>
				${! [ 'completed', 'archived' ].includes( order.status ) ? `<button class="complete-project" type="button" data-complete-order="${escapeHtml( order.id )}">${t( 'admin.markCompleted' )} <span aria-hidden="true">✓</span></button>` : ''}
			</div>
		</article>
	` ).join( '' ) : emptyState();

}

function renderDashboard() {

	renderStats();
	renderOrders();
	document.querySelectorAll( '[data-view]' ).forEach( ( button ) => button.classList.toggle( 'is-current', activeWorkspace === 'projects' && button.dataset.view === activeView ) );

}

function detailItem( label, value, wide = false ) {

	return `<div class="detail-item ${wide ? 'wide' : ''}"><small>${escapeHtml( label )}</small><p>${escapeHtml( localizeValue( value ) || t( 'admin.notSpecified' ) )}</p></div>`;

}

function taskRow( task = { label: '', done: false } ) {

	return `<div class="task-row"><input type="checkbox" ${task.done ? 'checked' : ''} aria-label="${t( 'admin.taskDone' )}"><input type="text" value="${escapeHtml( task.label )}" aria-label="${t( 'admin.taskName' )}"><button class="icon-button" type="button" data-remove-task aria-label="${t( 'admin.removeTask' )}">×</button></div>`;

}

function progressEditor( order ) {

	const progress = clampProgress( order.progress );
	const tasks = Array.isArray( order.tasks ) ? order.tasks : [];
	return `
		<section class="progress-workspace">
			<div class="progress-workspace-head"><div><p class="admin-eyebrow"><span>DELIVERY</span> / TRACKING</p><h3>${t( 'admin.progressTitle' )}</h3></div><strong class="progress-value" data-progress-value>${progress}%</strong></div>
			<div class="progress-controls">
				<label class="config-field"><span>${t( 'admin.phase' )}</span><select data-project-phase>${progressStages( order.phase || 'discovery' )}</select></label>
				<label class="config-field"><span>${t( 'admin.targetDate' )}</span><input type="date" value="${escapeHtml( order.targetDate || order.deadline || '' )}" data-project-target></label>
				<label class="config-field progress-range"><span>${t( 'admin.progress' )}</span><input type="range" min="0" max="100" step="5" value="${progress}" data-project-progress></label>
				<label class="config-field progress-notes"><span>${t( 'admin.internalNotes' )}</span><textarea rows="4" data-project-notes placeholder="${t( 'admin.internalNotesPlaceholder' )}">${escapeHtml( order.internalNotes || '' )}</textarea></label>
				<div class="task-editor"><span class="package-editor-label">${t( 'admin.checklist' )}</span><div class="task-list" data-task-list>${tasks.map( taskRow ).join( '' )}</div><div class="task-add"><input type="text" data-new-task placeholder="${t( 'admin.newTaskPlaceholder' )}"><button type="button" data-add-task>+ ${t( 'admin.addTask' )}</button></div></div>
			</div>
			<button class="admin-button primary" type="button" data-save-progress>${t( 'admin.saveProgress' )}</button>
		</section>`;

}

function openDetail( orderId ) {

	const order = orders.find( ( item ) => item.id === orderId );
	if ( ! order ) return;
	activeOrderId = orderId;
	elements.detailTitle.textContent = order.name || t( 'admin.unnamed' );
	elements.detailBody.innerHTML = `
		<div class="brief-hero">
			<span>${t( 'admin.intent' )}</span>
			<h3>${escapeHtml( localizeValue( order.goal ) || serviceName( order.service ) )}</h3>
			<p>${escapeHtml( requestSummary( order ) )}</p>
		</div>
		<div class="detail-summary">
			${detailItem( t( 'admin.servicePackage' ), `${serviceName( order.service )} / ${packageName( order.service, order.package )}` )}
			${detailItem( t( 'admin.deadline' ), order.flexibleDeadline ? t( 'date.flexible' ) : formatDate( order.deadline ) )}
			${detailItem( t( 'admin.email' ), order.email )}
			${detailItem( t( 'admin.phone' ), order.phone )}
			${detailItem( t( 'admin.projectType' ), order.projectType )}
			${detailItem( t( 'admin.preferred' ), order.contactMethod )}
			${detailItem( t( 'admin.visual' ), order.style )}
			${detailItem( t( 'admin.contentStatus' ), order.contentStatus )}
			${detailItem( t( 'admin.fullNotes' ), order.requirements, true )}
			${detailItem( t( 'admin.submitted' ), formatDate( order.timestamp, true ) )}
			${detailItem( t( 'admin.files' ), order.files?.length ? `${order.files.length} ${t( 'admin.fileRefs' )}` : t( 'admin.noFiles' ) )}
		</div>
		${order.status !== 'archived' ? progressEditor( order ) : ''}
		<div class="detail-actions">
			${! [ 'completed', 'archived' ].includes( order.status ) ? `<button class="admin-button complete-button" type="button" data-mark-completed>${t( 'admin.markProjectCompleted' )} ✓</button>` : ''}
			${order.email ? `<a class="admin-button primary" href="mailto:${escapeHtml( order.email )}">${t( 'admin.emailClient' )} ↗</a>` : ''}
			${order.phone ? `<a class="admin-button secondary" href="tel:${escapeHtml( order.phone )}">${t( 'admin.callClient' )}</a>` : ''}
			<button class="admin-button secondary" type="button" data-copy-contact>${t( 'admin.copyContact' )}</button>
			<button class="admin-button danger-button" type="button" data-delete-order>${t( 'admin.delete' )}</button>
		</div>`;
	if ( ! elements.dialog.open ) elements.dialog.showModal();

}

function closeDetail() {

	elements.dialog.close();
	activeOrderId = '';

}

function showToast( message ) {

	clearTimeout( toastTimer );
	elements.toast.textContent = message;
	elements.toast.classList.add( 'is-visible' );
	toastTimer = window.setTimeout( () => elements.toast.classList.remove( 'is-visible' ), 2400 );

}

function setActiveView( view ) {

	if ( ! VIEW_META[ view ] ) return;
	activeWorkspace = 'projects';
	activeView = view;
	elements.search.value = '';
	elements.serviceFilter.value = 'all';
	setWorkspace( 'projects' );
	renderDashboard();
	document.querySelector( '#inquiries' ).scrollIntoView( { behavior: matchMedia( '(prefers-reduced-motion: reduce)' ).matches ? 'auto' : 'smooth', block: 'start' } );

}

async function updateStatus( orderId, status, showCompleted = false ) {

	const order = orders.find( ( item ) => item.id === orderId );
	if ( ! order ) return;
	order.status = status;
	order.completedAt = status === 'completed' ? new Date().toISOString() : '';
	if ( isBackendConfigured() ) {

		await updateRemoteOrder( order.id, { status: order.status, completedAt: order.completedAt }, adminKey );

	} else {

		saveLocalOrders();

	}
	if ( showCompleted && status === 'completed' ) activeView = 'completed';
	renderDashboard();
	showToast( status === 'completed' ? t( 'admin.movedCompleted' ) : t( 'admin.statusUpdated' ) );

}

async function saveProjectProgress() {

	const order = orders.find( ( item ) => item.id === activeOrderId );
	if ( ! order ) return;
	order.phase = elements.detailBody.querySelector( '[data-project-phase]' ).value;
	order.targetDate = elements.detailBody.querySelector( '[data-project-target]' ).value;
	order.progress = clampProgress( elements.detailBody.querySelector( '[data-project-progress]' ).value );
	order.internalNotes = elements.detailBody.querySelector( '[data-project-notes]' ).value.trim();
	order.tasks = [ ...elements.detailBody.querySelectorAll( '.task-row' ) ].map( ( row ) => ( {
		label: row.querySelector( 'input[type="text"]' ).value.trim(),
		done: row.querySelector( 'input[type="checkbox"]' ).checked
	} ) ).filter( ( task ) => task.label );
	if ( [ 'new', 'contacted' ].includes( order.status ) && ( order.progress > 0 || order.phase !== 'discovery' ) ) order.status = 'in-progress';
	const updates = {
		phase: order.phase,
		targetDate: order.targetDate,
		progress: order.progress,
		internalNotes: order.internalNotes,
		tasks: order.tasks,
		status: order.status
	};
	if ( isBackendConfigured() ) {

		await updateRemoteOrder( order.id, updates, adminKey );

	} else {

		saveLocalOrders();

	}
	renderDashboard();
	openDetail( order.id );
	showToast( t( 'admin.progressSaved' ) );

}

async function deleteOrder( orderId ) {

	const order = orders.find( ( item ) => item.id === orderId );
	if ( ! order || ! window.confirm( t( 'admin.deleteConfirm' ) ) ) return;
	if ( isBackendConfigured() ) {

		await removeRemoteOrder( orderId, adminKey );

	}
	orders = orders.filter( ( item ) => item.id !== orderId );
	if ( ! isBackendConfigured() ) saveLocalOrders();
	if ( elements.dialog.open ) closeDetail();
	renderDashboard();
	showToast( t( 'admin.deleted' ) );

}

function csvCell( value ) {

	return `"${String( value ?? '' ).replaceAll( '"', '""' )}"`;

}

function exportCsv() {

	if ( ! orders.length ) {

		showToast( t( 'admin.noExport' ) );
		return;

	}

	const headers = [ 'Submitted', 'Status', 'Completed', 'Phase', 'Progress', 'Target date', 'Name', 'Email', 'Phone', 'Contact method', 'Service', 'Package', 'Project type', 'Goal', 'Style', 'Content', 'Deadline', 'Requirements', 'Internal notes', 'Tasks' ];
	const rows = orders.map( ( order ) => [ order.timestamp, order.status, order.completedAt, order.phase, `${clampProgress( order.progress )}%`, order.targetDate, order.name, order.email, order.phone, order.contactMethod, serviceName( order.service ), packageName( order.service, order.package ), order.projectType, order.goal, order.style, order.contentStatus, order.flexibleDeadline ? 'Flexible' : order.deadline, order.requirements, order.internalNotes, ( order.tasks || [] ).map( ( task ) => `${task.done ? '[x]' : '[ ]'} ${task.label}` ).join( ' | ' ) ] );
	const blob = new Blob( [ `\uFEFF${[ headers, ...rows ].map( ( row ) => row.map( csvCell ).join( ',' ) ).join( '\n' )}` ], { type: 'text/csv;charset=utf-8' } );
	const url = URL.createObjectURL( blob );
	const link = Object.assign( document.createElement( 'a' ), { href: url, download: `pozan-market-projects-${new Date().toISOString().slice( 0, 10 )}.csv` } );
	link.click();
	URL.revokeObjectURL( url );
	showToast( t( 'admin.exportReady' ) );

}

function slugify( value ) {

	return String( value || 'service' ).toLowerCase().normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, '' ).replace( /[^a-z0-9]+/g, '-' ).replace( /^-|-$/g, '' ) || `service-${Date.now()}`;

}

function packageRow( packageItem ) {

	return `
		<div class="package-row" data-package-id="${escapeHtml( packageItem.id )}">
			<label class="config-field"><span>${t( 'admin.packageName' )}</span><input value="${escapeHtml( packageItem.name )}" data-package-name></label>
			<label class="config-field"><span>${t( 'admin.packagePrice' )}</span><input value="${escapeHtml( packageItem.price )}" data-package-price></label>
			<label class="config-field"><span>${t( 'admin.packageFeatures' )}</span><textarea rows="3" data-package-features>${escapeHtml( ( packageItem.features || [] ).join( '\n' ) )}</textarea></label>
			<button class="icon-button" type="button" data-remove-package aria-label="${t( 'admin.removePackage' )}">×</button>
		</div>`;

}

function catalogCard( service, index ) {

	return `
		<article class="catalog-card" data-catalog-id="${escapeHtml( service.id )}">
			<div class="catalog-card-head">
				<span class="catalog-number">${String( index + 1 ).padStart( 2, '0' )}</span>
				<label class="config-field"><span>${t( 'admin.serviceName' )}</span><input value="${escapeHtml( service.name )}" data-service-name></label>
				<label class="config-field"><span>${t( 'admin.basePrice' )}</span><input value="${escapeHtml( service.price )}" data-service-price></label>
				<button class="admin-button primary" type="button" data-save-service>${t( 'admin.saveProduct' )}</button>
			</div>
			<label class="config-field catalog-description"><span>${t( 'admin.description' )}</span><textarea rows="3" data-service-description>${escapeHtml( service.description )}</textarea></label>
			<div class="package-editor"><span class="package-editor-label">${t( 'admin.packages' )}</span><div data-package-list>${( service.packages || [] ).map( packageRow ).join( '' )}</div><button class="text-action" type="button" data-add-package>+ ${t( 'admin.addPackage' )}</button></div>
			<div class="catalog-card-actions"><span>${t( 'admin.serviceId' )}: ${escapeHtml( service.id )}</span><button class="text-action danger" type="button" data-remove-service>${t( 'admin.removeService' )}</button></div>
		</article>`;

}

function renderCatalog() {

	document.querySelector( '[data-catalog-list]' ).innerHTML = catalog.map( catalogCard ).join( '' );

}

function readServiceCard( card ) {

	const existing = catalog.find( ( service ) => service.id === card.dataset.catalogId ) || {};
	return {
		...existing,
		id: card.dataset.catalogId,
		name: card.querySelector( '[data-service-name]' ).value.trim(),
		price: card.querySelector( '[data-service-price]' ).value.trim(),
		description: card.querySelector( '[data-service-description]' ).value.trim(),
		packages: [ ...card.querySelectorAll( '.package-row' ) ].map( ( row ) => {

			const price = row.querySelector( '[data-package-price]' ).value.trim();
			return {
				id: row.dataset.packageId,
				name: row.querySelector( '[data-package-name]' ).value.trim(),
				price,
				estimate: price,
				features: row.querySelector( '[data-package-features]' ).value.split( '\n' ).map( ( value ) => value.trim() ).filter( Boolean )
			};

		} )
	};

}

async function saveServiceCard( card ) {

	const service = readServiceCard( card );
	if ( ! service.name || ! service.price ) {

		showToast( t( 'admin.productRequired' ) );
		return;

	}

	const index = catalog.findIndex( ( item ) => item.id === service.id );
	catalog[ index ] = service;
	await saveCatalog( catalog, adminKey );
	renderCatalog();
	renderLocale();
	showToast( t( 'admin.productSaved' ) );

}

async function addService() {

	const id = `custom-${Date.now()}`;
	catalog.push( {
		id,
		code: String( catalog.length + 1 ).padStart( 2, '0' ),
		name: t( 'admin.newServiceName' ),
		price: 'Contact',
		description: '',
		packages: [ { id: 'starter', name: 'Starter', price: 'Contact', estimate: 'Contact', features: [] } ]
	} );
	await saveCatalog( catalog, adminKey );
	renderCatalog();
	document.querySelector( `[data-catalog-id="${id}"]` )?.scrollIntoView( { behavior: 'smooth', block: 'center' } );

}

function renderBookingSettings() {

	document.querySelector( '[data-option-field="projectTypes"]' ).value = bookingSettings.projectTypes.join( '\n' );
	document.querySelector( '[data-option-field="projectGoals"]' ).value = bookingSettings.projectGoals.join( '\n' );
	document.querySelector( '[data-option-field="contentOptions"]' ).value = bookingSettings.contentOptions.join( '\n' );
	document.querySelector( '[data-option-field="styles"]' ).value = bookingSettings.styles.map( ( style ) => `${style.name} | ${style.desc}` ).join( '\n' );

}

function linesFrom( selector ) {

	return document.querySelector( selector ).value.split( '\n' ).map( ( value ) => value.trim() ).filter( Boolean );

}

async function storeBookingSettings() {

	const styleClasses = [ 'style-minimal', 'style-modern', 'style-technology', 'style-creative', 'style-anime', 'style-luxury', 'style-other' ];
	bookingSettings = {
		projectTypes: linesFrom( '[data-option-field="projectTypes"]' ),
		projectGoals: linesFrom( '[data-option-field="projectGoals"]' ),
		contentOptions: linesFrom( '[data-option-field="contentOptions"]' ),
		styles: linesFrom( '[data-option-field="styles"]' ).map( ( value, index ) => {

			const [ name, ...description ] = value.split( '|' );
			return { name: name.trim(), desc: description.join( '|' ).trim() || name.trim(), className: styleClasses[ index ] || 'style-other' };

		} )
	};
	if ( ! bookingSettings.projectTypes.length || ! bookingSettings.projectGoals.length || ! bookingSettings.contentOptions.length || ! bookingSettings.styles.length ) {

		showToast( t( 'admin.optionsRequired' ) );
		return;

	}

	await saveBookingOptions( bookingSettings, adminKey );
	showToast( t( 'admin.optionsSaved' ) );

}

function setWorkspace( workspace ) {

	activeWorkspace = workspace;
	document.querySelectorAll( '[data-project-workspace]' ).forEach( ( node ) => {

		node.hidden = workspace !== 'projects';

	} );
	document.querySelectorAll( '[data-management-workspace]' ).forEach( ( node ) => {

		node.hidden = node.dataset.managementWorkspace !== workspace;

	} );
	document.querySelectorAll( '[data-workspace-target]' ).forEach( ( button ) => button.classList.toggle( 'is-current', button.dataset.workspaceTarget === workspace ) );
	document.querySelectorAll( '[data-view]' ).forEach( ( button ) => button.classList.toggle( 'is-current', workspace === 'projects' && button.dataset.view === activeView ) );
	document.querySelector( '[data-workspace-title]' ).textContent = workspace === 'catalog' ? t( 'admin.catalogHeading' ) : workspace === 'options' ? t( 'admin.optionsHeading' ) : t( 'admin.title' );
	window.scrollTo( { top: 0, behavior: matchMedia( '(prefers-reduced-motion: reduce)' ).matches ? 'auto' : 'smooth' } );

}

function resetFilters() {

	activeView = 'all';
	elements.search.value = '';
	elements.serviceFilter.value = 'all';
	elements.sort.value = 'newest';
	renderDashboard();

}

function renderLocale() {

	document.querySelector( '[data-current-date]' ).textContent = new Intl.DateTimeFormat( getLanguage() === 'vi' ? 'vi-VN' : 'en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' } ).format( new Date() );
	const selectedService = elements.serviceFilter.value || 'all';
	elements.serviceFilter.innerHTML = `<option value="all">${t( 'admin.allServices' )}</option>${catalog.map( ( service ) => `<option value="${service.id}">${escapeHtml( localizeValue( service.name ) )}</option>` ).join( '' )}`;
	elements.serviceFilter.value = selectedService;
	renderCatalog();
	renderBookingSettings();
	renderDashboard();
	setWorkspace( activeWorkspace );
	if ( elements.dialog.open && activeOrderId ) openDetail( activeOrderId );

}

async function copyContact() {

	const order = orders.find( ( item ) => item.id === activeOrderId );
	if ( ! order ) return;
	const contact = [ order.name, order.email, order.phone ].filter( Boolean ).join( ' · ' );
	try {

		await navigator.clipboard.writeText( contact );
		showToast( t( 'admin.contactCopied' ) );

	} catch {

		showToast( contact );

	}

}

async function initializeData() {

	await initializeStudioData();
	catalog = JSON.parse( JSON.stringify( SERVICES ) );
	bookingSettings = {
		projectTypes: [ ...PROJECT_TYPES ],
		projectGoals: [ ...PROJECT_GOALS ],
		contentOptions: [ ...CONTENT_OPTIONS ],
		styles: STYLE_OPTIONS.map( ( style ) => ( { ...style } ) )
	};
	if ( ! isBackendConfigured() ) {

		orders = loadLocalOrders();
		return;

	}
	adminKey = sessionStorage.getItem( ADMIN_KEY_STORAGE ) || window.prompt( getLanguage() === 'vi' ? 'Nhập mã quản trị Pozan Market' : 'Enter the Pozan Market admin key' ) || '';
	if ( ! adminKey ) throw new Error( 'Admin key is required.' );
	sessionStorage.setItem( ADMIN_KEY_STORAGE, adminKey );
	orders = await loadRemoteOrders( adminKey );
	const localOrders = loadLocalOrders();
	if ( ! orders.length && localOrders.length ) {

		for ( const localOrder of localOrders ) {

			const { id: localId, ...order } = localOrder;
			void localId;
			await createRemoteOrder( order );

		}
		orders = await loadRemoteOrders( adminKey );
		localStorage.removeItem( STORAGE_KEY );

	}

}

async function initialize() {

	await initializeData();

	[ elements.search, elements.serviceFilter, elements.sort ].forEach( ( control ) => control.addEventListener( 'input', renderOrders ) );
	document.addEventListener( 'click', ( event ) => {

		const viewButton = event.target.closest( '[data-view]' );
		if ( viewButton ) setActiveView( viewButton.dataset.view );
		const workspaceButton = event.target.closest( '[data-workspace-target]' );
		if ( workspaceButton ) setWorkspace( workspaceButton.dataset.workspaceTarget );

	} );
	elements.list.addEventListener( 'click', async ( event ) => {

		const viewButton = event.target.closest( '[data-view-order]' );
		const completeButton = event.target.closest( '[data-complete-order]' );
		if ( viewButton ) openDetail( viewButton.dataset.viewOrder );
		if ( completeButton ) await updateStatus( completeButton.dataset.completeOrder, 'completed', true );
		if ( event.target.closest( '[data-reset-filters]' ) ) resetFilters();

	} );
	elements.list.addEventListener( 'change', async ( event ) => {

		const select = event.target.closest( '[data-status-select]' );
		if ( select ) await updateStatus( select.dataset.statusSelect, select.value );

	} );
	document.querySelector( '[data-close-detail]' ).addEventListener( 'click', closeDetail );
	elements.dialog.addEventListener( 'cancel', ( event ) => {

		event.preventDefault(); closeDetail();

	} );
	elements.dialog.addEventListener( 'click', ( event ) => {

		if ( event.target === elements.dialog ) closeDetail();

	} );
	elements.detailBody.addEventListener( 'click', async ( event ) => {

		if ( event.target.closest( '[data-delete-order]' ) ) await deleteOrder( activeOrderId );
		if ( event.target.closest( '[data-copy-contact]' ) ) copyContact();
		if ( event.target.closest( '[data-save-progress]' ) ) await saveProjectProgress();
		if ( event.target.closest( '[data-remove-task]' ) ) event.target.closest( '.task-row' ).remove();
		if ( event.target.closest( '[data-add-task]' ) ) {

			const input = elements.detailBody.querySelector( '[data-new-task]' );
			if ( input.value.trim() ) {

				elements.detailBody.querySelector( '[data-task-list]' ).insertAdjacentHTML( 'beforeend', taskRow( { label: input.value.trim(), done: false } ) );
				input.value = '';

			}

		}

		if ( event.target.closest( '[data-mark-completed]' ) ) {

			const orderId = activeOrderId;
			closeDetail();
			await updateStatus( orderId, 'completed', true );

		}

	} );
	elements.detailBody.addEventListener( 'input', ( event ) => {

		if ( event.target.matches( '[data-project-progress]' ) ) elements.detailBody.querySelector( '[data-progress-value]' ).textContent = `${event.target.value}%`;

	} );
	const catalogList = document.querySelector( '[data-catalog-list]' );
	catalogList.addEventListener( 'click', async ( event ) => {

		const card = event.target.closest( '.catalog-card' );
		if ( ! card ) return;
		if ( event.target.closest( '[data-save-service]' ) ) await saveServiceCard( card );
		if ( event.target.closest( '[data-remove-package]' ) ) event.target.closest( '.package-row' ).remove();
		if ( event.target.closest( '[data-add-package]' ) ) {

			const service = readServiceCard( card );
			service.packages.push( { id: slugify( `package-${Date.now()}` ), name: 'New package', price: 'Contact', estimate: 'Contact', features: [] } );
			catalog[ catalog.findIndex( ( item ) => item.id === service.id ) ] = service;
			renderCatalog();

		}

		if ( event.target.closest( '[data-remove-service]' ) && window.confirm( t( 'admin.removeServiceConfirm' ) ) ) {

			catalog = catalog.filter( ( service ) => service.id !== card.dataset.catalogId );
			await saveCatalog( catalog, adminKey );
			renderLocale();
			showToast( t( 'admin.productRemoved' ) );

		}

	} );
	document.querySelector( '[data-add-service]' ).addEventListener( 'click', addService );
	document.querySelector( '[data-save-options]' ).addEventListener( 'click', storeBookingSettings );
	document.querySelector( '[data-reset-catalog]' ).addEventListener( 'click', async () => {

		if ( ! window.confirm( t( 'admin.resetCatalogConfirm' ) ) ) return;
		catalog = getDefaultStudioSettings().services;
		await saveCatalog( catalog, adminKey );
		renderLocale();
		showToast( t( 'admin.catalogReset' ) );

	} );
	document.querySelector( '[data-export]' ).addEventListener( 'click', exportCsv );
	document.querySelector( '[data-clear-all]' ).addEventListener( 'click', async () => {

		if ( ! orders.length || ! window.confirm( t( 'admin.clearConfirm' ) ) ) return;
		if ( isBackendConfigured() ) await clearRemoteOrders( adminKey );
		orders = [];
		if ( ! isBackendConfigured() ) saveLocalOrders();
		renderDashboard();
		showToast( t( 'admin.cleared' ) );

	} );
	initializePreferences( renderLocale );

}

initialize().catch( ( error ) => {

	console.error( 'Unable to initialize admin workspace', error );
	sessionStorage.removeItem( ADMIN_KEY_STORAGE );
	elements.list.innerHTML = `<div class="admin-empty"><h3>${getLanguage() === 'vi' ? 'Không thể mở dữ liệu quản trị' : 'Unable to open admin data'}</h3><p>${escapeHtml( error.message )}</p></div>`;

} );
