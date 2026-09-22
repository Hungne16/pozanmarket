import {
	DESIGN_PRICING,
	CONTENT_OPTIONS,
	PRICING_CATEGORIES,
	PROJECT_GOALS,
	PROJECT_TYPES,
	SERVICES,
	STYLE_OPTIONS,
	initializeStudioData,
	getPackage,
	getService
} from './data.js';
import { createRemoteOrder, isBackendConfigured } from './backend.js';
import { renderProjects } from './projects.js';
import { getLanguage, initializePreferences, localizeValue, t } from './preferences.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

const BOOKING_STEPS = 10;
const state = {
	service: '',
	package: '',
	projectType: '',
	goal: '',
	style: '',
	contentStatus: '',
	files: [],
	requirements: '',
	deadline: '',
	flexibleDeadline: false,
	name: '',
	email: '',
	phone: '',
	contactMethod: ''
};

const serviceIcons = [
	'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>',
	'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM4 9h16M9 9v11"/><path d="m13 14 2-2 3 3"/></svg>',
	'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h5M16 17h2"/></svg>',
	'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h8M8 12h5M8 16h8"/></svg>',
	'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12 4 7.5M12 12v9"/></svg>',
	'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 20 4M5 5h6v6H5zM13 13h6v6h-6z"/></svg>'
];

const SERVICE_PROFILES = {
	website: {
		label: 'WEB SYSTEM',
		skills: { en: [ 'Content architecture', 'Responsive UI', 'Frontend engineering', 'Three.js & GSAP' ], vi: [ 'Kiến trúc nội dung', 'UI responsive', 'Lập trình frontend', 'Three.js & GSAP' ] },
		outputs: { en: [ 'Production-ready website', 'SEO & performance foundation', 'Reusable component system' ], vi: [ 'Website sẵn sàng vận hành', 'Nền tảng SEO & hiệu năng', 'Hệ thống component tái sử dụng' ] }
	},
	landing: {
		label: 'CONVERSION',
		skills: { en: [ 'Conversion strategy', 'Visual storytelling', 'Motion direction', 'Analytics-ready UI' ], vi: [ 'Chiến lược chuyển đổi', 'Kể chuyện thị giác', 'Định hướng chuyển động', 'UI sẵn sàng đo lường' ] },
		outputs: { en: [ 'Focused campaign page', 'Clear CTA journey', 'Launch-ready responsive build' ], vi: [ 'Trang chiến dịch tập trung', 'Hành trình CTA rõ ràng', 'Bản responsive sẵn sàng ra mắt' ] }
	},
	uiux: {
		label: 'PRODUCT DESIGN',
		skills: { en: [ 'User flows', 'Wireframes', 'Interactive prototypes', 'Design systems' ], vi: [ 'Luồng người dùng', 'Wireframe', 'Prototype tương tác', 'Design system' ] },
		outputs: { en: [ 'Validated screen structure', 'Developer-ready Figma', 'Scalable UI library' ], vi: [ 'Cấu trúc màn hình được kiểm chứng', 'Figma sẵn sàng bàn giao', 'Thư viện UI có thể mở rộng' ] }
	},
	presentation: {
		label: 'STORY SYSTEM',
		skills: { en: [ 'Narrative structure', 'Information hierarchy', 'Data visualization', 'Slide animation' ], vi: [ 'Cấu trúc câu chuyện', 'Phân cấp thông tin', 'Trực quan hóa dữ liệu', 'Hiệu ứng slide' ] },
		outputs: { en: [ 'Persuasive slide deck', 'Editable master template', 'Presentation-ready assets' ], vi: [ 'Bộ slide thuyết phục', 'Master template chỉnh sửa được', 'Tài nguyên sẵn sàng thuyết trình' ] }
	},
	canva: {
		label: 'BRAND TOOLKIT',
		skills: { en: [ 'Brand consistency', 'Modular templates', 'Social formats', 'Team-friendly systems' ], vi: [ 'Nhất quán thương hiệu', 'Template mô-đun', 'Định dạng mạng xã hội', 'Hệ thống dễ dùng cho đội ngũ' ] },
		outputs: { en: [ 'Reusable Canva kit', 'Organized brand assets', 'Usage-ready templates' ], vi: [ 'Bộ Canva tái sử dụng', 'Tài nguyên thương hiệu có tổ chức', 'Template dùng được ngay' ] }
	},
	poster: {
		label: 'KEY VISUAL',
		skills: { en: [ 'Art direction', 'Typography', 'Image composition', 'Campaign adaptation' ], vi: [ 'Art direction', 'Typography', 'Bố cục hình ảnh', 'Ứng dụng cho chiến dịch' ] },
		outputs: { en: [ 'Distinct key visual', 'Platform-specific exports', 'Editable source files' ], vi: [ 'Key visual khác biệt', 'File xuất theo từng nền tảng', 'File nguồn chỉnh sửa được' ] }
	},
	other: {
		label: 'CUSTOM R&D',
		skills: { en: [ 'Product discovery', 'Rapid prototyping', 'Automation', 'Custom integrations' ], vi: [ 'Khám phá sản phẩm', 'Prototype nhanh', 'Tự động hóa', 'Tích hợp tùy chỉnh' ] },
		outputs: { en: [ 'Defined technical scope', 'Working proof of concept', 'A practical delivery roadmap' ], vi: [ 'Phạm vi kỹ thuật rõ ràng', 'Bản thử nghiệm hoạt động', 'Lộ trình triển khai thực tế' ] }
	}
};

