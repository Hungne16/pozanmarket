export const SERVICES = [
	{
		id: 'website',
		code: '01',
		name: 'Website',
		price: '1,200,000 VND',
		description: 'Modern responsive websites built around your brand, product and audience.',
		packages: [
			{ id: 'starter', name: 'Starter', price: '1,200,000 VND', estimate: '1,200,000 VND', features: [ 'Business or personal website', '3–5 main sections', 'Responsive layout', 'Contact CTA', 'Basic animation' ] },
			{ id: 'professional', name: 'Professional', price: '2,000,000 VND', estimate: '2,000,000 VND', features: [ 'Expanded custom layout', 'Advanced animation', 'Forms', 'Responsive system', 'Complex structure' ] },
			{ id: 'custom', name: 'Custom', price: 'Contact for pricing', estimate: 'Custom quote', features: [ 'Dashboard', 'Database', 'Authentication', 'Multi-page', 'Custom systems' ] }
		]
	},
	{
		id: 'landing',
		code: '02',
		name: 'Landing Page',
		price: '800,000 VND',
		description: 'Focused landing pages designed for product launches, campaigns and lead generation.',
		packages: [
			{ id: 'basic', name: 'Basic', price: '800,000 VND', estimate: '800,000 VND', features: [ '1 page', '5–7 sections', 'Responsive', 'Basic animation', 'CTA sections' ] },
			{ id: 'creative', name: 'Creative', price: '1,200,000 VND', estimate: '1,200,000 VND', featured: true, features: [ 'Custom visual direction', '7–10 sections', 'Advanced animation', 'Interactive components', 'Contact form' ] },
			{ id: 'premium', name: 'Premium', price: 'From 1,800,000 VND', estimate: 'From 1,800,000 VND', features: [ 'Advanced visual concept', 'Premium interactions', 'Custom components', 'High-end animation' ] }
		]
	},
	{
		id: 'uiux',
		code: '03',
		name: 'UI/UX Design',
		price: '600,000 VND',
		description: 'Clear interface systems shaped around user goals, hierarchy and effortless interaction.',
		packages: [
			{ id: 'starter', name: 'Starter', price: 'From 600,000 VND', estimate: 'From 600,000 VND', features: [ 'Core screen design', 'Responsive thinking', 'Reusable components', 'Developer-ready handoff' ] },
			{ id: 'custom', name: 'Custom', price: 'Contact', estimate: 'Custom quote', features: [ 'Product flows', 'Design system', 'Interactive prototype', 'Complex product scope' ] }
		]
	},
	{
		id: 'presentation',
		code: '04',
		name: 'Presentation Design',
		price: '300,000 VND',
		description: 'Structured, persuasive slide decks that make complex ideas feel clear and memorable.',
		packages: [
			{ id: 'basic', name: 'Basic', price: '300,000 VND / 10 slides', estimate: '300,000 VND / 10 slides', features: [ 'Up to 10 slides', 'Clean visual system', 'Content formatting', 'Editable source file' ] },
			{ id: 'professional', name: 'Professional', price: '400,000–500,000 VND / 10 slides', estimate: '400,000–500,000 VND / 10 slides', featured: true, features: [ 'Custom art direction', 'Advanced layouts', 'Visual storytelling', 'Editable source file' ] }
		]
	},
	{
		id: 'canva',
		code: '05',
		name: 'Canva Design',
		price: '300,000 VND',
		description: 'Flexible branded templates your team can confidently adapt and reuse.',
		packages: [
			{ id: 'starter', name: 'Starter', price: 'From 300,000 VND', estimate: 'From 300,000 VND', features: [ 'Custom branded layout', 'Reusable templates', 'Organized editable file', 'Export-ready assets' ] }
		]
	},
	{
		id: 'poster',
		code: '06',
		name: 'Social / Poster Design',
		price: '200,000 VND',
		description: 'Distinct visual pieces built to stop the scroll and carry your message with precision.',
		packages: [
			{ id: 'starter', name: 'Starter', price: 'From 200,000 VND', estimate: 'From 200,000 VND', features: [ 'One key visual direction', 'Platform-ready sizes', 'High-resolution exports', 'Source file' ] }
		]
	},
	{
		id: 'other',
		code: '07',
		name: 'Other',
		price: 'Let’s discuss',
		description: 'A custom creative request that does not fit neatly into one category.',
		packages: [
			{ id: 'custom', name: 'Custom', price: 'Contact', estimate: 'Custom quote', features: [ 'Scope defined together', 'Tailored deliverables', 'Custom timeline' ] }
		]
	}
];

