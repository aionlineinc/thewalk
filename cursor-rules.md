# Cursor rules: theWalk Redesign

Project: theWalk Redesign (theWalk Ministries Inc)  
Design mode: clone  
Output mode: docs_scaffold_shell

## Outcome and scope
Success: 	•	Users clearly understand the 3 core pathways
	•	Increased participation in Cross Over, Cross Roads, Cross Connect
	•	Strong engagement across pathway sections
	•	Repeat visitors engaging with teachings and content
	•	Clear comprehension of ministry structure and purpose
	•	Marketplace and advanced e-commerce (donations / fund raising projects, sales of books and t-shirts)
	•	Basic User account logic for phase 1  
Must-have: 	•	Structured pathway sections (Cross Over, Cross Roads, Cross Connect)
	•	Clear journey-based navigation
	•	Media/teaching delivery
	•	Responsive design
	•	CMS-driven content
	•	Clear CTA flows  
Out of scope: 	•	No complex enterprise systems

## Design bar
Good design is characterized by simplicity, functionality, and aesthetic appeal. It effectively communicates the intended message while providing an intuitive user experience. In the context of a minimal/clean style family, good design avoids unnecessary complexity and focuses on clarity, ensuring that every element serves a purpose and contributes to the overall harmony of the design.  
Match: 	•	Superpower-level spacing
	•	Typography hierarchy
	•	Minimal UI system
	•	Smooth transitions
	•	Clean layout structure | Improve: 	•	Add clearer journey progression
	•	More structured storytelling
	•	Stronger pathway segmentation | Boundaries: What to avoid
	•	Generic church layouts
	•	Cluttered sections
	•	Overuse of imagery
	•	Visual noise
	•	Weak hierarchy  
A11y: Ensure all design elements meet WCAG 2.1 AA standards, focusing on color contrast, keyboard navigation, and screen reader compatibility to provide an inclusive experience for users with disabilities. | Brand tokens: Use a consistent color palette that reflects theWalk Ministries' identity, such as soft earth tones and calming blues, to convey a sense of peace and spirituality. Incorporate typography that is clean and modern, with a focus on readability and hierarchy to guide users through the content effectively. Utilize generous whitespace to maintain a minimal and uncluttered design, ensuring that each element has space to breathe and contribute to the overall clarity and simplicity of the site.

## Brand visuals (ZIP)
Yes — open files under `assets/` in the ZIP (see `docs/asset-inventory.md`). Follow `docs/asset-inventory.md`; binaries live under `assets/<kind>/`.

## Technical
web, API | Auth Yes | Payments Yes | File uploads Yes | Notifications Yes | Analytics Yes  
Strapi, Stripe for donations and sales of items, classes, google analytics  
Ensure compliance with GDPR and data handling best practices, particularly focusing on user data protection, consent management, and secure data storage. Regular audits and staff training on compliance protocols are recommended to maintain adherence to these standards.

## Stack
Next.js, PostgreSQL, Prisma, Tailwind CSS, Redis, Strapi

## Core workflows
	•	Discover ministry → understand identity → choose pathway
	•	Cross Over → entry / transformation
	•	Cross Roads → growth / decision-making
	•	Cross Connect → community / impact

Additional:
	•	Browse teachings → engage → return
	•	Learn → reflect → take action

## Required agents and skills
product-strategist, ux-designer, frontend-engineer, qa-engineer, backend-engineer  
architecture-skill, frontend-skill, testing-skill, backend-skill, security-skill