let destroyServiceCardScenes = () => {};
let serviceSceneVersion = 0;

function profileValues( values ) {

	return values[ getLanguage() === 'vi' ? 'vi' : 'en' ];

}

async function refreshServiceCardScenes() {

	const version = ++ serviceSceneVersion;
	const { initializeServiceCardScenes } = await import( './service-card-scenes.js' );
	if ( version !== serviceSceneVersion ) return;
	destroyServiceCardScenes();
	destroyServiceCardScenes = initializeServiceCardScenes( elements.services );

}

const elements = {
	header: document.querySelector( '[data-header]' ),
	menuToggle: document.querySelector( '.menu-toggle' ),
	mobileMenu: document.querySelector( '.mobile-menu' ),
	services: document.querySelector( '[data-services]' ),
	pricingTabs: document.querySelector( '[data-pricing-tabs]' ),
	pricingPanel: document.querySelector( '[data-pricing-panel]' ),
	dialog: document.querySelector( '[data-booking-dialog]' ),
	bookingForm: document.querySelector( '[data-booking-form]' ),
	bookingContent: document.querySelector( '[data-booking-content]' ),
	stepLabel: document.querySelector( '[data-step-label]' ),
	progress: document.querySelector( '[data-progress]' ),
	backButton: document.querySelector( '[data-booking-back]' ),
	nextButton: document.querySelector( '[data-booking-next]' ),
	formError: document.querySelector( '[data-form-error]' )
};

let currentStep = 0;
let activePricingCategory = 'landing';
let hasLoadedScene = false;
let savedInquiryId = '';

function escapeHtml( value ) {

	return String( value ?? '' )
		.replaceAll( '&', '&amp;' )
		.replaceAll( '<', '&lt;' )
		.replaceAll( '>', '&gt;' )
		.replaceAll( '"', '&quot;' )
		.replaceAll( '\'', '&#039;' );

}

function renderServices() {

	elements.services.innerHTML = SERVICES.map( ( service, index ) => `
		<article class="service-card service-card-expanded is-visible" data-reveal data-service-id="${escapeHtml( service.id )}">
			<div class="service-visual ${service.image ? 'has-custom-image' : ''}" aria-hidden="true">
				${service.image ? `<img class="service-visual-image" src="${escapeHtml( service.image )}" alt="">` : `<canvas data-service-scene="${escapeHtml( service.id )}"></canvas>`}
				<span class="service-visual-icon">${serviceIcons[ index % serviceIcons.length ]}</span>
				<span class="service-visual-label">${SERVICE_PROFILES[ service.id ]?.label || SERVICE_PROFILES.other.label}</span>
				<span class="service-visual-coordinates">PM / 0${index + 1}</span>
			</div>
			<div class="service-card-copy">
				<div class="service-top"><span class="service-code">${service.code || String( index + 1 ).padStart( 2, '0' )} / ${String( SERVICES.length ).padStart( 2, '0' )}</span><span>${t( 'service.fullCycle' )}</span></div>
				<h3>${localizeValue( service.name )}</h3>
				<p class="service-description">${localizeValue( service.description )}</p>
				<div class="service-knowledge">
					<div><small>${t( 'service.skills' )}</small><div class="service-tags">${profileValues( ( SERVICE_PROFILES[ service.id ] || SERVICE_PROFILES.other ).skills ).map( ( skill ) => `<span>${escapeHtml( skill )}</span>` ).join( '' )}</div></div>
					<div><small>${t( 'service.outputs' )}</small><ul>${profileValues( ( SERVICE_PROFILES[ service.id ] || SERVICE_PROFILES.other ).outputs ).map( ( output ) => `<li>${escapeHtml( output )}</li>` ).join( '' )}</ul></div>
				</div>
				<div class="service-pipeline" aria-label="${t( 'service.pipeline' )}"><span>01 ${t( 'service.discover' )}</span><i></i><span>02 ${t( 'service.design' )}</span><i></i><span>03 ${t( 'service.deliver' )}</span></div>
				<div class="service-bottom"><span>${t( 'service.starting' )} · ${service.price}</span><button type="button" aria-label="${t( 'service.configure' )} ${localizeValue( service.name )}" data-service-booking="${service.id}">${t( 'service.explore' )} <b aria-hidden="true">↗</b></button></div>
			</div>
		</article>
	` ).join( '' );
	refreshServiceCardScenes().catch( ( error ) => console.warn( 'Service card 3D scenes unavailable', error ) );

}