const CATALOG_KEY = 'pozan_catalog';
const BOOKING_OPTIONS_KEY = 'pozan_booking_options';

function clone( value ) {

	return JSON.parse( JSON.stringify( value ) );

}

function loadStored( key, fallback ) {

	try {

		const stored = JSON.parse( localStorage.getItem( key ) || 'null' );
		return stored && typeof stored === 'object' ? stored : clone( fallback );

	} catch {

		return clone( fallback );

	}

}

const DEFAULT_SERVICES = clone( SERVICES );
const storedServices = loadStored( CATALOG_KEY, DEFAULT_SERVICES );
SERVICES.splice( 0, SERVICES.length, ...( Array.isArray( storedServices ) ? storedServices : DEFAULT_SERVICES ) );

const CORE_PRICING_CATEGORIES = [
	{ id: 'landing', label: 'Landing page' },
	{ id: 'website', label: 'Website' },
	{ id: 'design', label: 'Design' },
	{ id: 'presentation', label: 'Presentation' }
];

export const PRICING_CATEGORIES = [
	...CORE_PRICING_CATEGORIES,
	...SERVICES.filter( ( service ) => ! [ 'landing', 'website', 'uiux', 'canva', 'poster', 'presentation', 'other' ].includes( service.id ) ).map( ( service ) => ( { id: service.id, label: service.name } ) )
];

export const DESIGN_PRICING = [ 'uiux', 'canva', 'poster' ].map( ( serviceId ) => {

	const service = SERVICES.find( ( item ) => item.id === serviceId );
	return { ...service.packages[ 0 ], name: service.name, serviceId };

} );

const DEFAULT_BOOKING_OPTIONS = {
	projectTypes: [ 'Personal', 'Startup', 'Company', 'Education', 'E-commerce', 'Event', 'Other' ],
	projectGoals: [ 'Sell a product', 'Introduce a product', 'Build a brand', 'Generate leads', 'Build credibility', 'Presentation', 'Other' ],
	contentOptions: [ 'Everything is ready.', 'I have some content.', 'I don\'t have content yet.', 'I need help with content.' ],
	styles: [
		{ name: 'Minimal', className: 'style-minimal', desc: 'Clean, simple, focus on typography and whitespace.' },
		{ name: 'Modern', className: 'style-modern', desc: 'Sleek gradients, glassmorphism, and a premium modern feel.' },
		{ name: 'Technology', className: 'style-technology', desc: 'Futuristic, dark mode, glowing accents, cyber vibes.' },
		{ name: 'Creative', className: 'style-creative', desc: 'Abstract shapes, asymmetrical layouts, vibrant neon colors.' },
		{ name: 'Anime Inspired', className: 'style-anime', desc: 'Dynamic sharp angles, Japanese aesthetics, cel-shaded.' },
		{ name: 'Luxury', className: 'style-luxury', desc: 'Elegant serifs, metallic gold accents, high-end exclusivity.' },
		{ name: 'Other', className: 'style-other', desc: 'Something else? We can create whatever you envision.' }
	]
};
const storedBookingOptions = loadStored( BOOKING_OPTIONS_KEY, DEFAULT_BOOKING_OPTIONS );

export const PROJECT_TYPES = storedBookingOptions.projectTypes || clone( DEFAULT_BOOKING_OPTIONS.projectTypes );
export const PROJECT_GOALS = storedBookingOptions.projectGoals || clone( DEFAULT_BOOKING_OPTIONS.projectGoals );
export const CONTENT_OPTIONS = storedBookingOptions.contentOptions || clone( DEFAULT_BOOKING_OPTIONS.contentOptions );
export const STYLE_OPTIONS = storedBookingOptions.styles || clone( DEFAULT_BOOKING_OPTIONS.styles );

export function getDefaultStudioSettings() {

	return { services: clone( DEFAULT_SERVICES ), booking: clone( DEFAULT_BOOKING_OPTIONS ) };

}

export function saveCatalog( services ) {

	localStorage.setItem( CATALOG_KEY, JSON.stringify( services ) );

}

export function saveBookingOptions( options ) {

	localStorage.setItem( BOOKING_OPTIONS_KEY, JSON.stringify( options ) );

}

export function getService( serviceId ) {

	return SERVICES.find( ( service ) => service.id === serviceId );

}

export function getPackage( serviceId, packageId ) {

	return getService( serviceId )?.packages.find( ( item ) => item.id === packageId );

}
