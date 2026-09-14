const LANGUAGE_KEY = 'pozan_language';
const THEME_KEY = 'pozan_theme';

const COPY = {
	en: {
		'nav.home': 'Home', 'nav.services': 'Services', 'nav.work': 'Work', 'nav.pricing': 'Pricing', 'nav.about': 'About',
		'action.start': 'Start a project <span aria-hidden="true">↗</span>', 'action.viewWork': 'View selected work <span aria-hidden="true">↓</span>',
		'hero.available': '<span></span> Available for freelance projects', 'hero.discipline': 'Independent designer & creative developer',
		'hero.title': 'Ideas into<br><em>experiences.</em><br><span class="hero-outline">Made real.</span>',
		'hero.description': 'Websites, landing pages, UI/UX and visual presentations designed for brands, startups and ideas that want to stand out.',
		'hero.capabilities': 'Web <i></i> UI/UX <i></i> Presentation <i></i> Creative design',
		'hero.bottom': 'Independent by choice. Creative by nature.', 'hero.explore': 'Explore my work <span aria-hidden="true">↓</span>',
		'services.eyebrow': '<span>01</span> Capabilities', 'services.title': 'What I can build<br>for <em>you.</em>', 'services.description': 'One creative partner from first sketch to final interaction.',
		'work.eyebrow': '<span>02</span> Selected projects / 07', 'work.title': 'Out in the <em>world.</em>', 'work.description': 'Real projects. Each with a world of its own.<br>Explore the live websites below.',
		'value.eyebrow': '<span>03</span> The difference', 'value.title': 'More than just<br>a pretty <em>interface.</em>',
		'value.1.title': 'Creative direction', 'value.1.text': 'I do not simply code a template. I build a visual direction around the idea, audience and desired feeling.',
		'value.2.title': 'Responsive by default', 'value.2.text': 'Desktop, tablet and mobile are treated as one coherent system—not three last-minute adaptations.',
		'value.3.title': 'Design + development', 'value.3.text': 'One connected workflow can handle both the visual thinking and the implementation, with fewer gaps between them.',
		'process.eyebrow': '<span>04</span> Workflow', 'process.title': 'From idea to <em>delivery.</em>',
		'process.1.title': 'Choose a service', 'process.1.text': 'Choose what you need and select a package.',
		'process.2.title': 'Tell me about it', 'process.2.text': 'Answer a short, focused project brief.',
		'process.3.title': 'Design & build', 'process.3.text': 'The project moves into design and development.',
		'process.4.title': 'Review & delivery', 'process.4.text': 'Review the work and receive the final files or product.',
		'pricing.eyebrow': '<span>05</span> Packages', 'pricing.title': 'Your next idea.<br><em>The right starting point.</em>', 'pricing.description': 'Thoughtful design, clearly priced. Find your fit, then make it yours.',
		'pricing.note': 'Need a dashboard, database, authentication or custom system?', 'pricing.scope': 'Let’s scope it together ↗',
		'pricing.direct': '↗ &nbsp; Direct collaboration', 'pricing.responsive': '◇ &nbsp; Responsive by default', 'pricing.agreed': '✓ &nbsp; Scope agreed before we begin',
		'about.eyebrow': '<span>06</span> About', 'about.title': 'Designing between<br><em>code and creativity.</em>',
		'about.p1': 'I’m a Software Engineering student and multidisciplinary designer focused on building websites, interfaces and visual experiences.',
		'about.p2': 'I care about the space where a strong concept becomes something real, usable and unexpectedly memorable.',
		'faq.eyebrow': '<span>07</span> Questions', 'faq.title': 'Before we<br><em>begin.</em>',
		'faq.1.q': 'Do you build websites from scratch or use templates?', 'faq.1.a': 'Everything is custom-built from scratch. I do not use off-the-shelf templates or visual page builders like Elementor. The code is written specifically for your design, ensuring maximum performance, security, and unique visual direction.',
		'faq.2.q': 'How do interactive 3D elements impact page speed?', 'faq.2.a': 'I use advanced WebGL optimization techniques, such as lazy-loading, polygon reduction, and visibility pausing. This keeps creative interactions smooth without wasting mobile battery.',
		'faq.3.q': 'What technologies and frameworks do you use?', 'faq.3.a': 'For creative landing pages, I often use Vanilla JS, Three.js and GSAP. For complex web apps, I build with React, Next.js, Tailwind CSS and headless CMS solutions.',
		'faq.4.q': 'Do I need to provide the design files?', 'faq.4.a': 'Not necessarily. I can develop an existing Figma design or handle both UI/UX design and development from your initial concept.',
		'faq.5.q': 'Will my website be optimized for SEO?', 'faq.5.a': 'Yes. Websites are built with semantic HTML, performance, metadata and responsive design as technical SEO foundations.',
		'faq.6.q': 'How does the handover and hosting process work?', 'faq.6.a': 'After approval, I can deploy the site, connect your domain and hand over the complete source code and assets.',
		'faq.7.q': 'Do you offer ongoing maintenance after launch?', 'faq.7.a': 'Yes. I offer a 30-day bug-fix guarantee and can arrange ongoing support for content, features or server maintenance.',
		'cta.eyebrow': '<span>08</span> Your move', 'cta.title': 'Have an idea?<br><em>Let’s make it real.</em>', 'cta.button': 'Start your project <span aria-hidden="true">↗</span>',
		'footer.copyright': '© 2026 Pozan Market. Built with intent.', 'footer.eyebrow': 'Independent creative studio · Hanoi / Worldwide',
		'footer.heading': 'Let’s build something<br><em>worth remembering.</em>', 'footer.description': 'Web experiences, visual systems and digital products shaped with intent.', 'footer.follow': 'Connect with me', 'footer.back': 'Back to top ↑',
		'booking.request': 'Project request', 'booking.back': 'Back', 'booking.continue': 'Continue <span aria-hidden="true">→</span>',
		'service.starting': 'Starting at', 'service.configure': 'Configure',
		'project.visit': 'Visit website', 'project.open': 'Open website in a new tab',
		'pricing.creative': 'Creative services', 'pricing.customCaption': 'For ideas that need something different.', 'pricing.firstCaption': 'A considered foundation for your next idea.',
		'pricing.secondCaption': 'More personality. More possibilities.', 'pricing.thirdCaption': 'An experience with every detail considered.', 'pricing.included': 'Included in your project',
		'pricing.talk': 'Let’s talk', 'pricing.startWith': 'Start with', 'pricing.tailored': 'Tailored to your scope', 'pricing.starting': 'Starting from', 'pricing.investment': 'Project investment',
		'booking.select': 'Select option', 'booking.serviceKicker': '01 / Service', 'booking.serviceTitle': 'What would you like me to <em>create?</em>',
		'booking.packageTitle': 'Choose your <em>package.</em>', 'booking.projectKicker': '03 / Project type', 'booking.projectTitle': 'What is your project <em>about?</em>',
		'booking.goalKicker': '04 / Goal', 'booking.goalTitle': 'What is the main <em>goal?</em>', 'booking.styleKicker': '05 / Visual direction', 'booking.styleTitle': 'What should it <em>feel like?</em>',
		'booking.contentKicker': '06 / Content', 'booking.contentTitle': 'Do you already have your <em>content?</em>',
		'booking.materialsKicker': '07 / Materials', 'booking.materialsTitle': 'Upload your <em>materials.</em>', 'booking.materialsHint': 'Files remain in this browser session only. Nothing is uploaded to a server.',
		'booking.drop': 'Drop files here or click to browse', 'booking.fileTypes': 'Images, PDF and documents · 10 MB per file', 'booking.skip': 'Skip for now', 'booking.remove': 'Remove',
		'booking.detailsKicker': '08 / Details', 'booking.detailsTitle': 'Anything else I should <em>know?</em>', 'booking.notes': 'Project notes · optional',
		'booking.notesPlaceholder': 'Tell me about features, animations, references, functionality or any specific ideas you have.',
		'booking.timingKicker': '09 / Timing', 'booking.timingTitle': 'When do you <em>need it?</em>', 'booking.deadline': 'Preferred deadline', 'booking.flexible': 'My deadline is flexible',
		'booking.contactKicker': '10 / Contact', 'booking.contactTitle': 'How can I <em>reach you?</em>', 'booking.name': 'Name *', 'booking.email': 'Email',
		'booking.phone': 'Phone / Zalo', 'booking.yourName': 'Your name', 'booking.yourPhone': 'Your phone number', 'booking.preferred': 'Preferred contact method',
		'booking.reviewKicker': 'Review / Project summary', 'booking.reviewTitle': 'Everything looks <em>right?</em>', 'booking.service': 'Service', 'booking.package': 'Package',
		'booking.estimate': 'Estimated price', 'booking.projectType': 'Project type', 'booking.goal': 'Goal', 'booking.style': 'Style', 'booking.contact': 'Contact', 'booking.notesShort': 'Notes',
		'booking.edit': 'Edit project details', 'booking.ready': 'Project brief ready', 'booking.successTitle': 'Awesome.<br><em>Let’s make something great.</em>',
		'booking.successText': 'Your project brief has been saved locally. You can view it in the Admin Dashboard.', 'booking.home': 'Back home <span aria-hidden="true">↗</span>',
		'booking.complete': 'Complete', 'booking.summary': 'Summary', 'booking.step': 'Step', 'booking.submit': 'Submit project <span aria-hidden="true">↗</span>',
		'error.choose': 'Please choose one option to continue.', 'error.deadline': 'Choose a preferred deadline or mark it as flexible.', 'error.name': 'Please enter your name.',
		'error.contact': 'Enter at least an email or phone / Zalo number.', 'error.email': 'Please enter a valid email address.', 'error.method': 'Choose your preferred contact method.',
		'error.file': 'Files larger than 10 MB were not added.', 'date.flexible': 'Flexible', 'date.none': 'Not specified',
		'admin.workspace': 'Workspace', 'admin.all': 'All projects', 'admin.new': 'New inquiries', 'admin.active': 'In progress', 'admin.completed': 'Completed', 'admin.archived': 'Archived',
		'admin.viewSite': 'View site <span aria-hidden="true">↗</span>', 'admin.local': 'Local workspace', 'admin.localNote': 'Data is stored on this browser only.',
		'admin.kicker': '<span>ADMIN</span> / PROJECT WORKSPACE', 'admin.title': 'Your project pipeline.',
		'admin.export': '<span aria-hidden="true">↓</span> Export CSV', 'admin.open': 'Open portfolio <span aria-hidden="true">↗</span>',
		'admin.current': 'Current projects', 'admin.currentNote': 'Everything outside the archive', 'admin.newNote': 'Waiting for your first response',
		'admin.activeNote': 'Projects you are working on', 'admin.completedNote': 'Finished project history', 'admin.results': 'results',
		'admin.search': 'Search client, request, goal or service…', 'admin.allServices': 'All services', 'admin.newest': 'Newest first', 'admin.oldest': 'Oldest first', 'admin.deadlineSort': 'Nearest deadline',
		'admin.clear': 'Clear all data', 'admin.footer': 'Pozan Market / Local project workspace', 'admin.detailsKicker': '<span>PROJECT</span> / FULL BRIEF',
		'admin.pipeline': '<span>01</span> PROJECT PIPELINE', 'admin.needsResponse': '<span>02</span> NEEDS YOUR RESPONSE', 'admin.activeWork': '<span>03</span> ACTIVE WORK',
		'admin.finishedWork': '<span>04</span> FINISHED WORK', 'admin.archive': '<span>05</span> PROJECT ARCHIVE',
		'admin.status.new': 'New', 'admin.status.contacted': 'Contacted', 'admin.status.in-progress': 'In progress', 'admin.status.completed': 'Completed', 'admin.status.archived': 'Archived',
		'admin.client': 'Client', 'admin.unnamed': 'Unnamed client', 'admin.noContact': 'No contact supplied', 'admin.need': 'What they need', 'admin.service': 'Service',
		'admin.deadline': 'Deadline', 'admin.received': 'Received', 'admin.statusFor': 'Status for', 'admin.viewBrief': 'View full brief', 'admin.markCompleted': 'Mark completed',
		'admin.noBrief': 'No detailed project brief was provided.', 'admin.notSpecified': 'Not specified', 'admin.empty': 'Your workspace is clear.',
		'admin.emptyText': 'New project requests from the portfolio booking flow will appear here.', 'admin.noResults': 'No matching projects found.',
		'admin.noResultsText': 'Try changing the search term or service filter, or choose another project category.', 'admin.showAll': 'Show all projects', 'admin.viewPortfolio': 'View portfolio',
		'admin.intent': 'Project intent', 'admin.servicePackage': 'Service & package', 'admin.email': 'Email', 'admin.phone': 'Phone / Zalo', 'admin.projectType': 'Project type',
		'admin.preferred': 'Preferred contact', 'admin.visual': 'Visual direction', 'admin.contentStatus': 'Content status', 'admin.fullNotes': 'Full requirements & notes',
		'admin.submitted': 'Submitted', 'admin.files': 'Files selected', 'admin.noFiles': 'No files', 'admin.fileRefs': 'browser-local file reference(s)',
		'admin.markProjectCompleted': 'Mark project completed', 'admin.emailClient': 'Email client', 'admin.callClient': 'Call client', 'admin.copyContact': 'Copy contact', 'admin.delete': 'Delete',
		'admin.movedCompleted': 'Project moved to Completed.', 'admin.statusUpdated': 'Project status updated.', 'admin.deleted': 'Project deleted.',
		'admin.noExport': 'There are no projects to export.', 'admin.exportReady': 'CSV export ready.', 'admin.contactCopied': 'Contact copied.',
		'admin.cleared': 'All project data cleared.', 'admin.deleteConfirm': 'Delete this client project? This cannot be undone.', 'admin.clearConfirm': 'Clear every locally saved project? This cannot be undone.',
		'admin.catalog': 'Services & pricing', 'admin.bookingSetup': 'Booking options', 'admin.catalogHeading': 'Services & pricing.', 'admin.optionsHeading': 'Booking options.',
		'admin.catalogTitle': 'Manage your service catalog.', 'admin.catalogIntro': 'Edit prices, descriptions and packages. Saved changes appear on the portfolio immediately.',
		'admin.restoreDefaults': 'Restore defaults', 'admin.addService': 'Add service', 'admin.optionsTitle': 'Shape the project brief.', 'admin.optionsIntro': 'One choice per line. These options are used in the customer booking flow.', 'admin.saveOptions': 'Save booking options',
		'admin.projectTypes': 'Project types', 'admin.projectGoals': 'Project goals', 'admin.contentChoices': 'Content readiness', 'admin.visualStyles': 'Visual styles',
		'admin.serviceName': 'Service name', 'admin.basePrice': 'Starting price', 'admin.description': 'Description', 'admin.packages': 'Packages', 'admin.packageName': 'Package name', 'admin.packagePrice': 'Package price', 'admin.packageFeatures': 'Included features · one per line',
		'admin.saveProduct': 'Save product', 'admin.addPackage': 'Add package', 'admin.removePackage': 'Remove package', 'admin.serviceId': 'Service ID', 'admin.removeService': 'Remove service',
		'admin.productRequired': 'Add a service name and starting price.', 'admin.productSaved': 'Service and pricing saved.', 'admin.productRemoved': 'Service removed.', 'admin.newServiceName': 'New service',
		'admin.optionsRequired': 'Each booking group needs at least one option.', 'admin.optionsSaved': 'Booking options saved.', 'admin.catalogReset': 'Default catalog restored.', 'admin.removeServiceConfirm': 'Remove this service and all of its packages?', 'admin.resetCatalogConfirm': 'Restore the original services and prices?',
		'admin.progressTitle': 'Project delivery progress', 'admin.phase': 'Current phase', 'admin.targetDate': 'Target delivery', 'admin.progress': 'Progress', 'admin.internalNotes': 'Private notes', 'admin.internalNotesPlaceholder': 'Decisions, blockers, client feedback or next action…',
		'admin.checklist': 'Delivery checklist', 'admin.newTaskPlaceholder': 'Add the next deliverable…', 'admin.addTask': 'Add task', 'admin.saveProgress': 'Save progress', 'admin.progressSaved': 'Project progress saved.', 'admin.taskDone': 'Task completed', 'admin.taskName': 'Task name', 'admin.removeTask': 'Remove task',
		'admin.phase.discovery': 'Discovery', 'admin.phase.planning': 'Planning', 'admin.phase.design': 'Design', 'admin.phase.development': 'Development', 'admin.phase.review': 'Client review', 'admin.phase.delivery': 'Delivery'
	},
	vi: {
		'nav.home': 'Trang chủ', 'nav.services': 'Dịch vụ', 'nav.work': 'Dự án', 'nav.pricing': 'Báo giá', 'nav.about': 'Giới thiệu',
		'action.start': 'Bắt đầu dự án <span aria-hidden="true">↗</span>', 'action.viewWork': 'Xem dự án nổi bật <span aria-hidden="true">↓</span>',
		'hero.available': '<span></span> Đang nhận dự án freelance', 'hero.discipline': 'Nhà thiết kế & lập trình viên sáng tạo độc lập',
		'hero.title': 'Biến ý tưởng thành<br><em>trải nghiệm.</em><br><span class="hero-outline">Hiện thực hoá.</span>',
		'hero.description': 'Website, landing page, UI/UX và thuyết trình trực quan dành cho thương hiệu, startup và những ý tưởng muốn tạo khác biệt.',
		'hero.capabilities': 'Web <i></i> UI/UX <i></i> Thuyết trình <i></i> Thiết kế sáng tạo',
		'hero.bottom': 'Độc lập trong lựa chọn. Sáng tạo trong bản chất.', 'hero.explore': 'Khám phá dự án <span aria-hidden="true">↓</span>',
		'services.eyebrow': '<span>01</span> Năng lực', 'services.title': 'Tôi có thể xây dựng<br>gì cho <em>bạn.</em>', 'services.description': 'Một đối tác sáng tạo xuyên suốt từ phác thảo đầu tiên đến tương tác cuối cùng.',
		'work.eyebrow': '<span>02</span> Dự án nổi bật / 07', 'work.title': 'Những sản phẩm đã<br><em>ra thế giới.</em>', 'work.description': 'Các dự án thực tế, mỗi dự án có một bản sắc riêng.<br>Khám phá website trực tiếp bên dưới.',
		'value.eyebrow': '<span>03</span> Điểm khác biệt', 'value.title': 'Không chỉ là một<br><em>giao diện đẹp.</em>',
		'value.1.title': 'Định hướng sáng tạo', 'value.1.text': 'Tôi không chỉ code một mẫu có sẵn. Mỗi hướng hình ảnh được xây dựng từ ý tưởng, đối tượng và cảm xúc mong muốn.',
		'value.2.title': 'Tương thích mọi màn hình', 'value.2.text': 'Desktop, tablet và mobile được thiết kế như một hệ thống thống nhất ngay từ đầu.',
		'value.3.title': 'Thiết kế + phát triển', 'value.3.text': 'Một quy trình liền mạch xử lý cả tư duy hình ảnh lẫn triển khai kỹ thuật, hạn chế khoảng cách giữa thiết kế và sản phẩm.',
		'process.eyebrow': '<span>04</span> Quy trình', 'process.title': 'Từ ý tưởng đến <em>bàn giao.</em>',
		'process.1.title': 'Chọn dịch vụ', 'process.1.text': 'Chọn nhu cầu và gói dịch vụ phù hợp.',
		'process.2.title': 'Chia sẻ ý tưởng', 'process.2.text': 'Trả lời một bản yêu cầu ngắn gọn và tập trung.',
		'process.3.title': 'Thiết kế & xây dựng', 'process.3.text': 'Dự án bước vào giai đoạn thiết kế và phát triển.',
		'process.4.title': 'Duyệt & bàn giao', 'process.4.text': 'Duyệt sản phẩm và nhận đầy đủ tệp hoặc sản phẩm hoàn thiện.',
		'pricing.eyebrow': '<span>05</span> Gói dịch vụ', 'pricing.title': 'Ý tưởng tiếp theo.<br><em>Điểm bắt đầu phù hợp.</em>', 'pricing.description': 'Thiết kế chỉn chu, chi phí rõ ràng. Chọn gói phù hợp rồi cá nhân hoá theo nhu cầu.',
		'pricing.note': 'Cần dashboard, cơ sở dữ liệu, đăng nhập hoặc hệ thống riêng?', 'pricing.scope': 'Cùng xác định phạm vi ↗',
		'pricing.direct': '↗ &nbsp; Trao đổi trực tiếp', 'pricing.responsive': '◇ &nbsp; Tương thích mọi màn hình', 'pricing.agreed': '✓ &nbsp; Chốt phạm vi trước khi bắt đầu',
		'about.eyebrow': '<span>06</span> Giới thiệu', 'about.title': 'Thiết kế tại giao điểm<br>của <em>code và sáng tạo.</em>',
		'about.p1': 'Tôi là sinh viên Kỹ thuật Phần mềm và nhà thiết kế đa lĩnh vực, tập trung xây dựng website, giao diện và trải nghiệm trực quan.',
		'about.p2': 'Tôi quan tâm đến khoảnh khắc một ý tưởng mạnh trở thành sản phẩm thật, dễ dùng và đủ khác biệt để được ghi nhớ.',
		'faq.eyebrow': '<span>07</span> Câu hỏi', 'faq.title': 'Trước khi<br><em>bắt đầu.</em>',
		'faq.1.q': 'Bạn xây dựng website từ đầu hay dùng template?', 'faq.1.a': 'Mỗi website đều được xây dựng riêng theo yêu cầu. Code và thiết kế được tối ưu cho hiệu năng, bảo mật và bản sắc hình ảnh của dự án.',
		'faq.2.q': 'Các thành phần 3D ảnh hưởng tốc độ trang thế nào?', 'faq.2.a': 'Tôi dùng lazy-load, tối ưu hình học và dừng render khi nội dung ngoài màn hình để giữ tương tác mượt mà và tiết kiệm pin trên mobile.',
		'faq.3.q': 'Bạn sử dụng công nghệ và framework nào?', 'faq.3.a': 'Với landing page sáng tạo, tôi thường dùng Vanilla JS, Three.js và GSAP. Với web app phức tạp, tôi dùng React, Next.js, Tailwind CSS và headless CMS.',
		'faq.4.q': 'Tôi có cần cung cấp file thiết kế không?', 'faq.4.a': 'Không bắt buộc. Tôi có thể phát triển từ file Figma có sẵn hoặc phụ trách cả UI/UX và lập trình từ ý tưởng ban đầu.',
		'faq.5.q': 'Website có được tối ưu SEO không?', 'faq.5.a': 'Có. Website được xây dựng với HTML có ngữ nghĩa, hiệu năng tốt, metadata và responsive làm nền tảng SEO kỹ thuật.',
		'faq.6.q': 'Quy trình bàn giao và hosting diễn ra thế nào?', 'faq.6.a': 'Sau khi duyệt, tôi có thể triển khai website, kết nối tên miền và bàn giao toàn bộ source code cùng tài nguyên.',
		'faq.7.q': 'Bạn có hỗ trợ bảo trì sau khi ra mắt không?', 'faq.7.a': 'Có. Tôi bảo hành sửa lỗi trong 30 ngày và có thể cung cấp gói hỗ trợ nội dung, tính năng hoặc máy chủ dài hạn.',
		'cta.eyebrow': '<span>08</span> Đến lượt bạn', 'cta.title': 'Có một ý tưởng?<br><em>Hãy biến nó thành thật.</em>', 'cta.button': 'Bắt đầu dự án <span aria-hidden="true">↗</span>',
		'footer.copyright': '© 2026 Pozan Market. Được xây dựng có chủ đích.', 'footer.eyebrow': 'Studio sáng tạo độc lập · Hà Nội / Toàn cầu',
		'footer.heading': 'Cùng tạo nên điều gì đó<br><em>đáng để ghi nhớ.</em>', 'footer.description': 'Trải nghiệm web, hệ thống hình ảnh và sản phẩm số được xây dựng có chủ đích.', 'footer.follow': 'Kết nối với tôi', 'footer.back': 'Lên đầu trang ↑',
		'booking.request': 'Yêu cầu dự án', 'booking.back': 'Quay lại', 'booking.continue': 'Tiếp tục <span aria-hidden="true">→</span>',
		'service.starting': 'Giá từ', 'service.configure': 'Chọn cấu hình',
		'project.visit': 'Xem website', 'project.open': 'Mở website trong tab mới',
		'pricing.creative': 'Dịch vụ sáng tạo', 'pricing.customCaption': 'Dành cho những ý tưởng cần một giải pháp riêng.', 'pricing.firstCaption': 'Nền tảng chỉn chu cho ý tưởng tiếp theo.',
		'pricing.secondCaption': 'Nhiều cá tính hơn. Nhiều khả năng hơn.', 'pricing.thirdCaption': 'Trải nghiệm được chăm chút đến từng chi tiết.', 'pricing.included': 'Bao gồm trong dự án',
		'pricing.talk': 'Trao đổi ngay', 'pricing.startWith': 'Chọn gói', 'pricing.tailored': 'Báo giá theo phạm vi', 'pricing.starting': 'Giá khởi điểm', 'pricing.investment': 'Chi phí dự án',
		'booking.select': 'Chọn phương án', 'booking.serviceKicker': '01 / Dịch vụ', 'booking.serviceTitle': 'Bạn muốn tôi <em>tạo ra điều gì?</em>',
		'booking.packageTitle': 'Chọn <em>gói dịch vụ.</em>', 'booking.projectKicker': '03 / Loại dự án', 'booking.projectTitle': 'Dự án của bạn <em>thuộc lĩnh vực nào?</em>',
		'booking.goalKicker': '04 / Mục tiêu', 'booking.goalTitle': 'Mục tiêu chính của dự án là <em>gì?</em>', 'booking.styleKicker': '05 / Phong cách hình ảnh', 'booking.styleTitle': 'Bạn muốn sản phẩm mang <em>cảm giác gì?</em>',
		'booking.contentKicker': '06 / Nội dung', 'booking.contentTitle': 'Bạn đã chuẩn bị <em>nội dung chưa?</em>',
		'booking.materialsKicker': '07 / Tài liệu', 'booking.materialsTitle': 'Tải lên <em>tài liệu dự án.</em>', 'booking.materialsHint': 'Tệp chỉ tồn tại trong phiên trình duyệt này và không được tải lên máy chủ.',
		'booking.drop': 'Thả tệp vào đây hoặc bấm để chọn', 'booking.fileTypes': 'Hình ảnh, PDF và tài liệu · tối đa 10 MB mỗi tệp', 'booking.skip': 'Bỏ qua bước này', 'booking.remove': 'Xoá',
		'booking.detailsKicker': '08 / Chi tiết', 'booking.detailsTitle': 'Còn điều gì tôi cần <em>biết?</em>', 'booking.notes': 'Ghi chú dự án · không bắt buộc',
		'booking.notesPlaceholder': 'Mô tả tính năng, hiệu ứng, website tham khảo, chức năng hoặc ý tưởng cụ thể của bạn.',
		'booking.timingKicker': '09 / Thời gian', 'booking.timingTitle': 'Khi nào bạn <em>cần sản phẩm?</em>', 'booking.deadline': 'Deadline mong muốn', 'booking.flexible': 'Deadline của tôi có thể linh hoạt',
		'booking.contactKicker': '10 / Liên hệ', 'booking.contactTitle': 'Tôi có thể <em>liên hệ với bạn</em> bằng cách nào?', 'booking.name': 'Tên *', 'booking.email': 'Email',
		'booking.phone': 'Điện thoại / Zalo', 'booking.yourName': 'Tên của bạn', 'booking.yourPhone': 'Số điện thoại của bạn', 'booking.preferred': 'Phương thức liên hệ ưu tiên',
		'booking.reviewKicker': 'Kiểm tra / Tóm tắt dự án', 'booking.reviewTitle': 'Mọi thông tin đã <em>chính xác?</em>', 'booking.service': 'Dịch vụ', 'booking.package': 'Gói',
		'booking.estimate': 'Chi phí dự kiến', 'booking.projectType': 'Loại dự án', 'booking.goal': 'Mục tiêu', 'booking.style': 'Phong cách', 'booking.contact': 'Liên hệ', 'booking.notesShort': 'Ghi chú',
		'booking.edit': 'Chỉnh sửa thông tin dự án', 'booking.ready': 'Yêu cầu dự án đã sẵn sàng', 'booking.successTitle': 'Tuyệt vời.<br><em>Hãy cùng tạo nên điều khác biệt.</em>',
		'booking.successText': 'Yêu cầu của bạn đã được lưu cục bộ và có thể xem trong trang quản trị.', 'booking.home': 'Về trang chủ <span aria-hidden="true">↗</span>',
		'booking.complete': 'Hoàn tất', 'booking.summary': 'Tóm tắt', 'booking.step': 'Bước', 'booking.submit': 'Gửi yêu cầu <span aria-hidden="true">↗</span>',
		'error.choose': 'Vui lòng chọn một phương án để tiếp tục.', 'error.deadline': 'Vui lòng chọn deadline hoặc đánh dấu linh hoạt.', 'error.name': 'Vui lòng nhập tên của bạn.',
		'error.contact': 'Vui lòng nhập ít nhất email hoặc số điện thoại / Zalo.', 'error.email': 'Vui lòng nhập đúng định dạng email.', 'error.method': 'Vui lòng chọn phương thức liên hệ.',
		'error.file': 'Các tệp lớn hơn 10 MB không được thêm.', 'date.flexible': 'Linh hoạt', 'date.none': 'Chưa xác định',
		'admin.workspace': 'Không gian làm việc', 'admin.all': 'Tất cả dự án', 'admin.new': 'Yêu cầu mới', 'admin.active': 'Đang thực hiện', 'admin.completed': 'Đã hoàn thành', 'admin.archived': 'Đã lưu trữ',
		'admin.viewSite': 'Xem website <span aria-hidden="true">↗</span>', 'admin.local': 'Dữ liệu cục bộ', 'admin.localNote': 'Dữ liệu chỉ được lưu trên trình duyệt này.',
		'admin.kicker': '<span>QUẢN TRỊ</span> / DỰ ÁN', 'admin.title': 'Tiến độ dự án của bạn.',
		'admin.export': '<span aria-hidden="true">↓</span> Xuất CSV', 'admin.open': 'Mở portfolio <span aria-hidden="true">↗</span>',
		'admin.current': 'Dự án hiện tại', 'admin.currentNote': 'Toàn bộ dự án chưa lưu trữ', 'admin.newNote': 'Đang chờ phản hồi đầu tiên',
		'admin.activeNote': 'Những dự án đang thực hiện', 'admin.completedNote': 'Lịch sử dự án đã hoàn thành', 'admin.results': 'kết quả',
		'admin.search': 'Tìm khách hàng, yêu cầu, mục tiêu hoặc dịch vụ…', 'admin.allServices': 'Tất cả dịch vụ', 'admin.newest': 'Mới nhất', 'admin.oldest': 'Cũ nhất', 'admin.deadlineSort': 'Deadline gần nhất',
		'admin.clear': 'Xoá toàn bộ dữ liệu', 'admin.footer': 'Pozan Market / Quản lý dự án cục bộ', 'admin.detailsKicker': '<span>DỰ ÁN</span> / YÊU CẦU ĐẦY ĐỦ',
		'admin.pipeline': '<span>01</span> TIẾN ĐỘ DỰ ÁN', 'admin.needsResponse': '<span>02</span> CẦN BẠN PHẢN HỒI', 'admin.activeWork': '<span>03</span> ĐANG THỰC HIỆN',
		'admin.finishedWork': '<span>04</span> ĐÃ HOÀN THÀNH', 'admin.archive': '<span>05</span> KHO LƯU TRỮ',
		'admin.status.new': 'Mới', 'admin.status.contacted': 'Đã liên hệ', 'admin.status.in-progress': 'Đang thực hiện', 'admin.status.completed': 'Hoàn thành', 'admin.status.archived': 'Lưu trữ',
		'admin.client': 'Khách hàng', 'admin.unnamed': 'Khách hàng chưa có tên', 'admin.noContact': 'Chưa có thông tin liên hệ', 'admin.need': 'Nhu cầu của khách', 'admin.service': 'Dịch vụ',
		'admin.deadline': 'Deadline', 'admin.received': 'Tiếp nhận', 'admin.statusFor': 'Trạng thái của', 'admin.viewBrief': 'Xem yêu cầu đầy đủ', 'admin.markCompleted': 'Đánh dấu hoàn thành',
		'admin.noBrief': 'Khách hàng chưa cung cấp mô tả chi tiết.', 'admin.notSpecified': 'Chưa xác định', 'admin.empty': 'Không gian làm việc đang trống.',
		'admin.emptyText': 'Yêu cầu dự án mới từ form trên portfolio sẽ xuất hiện tại đây.', 'admin.noResults': 'Không tìm thấy dự án phù hợp.',
		'admin.noResultsText': 'Hãy đổi từ khoá, bộ lọc dịch vụ hoặc chọn danh mục dự án khác.', 'admin.showAll': 'Hiện tất cả dự án', 'admin.viewPortfolio': 'Xem portfolio',
		'admin.intent': 'Mục tiêu dự án', 'admin.servicePackage': 'Dịch vụ & gói', 'admin.email': 'Email', 'admin.phone': 'Điện thoại / Zalo', 'admin.projectType': 'Loại dự án',
		'admin.preferred': 'Liên hệ ưu tiên', 'admin.visual': 'Hướng hình ảnh', 'admin.contentStatus': 'Tình trạng nội dung', 'admin.fullNotes': 'Yêu cầu & ghi chú đầy đủ',
		'admin.submitted': 'Ngày gửi', 'admin.files': 'Tệp đã chọn', 'admin.noFiles': 'Không có tệp', 'admin.fileRefs': 'tham chiếu tệp trong trình duyệt',
		'admin.markProjectCompleted': 'Đánh dấu dự án hoàn thành', 'admin.emailClient': 'Gửi email', 'admin.callClient': 'Gọi khách hàng', 'admin.copyContact': 'Sao chép liên hệ', 'admin.delete': 'Xoá',
		'admin.movedCompleted': 'Đã chuyển dự án sang mục Hoàn thành.', 'admin.statusUpdated': 'Đã cập nhật trạng thái dự án.', 'admin.deleted': 'Đã xoá dự án.',
		'admin.noExport': 'Không có dự án để xuất.', 'admin.exportReady': 'File CSV đã sẵn sàng.', 'admin.contactCopied': 'Đã sao chép liên hệ.',
		'admin.cleared': 'Đã xoá toàn bộ dữ liệu dự án.', 'admin.deleteConfirm': 'Xoá dự án của khách hàng này? Không thể hoàn tác.', 'admin.clearConfirm': 'Xoá toàn bộ dự án lưu cục bộ? Không thể hoàn tác.',
		'admin.catalog': 'Dịch vụ & báo giá', 'admin.bookingSetup': 'Tuỳ chọn đặt hàng', 'admin.catalogHeading': 'Dịch vụ & báo giá.', 'admin.optionsHeading': 'Tuỳ chọn đặt hàng.',
		'admin.catalogTitle': 'Quản lý danh mục dịch vụ.', 'admin.catalogIntro': 'Chỉnh giá, mô tả và từng gói. Thay đổi đã lưu sẽ xuất hiện ngay trên portfolio.',
		'admin.restoreDefaults': 'Khôi phục mặc định', 'admin.addService': 'Thêm dịch vụ', 'admin.optionsTitle': 'Thiết lập nội dung yêu cầu.', 'admin.optionsIntro': 'Mỗi dòng là một lựa chọn được hiển thị trong quy trình đặt dự án của khách.', 'admin.saveOptions': 'Lưu các lựa chọn',
		'admin.projectTypes': 'Loại dự án', 'admin.projectGoals': 'Mục tiêu dự án', 'admin.contentChoices': 'Tình trạng nội dung', 'admin.visualStyles': 'Phong cách hình ảnh',
		'admin.serviceName': 'Tên dịch vụ', 'admin.basePrice': 'Giá khởi điểm', 'admin.description': 'Mô tả', 'admin.packages': 'Các gói dịch vụ', 'admin.packageName': 'Tên gói', 'admin.packagePrice': 'Giá gói', 'admin.packageFeatures': 'Nội dung bao gồm · mỗi dòng một mục',
		'admin.saveProduct': 'Lưu sản phẩm', 'admin.addPackage': 'Thêm gói', 'admin.removePackage': 'Xoá gói', 'admin.serviceId': 'Mã dịch vụ', 'admin.removeService': 'Xoá dịch vụ',
		'admin.productRequired': 'Hãy nhập tên dịch vụ và giá khởi điểm.', 'admin.productSaved': 'Đã lưu dịch vụ và báo giá.', 'admin.productRemoved': 'Đã xoá dịch vụ.', 'admin.newServiceName': 'Dịch vụ mới',
		'admin.optionsRequired': 'Mỗi nhóm cần có ít nhất một lựa chọn.', 'admin.optionsSaved': 'Đã lưu các lựa chọn đặt hàng.', 'admin.catalogReset': 'Đã khôi phục danh mục mặc định.', 'admin.removeServiceConfirm': 'Xoá dịch vụ này cùng toàn bộ gói bên trong?', 'admin.resetCatalogConfirm': 'Khôi phục dịch vụ và mức giá ban đầu?',
		'admin.progressTitle': 'Tiến độ bàn giao dự án', 'admin.phase': 'Giai đoạn hiện tại', 'admin.targetDate': 'Ngày dự kiến bàn giao', 'admin.progress': 'Mức hoàn thành', 'admin.internalNotes': 'Ghi chú nội bộ', 'admin.internalNotesPlaceholder': 'Quyết định, trở ngại, phản hồi khách hàng hoặc việc tiếp theo…',
		'admin.checklist': 'Checklist bàn giao', 'admin.newTaskPlaceholder': 'Thêm đầu việc tiếp theo…', 'admin.addTask': 'Thêm việc', 'admin.saveProgress': 'Lưu tiến độ', 'admin.progressSaved': 'Đã lưu tiến độ dự án.', 'admin.taskDone': 'Đã hoàn thành', 'admin.taskName': 'Tên đầu việc', 'admin.removeTask': 'Xoá đầu việc',
		'admin.phase.discovery': 'Tiếp nhận', 'admin.phase.planning': 'Lập kế hoạch', 'admin.phase.design': 'Thiết kế', 'admin.phase.development': 'Lập trình', 'admin.phase.review': 'Khách hàng duyệt', 'admin.phase.delivery': 'Bàn giao'
	}
};