function getPricingItems() {

	if ( activePricingCategory === 'design' ) return DESIGN_PRICING;
	return getService( activePricingCategory )?.packages ?? [];

}

function renderPricing() {

	elements.pricingTabs.innerHTML = PRICING_CATEGORIES.map( ( category ) => `
		<button class="pricing-tab" id="pricing-tab-${category.id}" type="button" role="tab" aria-controls="pricing-panel" tabindex="${category.id === activePricingCategory ? 0 : - 1}" aria-selected="${category.id === activePricingCategory}" data-pricing-category="${category.id}">${localizeValue( category.label )}</button>
	` ).join( '' );
	const items = getPricingItems();
	elements.pricingPanel.setAttribute( 'aria-labelledby', `pricing-tab-${activePricingCategory}` );
	elements.pricingPanel.style.setProperty( '--package-count', items.length );
	elements.pricingPanel.innerHTML = items.map( ( item, index ) => `
		<article class="price-card ${item.featured ? 'is-featured' : ''}">
			<div class="package-symbol symbol-${index}" aria-hidden="true"><i></i><i></i><i></i></div>
			<span>${activePricingCategory === 'design' ? t( 'pricing.creative' ) : localizeValue( getService( activePricingCategory ).name )}</span>
			<h3>${localizeValue( item.name )}</h3>
			<p class="package-caption">${item.id === 'custom' ? t( 'pricing.customCaption' ) : index === 0 ? t( 'pricing.firstCaption' ) : index === 1 ? t( 'pricing.secondCaption' ) : t( 'pricing.thirdCaption' )}</p>
			<p class="price">${formatPrice( item.price )}</p>
			<p class="package-includes">${t( 'pricing.included' )}</p>
			<ul>${item.features.map( ( feature ) => `<li>${localizeValue( feature )}</li>` ).join( '' )}</ul>
			<button class="button ${item.featured ? 'button-primary' : 'button-ghost'}" type="button" data-package-booking="${item.id}" data-service-booking="${item.serviceId || activePricingCategory}">${item.id === 'custom' ? t( 'pricing.talk' ) : t( 'pricing.startWith' ) + ' ' + localizeValue( item.name )} <span aria-hidden="true">↗</span></button>
		</article>
	` ).join( '' );

}

function formatPrice( price ) {

	const parts = price.split( ' VND' );
	if ( parts.length < 2 ) return `<strong class="custom-price">${t( 'pricing.talk' )}.</strong><small>${t( 'pricing.tailored' )}</small>`;
	const isStartingPrice = parts[ 0 ].startsWith( 'From ' );
	return `<small>${isStartingPrice ? t( 'pricing.starting' ) : t( 'pricing.investment' )}</small><strong>${parts[ 0 ].replace( 'From ', '' )}</strong><small>VND${parts[ 1 ] || ' / project'}</small>`;

}

function initializeRevealObserver() {

	const nodes = document.querySelectorAll( '[data-reveal]' );
	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {

		nodes.forEach( ( node ) => node.classList.add( 'is-visible' ) );
		return;

	}

	if ( CSS.supports( '(animation-timeline: view()) and (animation-range: entry)' ) ) {

		nodes.forEach( ( node ) => node.classList.add( 'is-visible' ) );
		return;

	}

	const observer = new IntersectionObserver( ( entries ) => {

		entries.forEach( ( entry ) => {

			if ( ! entry.isIntersecting ) return;
			entry.target.classList.add( 'is-visible' );
			observer.unobserve( entry.target );

		} );

	}, { threshold: 0.13, rootMargin: '0px 0px -40px' } );
	nodes.forEach( ( node ) => observer.observe( node ) );

}

