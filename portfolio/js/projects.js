import { t } from './preferences.js';
import bookBridgeLogo from '../assets/logos/bookbridge.png';
import cultiverseLogo from '../assets/logos/cultiverse.png';
import lostFoundLogo from '../assets/logos/lostfound.png';
import ulifeLogo from '../assets/logos/ulife.png';
import ulisEcoLogo from '../assets/logos/uliseco.png';
import urunLogo from '../assets/logos/urun.png';
import wulisLogo from '../assets/logos/wulis.jpg';

export const PROJECTS = [
	{ name: 'The Book Bridge', host: 'thebookbridge', logo: bookBridgeLogo },
	{ name: 'ULIS Lost and Found', host: 'ulislostandfound', logo: lostFoundLogo },
	{ name: 'WULIS', host: 'wulis', logo: wulisLogo },
	{ name: 'ULife', host: 'ulife', logo: ulifeLogo },
	{ name: 'URun — Be ULISer', host: 'urunbeuliser', logo: urunLogo },
	{ name: 'Cultiverse', host: 'cultiverse', logo: cultiverseLogo },
	{ name: 'ULIS Eco', host: 'uliseco', logo: ulisEcoLogo }
];

export function renderProjects() {

	document.querySelector( '[data-projects]' ).innerHTML = PROJECTS.map( ( project, index ) => `
		<article class="logo-project is-visible" data-reveal>
			<span class="project-index" aria-hidden="true">0${index + 1}</span>
			<div class="project-logo"><img src="${project.logo}" alt="${project.name}" loading="lazy" width="300" height="160"></div>
			<a class="project-link" href="https://${project.host}.framer.website" target="_blank" rel="noopener noreferrer" aria-label="${t( 'project.open' )}: ${project.name}">${t( 'project.visit' )} <span aria-hidden="true">↗</span></a>
		</article>
	` ).join( '' );

}