const VALUE_VI = {
	'Website': 'Website', 'Landing Page': 'Landing Page', 'UI/UX Design': 'Thiết kế UI/UX', 'Presentation Design': 'Thiết kế thuyết trình',
	'Canva Design': 'Thiết kế Canva', 'Social / Poster Design': 'Thiết kế Social / Poster', 'Other': 'Khác',
	'Starter': 'Khởi đầu', 'Professional': 'Chuyên nghiệp', 'Custom': 'Tuỳ chỉnh', 'Basic': 'Cơ bản', 'Creative': 'Sáng tạo', 'Premium': 'Cao cấp',
	'Personal': 'Cá nhân', 'Startup': 'Startup', 'Company': 'Doanh nghiệp', 'Education': 'Giáo dục', 'E-commerce': 'Thương mại điện tử', 'Event': 'Sự kiện',
	'Sell a product': 'Bán sản phẩm', 'Introduce a product': 'Giới thiệu sản phẩm', 'Build a brand': 'Xây dựng thương hiệu', 'Generate leads': 'Tìm kiếm khách hàng',
	'Build credibility': 'Xây dựng uy tín', 'Presentation': 'Thuyết trình',
	'Minimal': 'Tối giản', 'Modern': 'Hiện đại', 'Technology': 'Công nghệ', 'Anime Inspired': 'Cảm hứng Anime', 'Luxury': 'Sang trọng',
	'Landing page': 'Landing page', 'Design': 'Thiết kế', 'Phone': 'Điện thoại', 'Let’s discuss': 'Cùng trao đổi', 'Contact': 'Liên hệ',
	'Clean, simple and content-first.': 'Gọn gàng, đơn giản và ưu tiên nội dung.', 'Sleek gradients and polished layouts.': 'Gradient tinh tế cùng bố cục chỉn chu.',
	'Futuristic, technical and precise.': 'Tương lai, kỹ thuật và chính xác.', 'Abstract, expressive and unexpected.': 'Trừu tượng, giàu biểu cảm và bất ngờ.',
	'Dynamic sharp visuals and bold colors.': 'Hình ảnh sắc nét, năng động với màu sắc táo bạo.', 'Elegant serifs and restrained details.': 'Chữ serif thanh lịch cùng chi tiết tiết chế.',
	'Something else — I have references.': 'Một phong cách khác — tôi có hình ảnh tham khảo.',
	'Everything is ready.': 'Mọi nội dung đã sẵn sàng.', 'I have some content.': 'Tôi đã có một phần nội dung.', 'I don\'t have content yet.': 'Tôi chưa có nội dung.', 'I need help with content.': 'Tôi cần hỗ trợ nội dung.',
	'Modern responsive websites built around your brand, product and audience.': 'Website hiện đại, responsive, được xây dựng xoay quanh thương hiệu, sản phẩm và người dùng của bạn.',
	'Focused landing pages designed for product launches, campaigns and lead generation.': 'Landing page tập trung cho ra mắt sản phẩm, chiến dịch và chuyển đổi khách hàng.',
	'Clear interface systems shaped around user goals, hierarchy and effortless interaction.': 'Hệ thống giao diện rõ ràng, bám sát mục tiêu người dùng và trải nghiệm sử dụng.',
	'Structured, persuasive slide decks that make complex ideas feel clear and memorable.': 'Bộ slide mạch lạc, thuyết phục, giúp ý tưởng phức tạp trở nên dễ hiểu và đáng nhớ.',
	'Flexible branded templates your team can confidently adapt and reuse.': 'Template thương hiệu linh hoạt để đội ngũ dễ dàng chỉnh sửa và tái sử dụng.',
	'Distinct visual pieces built to stop the scroll and carry your message with precision.': 'Thiết kế thị giác nổi bật, thu hút chú ý và truyền tải thông điệp chính xác.',
	'A custom creative request that does not fit neatly into one category.': 'Yêu cầu sáng tạo tuỳ chỉnh không nằm trọn trong một danh mục.',
	'Business or personal website': 'Website doanh nghiệp hoặc cá nhân', '3–5 main sections': '3–5 khu vực chính', 'Responsive layout': 'Bố cục responsive',
	'Contact CTA': 'CTA liên hệ', 'Basic animation': 'Hiệu ứng cơ bản', 'Expanded custom layout': 'Bố cục tuỳ chỉnh mở rộng', 'Advanced animation': 'Hiệu ứng nâng cao',
	'Forms': 'Biểu mẫu', 'Responsive system': 'Hệ thống responsive', 'Complex structure': 'Cấu trúc phức tạp', 'Dashboard': 'Dashboard', 'Database': 'Cơ sở dữ liệu',
	'Authentication': 'Đăng nhập và phân quyền', 'Multi-page': 'Nhiều trang', 'Custom systems': 'Hệ thống tuỳ chỉnh',
	'1 page': '1 trang', '5–7 sections': '5–7 khu vực', 'Responsive': 'Responsive', 'CTA sections': 'Các khu vực CTA',
	'Custom visual direction': 'Định hướng hình ảnh riêng', '7–10 sections': '7–10 khu vực', 'Interactive components': 'Thành phần tương tác', 'Contact form': 'Form liên hệ',
	'Advanced visual concept': 'Concept hình ảnh nâng cao', 'Premium interactions': 'Tương tác cao cấp', 'Custom components': 'Component tuỳ chỉnh', 'High-end animation': 'Hiệu ứng cao cấp',
	'Core screen design': 'Thiết kế màn hình chính', 'Responsive thinking': 'Tư duy responsive', 'Reusable components': 'Component tái sử dụng', 'Developer-ready handoff': 'Bàn giao sẵn sàng cho developer',
	'Product flows': 'Luồng sản phẩm', 'Design system': 'Design system', 'Interactive prototype': 'Prototype tương tác', 'Complex product scope': 'Phạm vi sản phẩm phức tạp',
	'Up to 10 slides': 'Tối đa 10 slide', 'Clean visual system': 'Hệ thống hình ảnh rõ ràng', 'Content formatting': 'Định dạng nội dung', 'Editable source file': 'File nguồn có thể chỉnh sửa',
	'Custom art direction': 'Art direction riêng', 'Advanced layouts': 'Bố cục nâng cao', 'Visual storytelling': 'Kể chuyện bằng hình ảnh',
	'Custom branded layout': 'Bố cục theo thương hiệu', 'Reusable templates': 'Template tái sử dụng', 'Organized editable file': 'File chỉnh sửa được tổ chức rõ ràng', 'Export-ready assets': 'Tài nguyên sẵn sàng xuất',
	'One key visual direction': 'Một hướng key visual', 'Platform-ready sizes': 'Đúng kích thước nền tảng', 'High-resolution exports': 'File xuất độ phân giải cao', 'Source file': 'File nguồn',
	'Scope defined together': 'Cùng xác định phạm vi', 'Tailored deliverables': 'Sản phẩm bàn giao theo yêu cầu', 'Custom timeline': 'Tiến độ tuỳ chỉnh'
};