function initializeFooterAnimation() {

	const footer = document.querySelector( '.site-footer' );
	if ( ! footer ) return;
	const media = gsap.matchMedia();
	media.add( {
		reduceMotion: '(prefers-reduced-motion: reduce)',
		isMobile: '(max-width: 680px)'
	}, ( context ) => {

		const { reduceMotion, isMobile } = context.conditions;
		const revealTargets = footer.querySelectorAll( '.footer-intro > *, .footer-nav, .footer-social' );
		const letters = footer.querySelectorAll( '.footer-wordmark-letter' );
		if ( reduceMotion ) {

			gsap.set( [ ...revealTargets, ...letters ], { clearProps: 'all' } );
			return;

		}

		const timeline = gsap.timeline( {
			defaults: { duration: .85, ease: 'power3.out' },
			scrollTrigger: { trigger: footer, start: 'top 78%', once: true }
		} );
		timeline
			.from( revealTargets, { autoAlpha: 0, y: 34, stagger: .09 }, 0 )
			.from( letters, { autoAlpha: 0, yPercent: 115, rotationX: - 55, stagger: { amount: isMobile ? .35 : .7, from: 'start' }, transformOrigin: '50% 100%' }, .18 )
			.from( '.footer-bottom > *', { autoAlpha: 0, y: 16, stagger: .08, duration: .55 }, '-=.35' );
		gsap.fromTo( '.footer-glow', { xPercent: - 7, yPercent: - 4 }, {
			xPercent: 7,
			yPercent: 4,
			ease: 'none',
			scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: .8 }
		} );

	} );
	window.addEventListener( 'pagehide', () => media.revert(), { once: true } );

}

function initializeScene() {

	const canvas = document.querySelector( '#hero-canvas' );
	const observer = new IntersectionObserver( async ( entries ) => {

		if ( ! entries[ 0 ].isIntersecting || hasLoadedScene ) return;
		hasLoadedScene = true;
		observer.disconnect();
		try {

			const { initHeroScene } = await import( './hero-scene.js' );
			const disposeScene = initHeroScene( canvas );
			window.addEventListener( 'pagehide', ( event ) => {

				if ( ! event.persisted ) disposeScene();

			}, { once: true } );

		} catch ( error ) {

			canvas.closest( '.core-visual' )?.classList.add( 'scene-unavailable' );

		}

	}, { rootMargin: '200px' } );
	observer.observe( canvas );

}

function setMobileMenu( isOpen ) {

	elements.menuToggle.setAttribute( 'aria-expanded', String( isOpen ) );
	elements.menuToggle.setAttribute( 'aria-label', isOpen ? ( getLanguage() === 'vi' ? 'Đóng menu' : 'Close menu' ) : ( getLanguage() === 'vi' ? 'Mở menu' : 'Open menu' ) );
	elements.mobileMenu.classList.toggle( 'is-open', isOpen );
	elements.mobileMenu.setAttribute( 'aria-hidden', String( ! isOpen ) );
	document.body.classList.toggle( 'is-locked', isOpen );

}

function initializeNavigation() {

	const sections = document.querySelectorAll( 'main section[id]' );
	const links = document.querySelectorAll( '.desktop-nav a' );
	window.addEventListener( 'scroll', () => elements.header.classList.toggle( 'is-scrolled', window.scrollY > 24 ), { passive: true } );
	elements.menuToggle.addEventListener( 'click', () => setMobileMenu( elements.menuToggle.getAttribute( 'aria-expanded' ) !== 'true' ) );
	elements.mobileMenu.querySelectorAll( 'a' ).forEach( ( link ) => link.addEventListener( 'click', () => setMobileMenu( false ) ) );

	const sectionObserver = new IntersectionObserver( ( entries ) => {

		entries.forEach( ( entry ) => {

			if ( ! entry.isIntersecting ) return;
			links.forEach( ( link ) => link.classList.toggle( 'is-current', link.getAttribute( 'href' ) === `#${entry.target.id}` ) );

		} );

	}, { rootMargin: '-35% 0px -60%' } );
	sections.forEach( ( section ) => sectionObserver.observe( section ) );

}

function initializeAccordion() {

	document.querySelectorAll( '[data-accordion] button' ).forEach( ( button ) => {

		button.addEventListener( 'click', () => {

			const isExpanded = button.getAttribute( 'aria-expanded' ) === 'true';
			document.querySelectorAll( '[data-accordion] button' ).forEach( ( item ) => item.setAttribute( 'aria-expanded', 'false' ) );
			button.setAttribute( 'aria-expanded', String( ! isExpanded ) );

		} );

	} );

}

function optionButton( value, selectedValue, extra = '' ) {

	return `<button class="choice-card ${value === selectedValue ? 'is-selected' : ''}" type="button" data-choice="${escapeHtml( value )}" ${extra}><b>${escapeHtml( localizeValue( value ) )}</b><small>${t( 'booking.select' )}</small></button>`;

}

function renderServiceStep() {

	return `<div class="booking-step"><p class="booking-kicker">${t( 'booking.serviceKicker' )}</p><h2 id="booking-title">${t( 'booking.serviceTitle' )}</h2><div class="choice-grid">${SERVICES.map( ( service ) => `<button class="choice-card ${service.id === state.service ? 'is-selected' : ''}" type="button" data-choice="${service.id}"><small>${service.code}</small><b>${localizeValue( service.name )}</b><span class="choice-price">${service.id === 'other' ? localizeValue( service.price ) : `${t( 'service.starting' )} ${service.price}`}</span></button>` ).join( '' )}</div></div>`;

}

