import { t } from './preferences.js';

export const PROJECTS = [
	{ name: 'The Book Bridge', host: 'thebookbridge', logo: 'bookbridge.png' },
	{ name: 'ULIS Lost and Found', host: 'ulislostandfound', logo: 'lostfound.png' },
	{ name: 'WULIS', host: 'wulis', logo: 'wulis.jpg' },
	{ name: 'ULife', host: 'ulife', logo: 'ulife.png' },
	{ name: 'URun — Be ULISer', host: 'urunbeuliser', logo: 'urun.png' },
	{ name: 'Cultiverse', host: 'cultiverse', logo: 'cultiverse.png' },
	{ name: 'ULIS Eco', host: 'uliseco', logo: 'uliseco.png' }
];

export function renderProjects() {

	document.querySelector( '[data-projects]' ).innerHTML = PROJECTS.map( ( project, index ) => `
		<article class="logo-project is-visible" data-reveal>
			<span class="project-index" aria-hidden="true">0${index + 1}</span>
			<div class="project-logo"><img src="./assets/logos/${project.logo}" alt="${project.name}" loading="lazy" width="300" height="160"></div>
			<a class="project-link" href="https://${project.host}.framer.website" target="_blank" rel="noopener noreferrer" aria-label="${t( 'project.open' )}: ${project.name}">${t( 'project.visit' )} <span aria-hidden="true">↗</span></a>
		</article>
	` ).join( '' );

}