let language = localStorage.getItem( LANGUAGE_KEY ) === 'vi' ? 'vi' : 'en';

export function t( key ) {

	return COPY[ language ][ key ] ?? COPY.en[ key ] ?? key;

}

export function localizeValue( value ) {

	return language === 'vi' ? VALUE_VI[ value ] ?? value : value;

}

export function getLanguage() {

	return language;

}

function translateDocument() {

	document.documentElement.lang = language;
	document.querySelectorAll( '[data-i18n]' ).forEach( ( node ) => {

		node.textContent = t( node.dataset.i18n );

	} );
	document.querySelectorAll( '[data-i18n-html]' ).forEach( ( node ) => {

		node.innerHTML = t( node.dataset.i18nHtml );

	} );
	document.querySelectorAll( '[data-i18n-placeholder]' ).forEach( ( node ) => {

		node.placeholder = t( node.dataset.i18nPlaceholder );

	} );
	document.querySelectorAll( '[data-language]' ).forEach( ( button ) => {

		const selected = button.dataset.language === language;
		button.classList.toggle( 'is-active', selected );
		button.setAttribute( 'aria-pressed', String( selected ) );

	} );

}

function applyTheme( theme ) {

	const nextTheme = theme === 'light' ? 'light' : 'dark';
	document.documentElement.dataset.theme = nextTheme;
	document.querySelector( 'meta[name="theme-color"]' )?.setAttribute( 'content', nextTheme === 'light' ? '#f4f2ed' : '#08090d' );
	document.querySelectorAll( '[data-theme-toggle]' ).forEach( ( button ) => {

		const isLight = nextTheme === 'light';
		button.classList.toggle( 'is-light', isLight );
		button.setAttribute( 'aria-label', isLight ? ( language === 'vi' ? 'Chuyển sang nền tối' : 'Switch to dark theme' ) : ( language === 'vi' ? 'Chuyển sang nền sáng' : 'Switch to light theme' ) );
		button.setAttribute( 'aria-pressed', String( isLight ) );

	} );

}

export function initializePreferences( onLanguageChange ) {

	const savedTheme = localStorage.getItem( THEME_KEY ) || 'dark';
	translateDocument();
	applyTheme( savedTheme );
	document.querySelectorAll( '[data-language]' ).forEach( ( button ) => button.addEventListener( 'click', () => {

		const nextLanguage = button.dataset.language;
		if ( nextLanguage === language ) return;
		language = nextLanguage;
		localStorage.setItem( LANGUAGE_KEY, language );
		translateDocument();
		applyTheme( document.documentElement.dataset.theme );
		onLanguageChange?.();

	} ) );
	document.querySelectorAll( '[data-theme-toggle]' ).forEach( ( button ) => button.addEventListener( 'click', () => {

		const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
		localStorage.setItem( THEME_KEY, nextTheme );
		applyTheme( nextTheme );

	} ) );
	onLanguageChange?.();

}