function renderPackageStep() {

	const service = getService( state.service );
	if ( ! service ) return renderServiceStep();
	return `<div class="booking-step"><p class="booking-kicker">02 / ${getLanguage() === 'vi' ? 'Gói' : 'Package'} · ${localizeValue( service.name )}</p><h2 id="booking-title">${t( 'booking.packageTitle' )}</h2><div class="choice-grid package-grid">${service.packages.map( ( item ) => `<button class="choice-card ${item.id === state.package ? 'is-selected' : ''}" type="button" data-choice="${item.id}"><b>${localizeValue( item.name )}</b><span class="choice-price">${item.price}</span><ul>${item.features.map( ( feature ) => `<li>${localizeValue( feature )}</li>` ).join( '' )}</ul></button>` ).join( '' )}</div></div>`;

}

function renderSimpleChoiceStep( kicker, title, options, selectedValue, compact = true ) {

	return `<div class="booking-step"><p class="booking-kicker">${kicker}</p><h2 id="booking-title">${title}</h2><div class="choice-grid ${compact ? 'compact' : ''}">${options.map( ( option ) => optionButton( option, selectedValue ) ).join( '' )}</div></div>`;

}

function renderStyleStep() {

	return `<div class="booking-step"><p class="booking-kicker">${t( 'booking.styleKicker' )}</p><h2 id="booking-title">${t( 'booking.styleTitle' )}</h2><div class="choice-grid styles">${STYLE_OPTIONS.map( ( option ) => `<button class="choice-card style-card ${option.name === state.style ? 'is-selected' : ''}" type="button" data-choice="${option.name}"><div class="card-inner"><div class="style-preview ${option.className}"></div><div class="style-bottom"><div class="style-content"><span class="name">${localizeValue( option.name )}</span><span class="about-me">${localizeValue( option.desc )}</span></div></div></div></button>` ).join( '' )}</div></div>`;

}

function renderUploadStep() {

	const files = state.files.map( ( file, index ) => `<div class="file-item"><span>${escapeHtml( file.name )} · ${formatFileSize( file.size )}</span><button type="button" data-remove-file="${index}" aria-label="${t( 'booking.remove' )} ${escapeHtml( file.name )}">×</button></div>` ).join( '' );
	return `<div class="booking-step"><p class="booking-kicker">${t( 'booking.materialsKicker' )}</p><h2 id="booking-title">${t( 'booking.materialsTitle' )}</h2><p class="booking-hint">${t( 'booking.materialsHint' )}</p><label class="upload-zone"><input type="file" multiple accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"><span><i class="upload-icon"></i><b>${t( 'booking.drop' )}</b><p>${t( 'booking.fileTypes' )}</p></span></label><div class="file-list">${files}</div><button class="skip-upload" type="button" data-skip-upload>${t( 'booking.skip' )}</button></div>`;

}

function renderRequirementsStep() {

	return `<div class="booking-step"><p class="booking-kicker">${t( 'booking.detailsKicker' )}</p><h2 id="booking-title">${t( 'booking.detailsTitle' )}</h2><div class="field-group"><label for="requirements">${t( 'booking.notes' )}</label><textarea id="requirements" placeholder="${t( 'booking.notesPlaceholder' )}">${escapeHtml( state.requirements )}</textarea></div></div>`;

}

function renderDeadlineStep() {

	return `<div class="booking-step"><p class="booking-kicker">${t( 'booking.timingKicker' )}</p><h2 id="booking-title">${t( 'booking.timingTitle' )}</h2><div class="date-row"><div class="field-group"><label for="deadline">${t( 'booking.deadline' )}</label><input id="deadline" type="date" min="${new Date().toISOString().split( 'T' )[ 0 ]}" value="${escapeHtml( state.deadline )}" ${state.flexibleDeadline ? 'disabled' : ''}></div><label class="check-option"><input id="flexible-deadline" type="checkbox" ${state.flexibleDeadline ? 'checked' : ''}> ${t( 'booking.flexible' )}</label></div></div>`;

}

function renderContactStep() {

	return `<div class="booking-step"><p class="booking-kicker">${t( 'booking.contactKicker' )}</p><h2 id="booking-title">${t( 'booking.contactTitle' )}</h2><div class="field-row"><div class="field-group"><label for="client-name">${t( 'booking.name' )}</label><input id="client-name" autocomplete="name" value="${escapeHtml( state.name )}" placeholder="${t( 'booking.yourName' )}"></div><div class="field-group"><label for="client-email">${t( 'booking.email' )}</label><input id="client-email" type="email" autocomplete="email" value="${escapeHtml( state.email )}" placeholder="you@example.com"></div></div><div class="field-group"><label for="client-phone">${t( 'booking.phone' )}</label><input id="client-phone" type="tel" autocomplete="tel" value="${escapeHtml( state.phone )}" placeholder="${t( 'booking.yourPhone' )}"></div><fieldset class="contact-method"><legend>${t( 'booking.preferred' )}</legend><div class="contact-options">${[ 'Email', 'Phone', 'Zalo' ].map( ( method ) => `<label><input type="radio" name="contact-method" value="${method}" ${state.contactMethod === method ? 'checked' : ''}><span>${localizeValue( method )}</span></label>` ).join( '' )}</div></fieldset></div>`;

}

function formatDeadline() {

	if ( state.flexibleDeadline ) return t( 'date.flexible' );
	if ( ! state.deadline ) return t( 'date.none' );
	return new Intl.DateTimeFormat( getLanguage() === 'vi' ? 'vi-VN' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' } ).format( new Date( `${state.deadline}T00:00:00` ) );

}

function renderSummary() {

	const service = getService( state.service );
	const packageItem = getPackage( state.service, state.package );
	return `<div class="booking-step"><p class="booking-kicker">${t( 'booking.reviewKicker' )}</p><h2 id="booking-title">${t( 'booking.reviewTitle' )}</h2><div class="summary-grid"><div class="summary-item"><small>${t( 'booking.service' )}</small><strong>${escapeHtml( localizeValue( service?.name ) )}</strong></div><div class="summary-item"><small>${t( 'booking.package' )}</small><strong>${escapeHtml( localizeValue( packageItem?.name ) )}</strong></div><div class="summary-item price"><small>${t( 'booking.estimate' )}</small><strong>${escapeHtml( packageItem?.estimate )}</strong></div><div class="summary-item"><small>${t( 'booking.projectType' )}</small><strong>${escapeHtml( localizeValue( state.projectType ) )}</strong></div><div class="summary-item"><small>${t( 'booking.goal' )}</small><strong>${escapeHtml( localizeValue( state.goal ) )}</strong></div><div class="summary-item"><small>${t( 'booking.style' )}</small><strong>${escapeHtml( localizeValue( state.style ) )}</strong></div><div class="summary-item"><small>${t( 'booking.deadline' )}</small><strong>${formatDeadline()}</strong></div><div class="summary-item"><small>${t( 'booking.contact' )}</small><strong>${escapeHtml( state.name )}<br>${escapeHtml( state.email || state.phone )}</strong></div>${state.requirements ? `<div class="summary-item wide"><small>${t( 'booking.notesShort' )}</small><strong>${escapeHtml( state.requirements )}</strong></div>` : ''}</div><button class="summary-edit" type="button" data-summary-edit>${t( 'booking.edit' )}</button></div>`;

}

function renderSuccess() {

	return `<div class="booking-step success-screen"><div><i class="success-mark"></i><p class="booking-kicker">${t( 'booking.ready' )}</p><h2 id="booking-title">${t( 'booking.successTitle' )}</h2><p>${t( 'booking.successText' )}</p><button class="button button-primary" type="button" data-back-home>${t( 'booking.home' )}</button></div></div>`;

}

async function persistInquiry() {

	const timestamp = new Date().toISOString();
	const order = {
		...state,
		files: state.files.map( ( file ) => ( { name: file.name, size: file.size, type: file.type } ) ),
		status: 'new',
		timestamp
	};
	if ( isBackendConfigured() ) {

		savedInquiryId = await createRemoteOrder( order );
		return;

	}
	order.id = `inquiry-${Date.now()}`;
	const existing = JSON.parse( localStorage.getItem( 'portfolio_orders' ) || '[]' );
	existing.push( order );
	localStorage.setItem( 'portfolio_orders', JSON.stringify( existing ) );
	savedInquiryId = order.id;

}

function renderBookingStep() {

	const renderers = [
		renderServiceStep,
		renderPackageStep,
		() => renderSimpleChoiceStep( t( 'booking.projectKicker' ), t( 'booking.projectTitle' ), PROJECT_TYPES, state.projectType ),
		() => renderSimpleChoiceStep( t( 'booking.goalKicker' ), t( 'booking.goalTitle' ), PROJECT_GOALS, state.goal ),
		renderStyleStep,
		() => renderSimpleChoiceStep( t( 'booking.contentKicker' ), t( 'booking.contentTitle' ), CONTENT_OPTIONS, state.contentStatus, false ),
		renderUploadStep,
		renderRequirementsStep,
		renderDeadlineStep,
		renderContactStep,
		renderSummary,
		renderSuccess
	];
	elements.bookingContent.innerHTML = renderers[ currentStep ]();
	elements.formError.textContent = '';
	updateBookingHeader();
	bindStepEvents();
	elements.bookingContent.scrollTop = 0;

}

function updateBookingHeader() {

	const isSummary = currentStep === BOOKING_STEPS;
	const isSuccess = currentStep > BOOKING_STEPS;
	elements.stepLabel.textContent = isSuccess ? t( 'booking.complete' ) : isSummary ? t( 'booking.summary' ) : `${t( 'booking.step' )} ${currentStep + 1} / ${BOOKING_STEPS}`;
	elements.progress.style.width = `${isSuccess ? 100 : Math.min( ( ( currentStep + 1 ) / BOOKING_STEPS ) * 100, 100 )}%`;
	elements.backButton.hidden = currentStep === 0 || isSuccess;
	elements.nextButton.hidden = isSuccess;
	elements.nextButton.innerHTML = isSummary ? t( 'booking.submit' ) : t( 'booking.continue' );

}

function selectChoice( value ) {

	const keys = [ 'service', 'package', 'projectType', 'goal', 'style', 'contentStatus' ];
	const key = keys[ currentStep ];
	if ( ! key ) return;
	if ( key === 'service' && state.service !== value ) state.package = '';
	state[ key ] = value;
	elements.bookingContent.querySelectorAll( '[data-choice]' ).forEach( ( button ) => button.classList.toggle( 'is-selected', button.dataset.choice === value ) );
	elements.formError.textContent = '';

}

function formatFileSize( bytes ) {

	if ( bytes < 1024 * 1024 ) return `${Math.max( 1, Math.round( bytes / 1024 ) )} KB`;
	return `${( bytes / ( 1024 * 1024 ) ).toFixed( 1 )} MB`;

}

function addFiles( fileList ) {

	const validFiles = [ ...fileList ].filter( ( file ) => file.size <= 10 * 1024 * 1024 );
	state.files = [ ...state.files, ...validFiles ].slice( 0, 10 );
	if ( validFiles.length !== fileList.length ) elements.formError.textContent = t( 'error.file' );
	renderBookingStep();

}

function bindUploadEvents() {

	const input = elements.bookingContent.querySelector( 'input[type="file"]' );
	const zone = elements.bookingContent.querySelector( '.upload-zone' );
	input.addEventListener( 'change', () => addFiles( input.files ) );
	[ 'dragenter', 'dragover' ].forEach( ( eventName ) => zone.addEventListener( eventName, ( event ) => {

		event.preventDefault();
		zone.classList.add( 'is-dragging' );

	} ) );
	[ 'dragleave', 'drop' ].forEach( ( eventName ) => zone.addEventListener( eventName, ( event ) => {

		event.preventDefault();
		zone.classList.remove( 'is-dragging' );

	} ) );
	zone.addEventListener( 'drop', ( event ) => addFiles( event.dataTransfer.files ) );
	elements.bookingContent.querySelectorAll( '[data-remove-file]' ).forEach( ( button ) => button.addEventListener( 'click', () => {

		state.files.splice( Number( button.dataset.removeFile ), 1 );
		renderBookingStep();

	} ) );
	elements.bookingContent.querySelector( '[data-skip-upload]' ).addEventListener( 'click', goToNextStep );

}

function bindStepEvents() {

	elements.bookingContent.querySelectorAll( '[data-choice]' ).forEach( ( button ) => button.addEventListener( 'click', () => selectChoice( button.dataset.choice ) ) );
	if ( currentStep === 6 ) bindUploadEvents();
	if ( currentStep === 7 ) elements.bookingContent.querySelector( '#requirements' ).addEventListener( 'input', ( event ) => {

		state.requirements = event.target.value;

	} );
	if ( currentStep === 8 ) {

		const dateInput = elements.bookingContent.querySelector( '#deadline' );
		const flexibleInput = elements.bookingContent.querySelector( '#flexible-deadline' );
		dateInput.addEventListener( 'input', ( event ) => {

			state.deadline = event.target.value;

		} );
		flexibleInput.addEventListener( 'change', ( event ) => {

			state.flexibleDeadline = event.target.checked;
			dateInput.disabled = event.target.checked;

		} );

	}

	if ( currentStep === 9 ) bindContactEvents();
	if ( currentStep === 10 ) elements.bookingContent.querySelector( '[data-summary-edit]' ).addEventListener( 'click', () => {

		currentStep = 0; renderBookingStep();

	} );
	if ( currentStep === 11 ) elements.bookingContent.querySelector( '[data-back-home]' ).addEventListener( 'click', closeBooking );

}

function bindContactEvents() {

	const fields = { 'client-name': 'name', 'client-email': 'email', 'client-phone': 'phone' };
	Object.entries( fields ).forEach( ( [ id, key ] ) => elements.bookingContent.querySelector( `#${id}` ).addEventListener( 'input', ( event ) => {

		state[ key ] = event.target.value;

	} ) );
	elements.bookingContent.querySelectorAll( '[name="contact-method"]' ).forEach( ( input ) => input.addEventListener( 'change', ( event ) => {

		state.contactMethod = event.target.value;

	} ) );

}

function validateCurrentStep() {

	const requiredKeys = [ 'service', 'package', 'projectType', 'goal', 'style', 'contentStatus' ];
	if ( currentStep < requiredKeys.length && ! state[ requiredKeys[ currentStep ] ] ) return t( 'error.choose' );
	if ( currentStep === 8 && ! state.flexibleDeadline && ! state.deadline ) return t( 'error.deadline' );
	if ( currentStep === 9 ) {

		if ( ! state.name.trim() ) return t( 'error.name' );
		if ( ! state.email.trim() && ! state.phone.trim() ) return t( 'error.contact' );
		if ( state.email && ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( state.email ) ) return t( 'error.email' );
		if ( ! state.contactMethod ) return t( 'error.method' );

	}

	return '';

}

async function goToNextStep() {

	const error = validateCurrentStep();
	if ( error ) {

		elements.formError.textContent = error;
		return;

	}

	if ( currentStep === BOOKING_STEPS && ! savedInquiryId ) {

		elements.nextButton.disabled = true;
		try {

			await persistInquiry();

		} catch ( saveError ) {

			console.error( 'Unable to submit project request', saveError );
			elements.formError.textContent = t( 'error.save' );
			elements.nextButton.disabled = false;
			return;

		}

	}
	currentStep = Math.min( currentStep + 1, BOOKING_STEPS + 1 );
	renderBookingStep();

}

function openBooking( serviceId = '', packageId = '' ) {

	savedInquiryId = '';
	if ( serviceId && getService( serviceId ) ) {

		state.service = serviceId;
		state.package = packageId || '';
		currentStep = packageId ? 2 : 1;

	} else {

		currentStep = 0;

	}

	renderBookingStep();
	elements.dialog.showModal();
	document.body.classList.add( 'is-locked' );

}

function closeBooking() {

	elements.dialog.close();
	document.body.classList.remove( 'is-locked' );
	setMobileMenu( false );

}

function initializeBooking() {

	document.addEventListener( 'click', ( event ) => {

		const openButton = event.target.closest( '.js-open-booking, [data-service-booking]' );
		if ( ! openButton ) return;
		openBooking( openButton.dataset.serviceBooking, openButton.dataset.packageBooking );

	} );
	document.querySelector( '[data-close-booking]' ).addEventListener( 'click', closeBooking );
	elements.dialog.addEventListener( 'cancel', ( event ) => {

		event.preventDefault(); closeBooking();

	} );
	elements.bookingForm.addEventListener( 'submit', ( event ) => event.preventDefault() );
	elements.nextButton.addEventListener( 'click', goToNextStep );
	elements.backButton.addEventListener( 'click', () => {

		currentStep = Math.max( currentStep - 1, 0 );
		renderBookingStep();

	} );

}

function initializePricing() {

	elements.pricingTabs.addEventListener( 'click', ( event ) => {

		const button = event.target.closest( '[data-pricing-category]' );
		if ( ! button ) return;
		activePricingCategory = button.dataset.pricingCategory;
		renderPricing();
		elements.pricingTabs.querySelector( '[aria-selected="true"]' ).focus();

	} );
	elements.pricingTabs.addEventListener( 'keydown', ( event ) => {

		if ( ! [ 'ArrowLeft', 'ArrowRight', 'Home', 'End' ].includes( event.key ) ) return;
		event.preventDefault();
		const index = PRICING_CATEGORIES.findIndex( ( item ) => item.id === activePricingCategory );
		const next = event.key === 'Home' ? 0 : event.key === 'End' ? PRICING_CATEGORIES.length - 1 : ( index + ( event.key === 'ArrowRight' ? 1 : - 1 ) + PRICING_CATEGORIES.length ) % PRICING_CATEGORIES.length;
		activePricingCategory = PRICING_CATEGORIES[ next ].id;
		renderPricing();
		elements.pricingTabs.querySelector( '[aria-selected="true"]' ).focus();

	} );

}

async function initialize() {

	await initializeStudioData();
	renderServices();
	renderProjects();
	renderPricing();
	initializeRevealObserver();
	initializeNavigation();
	initializeAccordion();
	initializePricing();
	initializeBooking();
	initializeScene();
	initializeFooterAnimation();
	initializePreferences( () => {

		renderServices();
		renderProjects();
		renderPricing();
		if ( elements.dialog.open ) renderBookingStep();

	} );

}

initialize().catch( ( error ) => console.error( 'Unable to initialize Pozan Market', error ) );
