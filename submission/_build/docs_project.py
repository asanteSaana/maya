"""Generates Project_Documentation.docx — the 25 sections the brief requires."""

import facts
from docbuild import (bullets, callout, code, figure, h1, h2, h3, new_document,
                      numbered, page_break, para, save, table, title_page, toc)


def build():
    doc = new_document("Maya — Complete Project Documentation")
    title_page(doc, facts.PROJECT_TITLE, "Complete Project Documentation", facts)
    toc(doc)

    # 1 --------------------------------------------------------------------
    h1(doc, "1. Project Title and Group Information")
    table(doc, ["Field", "Detail"], [
        ("Course", facts.COURSE),
        ("Group Number / Name", facts.GROUP_NAME),
        ("Project Title", facts.PROJECT_TITLE),
        ("Live application", facts.LIVE_URL),
        ("Administrator console", facts.ADMIN_URL),
        ("Source repository", facts.REPO_URL),
        ("Version", facts.VERSION),
        ("Date", facts.DATE),
    ], widths=[4.4, 11.4])
    para(doc, "Group members and their contributions appear on the title page of this document.",
         italic=True)
    callout(doc, "Before submitting.",
            "Every highlighted field must be completed. The brief requires the group number, "
            "project title, member names and student identifiers to appear clearly in the "
            "documentation, and each member must additionally record their individual "
            "contribution.")

    # 2 --------------------------------------------------------------------
    h1(doc, "2. Introduction and Background")
    para(doc, "Ghana's farmers grow food that reaches consumers through a chain of aggregators, "
              "wholesalers and market traders. Each intermediary takes a margin and adds delay. "
              "The farmer, holding no pricing power and no direct relationship with the person "
              "eating the food, receives a fraction of the retail price, while the consumer pays "
              "more for produce that is several days older than it needed to be.", align="justify")
    para(doc, "Mobile internet access has made an alternative practical. If a farmer can list "
              "produce as easily as sending a message, and a consumer can order it as easily as "
              "any other online purchase, the intermediate chain becomes optional. Maya is a web "
              "marketplace built on that premise: farmers publish what they have, consumers buy "
              "it directly, and both sides see the same price.", align="justify")
    para(doc, "The project was undertaken for CSCD602 to demonstrate the complete software "
              "engineering lifecycle — requirements, design, implementation, testing, deployment, "
              "documentation and planned evolution — on a system that genuinely works rather than "
              "one that merely demonstrates.", align="justify")

    # 3 --------------------------------------------------------------------
    h1(doc, "3. Problem Statement")
    para(doc, "Smallholder farmers cannot reach consumers directly. The absence of a shared "
              "marketplace produces four connected problems:", align="justify")
    numbered(doc, [
        "Farmers capture a small share of the final price because every intermediary takes a margin.",
        "Consumers pay more for produce that has lost freshness in transit and storage.",
        "Neither side can see the other's prices, so neither can judge whether a deal is fair.",
        "Produce is wasted when a farmer cannot find a buyer in time, while buyers elsewhere go unserved.",
    ])
    para(doc, "The absence is not of demand or of supply, but of a trusted place for the two to "
              "meet on equal terms.", align="justify")

    # 4 --------------------------------------------------------------------
    h1(doc, "4. Aim and Objectives")
    h2(doc, "4.1 Aim")
    para(doc, "To design, build, test and deploy a working web marketplace that lets farmers sell "
              "produce directly to consumers, applying advanced software engineering practice "
              "throughout.", align="justify")
    h2(doc, "4.2 Objectives")
    table(doc, ["Ref", "Objective", "Outcome"], [
        ("O1", "Elicit and specify requirements from the perspective of every stakeholder.",
         "Achieved — 36 functional and 17 non-functional requirements, with 6 recorded as unsatisfiable and why."),
        ("O2", "Design a maintainable architecture that keeps credentials off the client.",
         "Achieved — three-tier design with a server proxy; no secret reaches the browser."),
        ("O3", "Implement a complete application covering all three user roles.",
         f"Achieved — {facts.PAGE_ROUTES} routes, {facts.LOC} lines across {facts.JS_FILES} files."),
        ("O4", "Test against real data and resolve every defect found.",
         "Achieved — 14 defects found and fixed; all 29 system cases pass."),
        ("O5", "Deploy the application so it is publicly accessible.",
         "Achieved — deployed on Vercel and continuously updated from the repository."),
        ("O6", "Document the system for examiners, users and future maintainers.",
         "Achieved — six documents covering specification through evolution."),
        ("O7", "Plan for maintenance and future growth.",
         "Achieved — four-phase roadmap grounded in observed limitations."),
    ], widths=[1.2, 6.4, 8.2], font_size=9)

    # 5 --------------------------------------------------------------------
    page_break(doc)
    h1(doc, "5. Stakeholder Analysis")
    table(doc, ["Stakeholder", "Interest", "Influence", "How the system serves them"], [
        ("Farmers", "A wider market and a fairer share of the price.", "High — without sellers there is no marketplace.",
         "Self-service listings, control over stock and pricing, and the right to refuse an order."),
        ("Consumers", "Fresher produce at a transparent price.", "High — without buyers there is no trade.",
         "Searchable catalogue, persistent basket, and visible order status."),
        ("Marketplace administrators", "A healthy, trustworthy marketplace.", "Medium — set the rules.",
         "Console showing every order, listing oversight and role management."),
        ("The development team", "A defensible, maintainable system.", "High — make the design decisions.",
         "Layered architecture, documented decisions and legible history."),
        ("Course examiner", "Evidence of engineering competence.", "High — assesses the work.",
         "Working deployment, honest documentation and traceable testing."),
        ("Backend service owner", "Correct use of the API within its limits.", "High — controls the data.",
         "Rate limits respected; no attempt to work around authorisation."),
        ("Agricultural extension bodies", "Better market information for farmers.", "Low currently.",
         "Aggregate demand signals identified in the evolution roadmap."),
    ], widths=[3.0, 3.4, 3.4, 6.0], font_size=8.5)

    # 6 --------------------------------------------------------------------
    h1(doc, "6. Requirements Gathering and Analysis")
    h2(doc, "6.1 Techniques used")
    table(doc, ["Technique", "How it was applied", "What it produced"], [
        ("Stakeholder analysis", "Identifying who is affected and what each needs.",
         "Four user classes and the capabilities each requires."),
        ("Domain study", "Examining how produce currently reaches consumers.",
         "The problem statement and the case for disintermediation."),
        ("Competitor review", "Studying established marketplaces.",
         "Baseline expectations: search, filtering, basket, order history."),
        ("API investigation", "Systematically probing the backend to establish real behaviour.",
         "Constraints C-01 to C-10 and the six unsatisfiable requirements."),
        ("Prototype feedback", "Walking the deployed application as each role.",
         "Usability findings and several defects."),
    ], widths=[3.2, 6.0, 6.6], font_size=9)

    h2(doc, "6.2 Analysis: why investigation mattered more than documentation")
    para(doc, "The most consequential requirements activity was empirical. The supplied API "
              "documentation was taken as a starting hypothesis and tested. It proved wrong in "
              "four places, each of which would have invalidated a requirement had it been "
              "trusted:", align="justify")
    table(doc, ["Documented", "Actual", "Requirement affected"], [
        ("Cart can be updated and deleted.", "Both endpoints answer 404.", "Basket persistence had to be redesigned (C-04)."),
        ("Orders carry an array of products.", "One order is created per line.", "Order confirmation and history (C-05)."),
        ("Rate limit is 10 per second.", "Enforced at 10 per minute.", "Every data-access pattern (C-02)."),
        ("No all-orders endpoint, then one appeared.", "/api/orders/all was never a route; /api/partner/orders/system/all was added to the documentation mid-project.", "Administrator oversight now uses the system-wide route (FR-31)."),
    ], widths=[4.6, 5.2, 6.0], font_size=9)
    para(doc, "The lesson generalises: when a system depends on a service someone else controls, "
              "its documentation is a claim to be verified, not a specification to be relied on.",
         align="justify")

    # 7 --------------------------------------------------------------------
    h1(doc, "7. Software Requirements Specification")
    para(doc, "The full specification is a separate deliverable (SRS.docx). It defines 36 "
              "functional requirements, 17 non-functional requirements, 10 constraints, the "
              "assumptions the system rests on, and six requirements that cannot be met against "
              "the current backend, each traced to the change it would need.", align="justify")
    table(doc, ["Group", "Requirements", "Summary"], [
        ("Catalogue and discovery", "FR-01 – FR-08", "Browsing, search, filtering, sorting, pagination and product detail."),
        ("Basket and wishlist", "FR-09 – FR-13", "Adding, amending, totals, persistence and saved items."),
        ("Accounts", "FR-14 – FR-19", "Registration, sign-in, sessions, basket merging and profile."),
        ("Ordering", "FR-20 – FR-23", "Checkout, confirmation, history and order detail."),
        ("Selling", "FR-24 – FR-29", "Listings, publishing, editing, incoming orders and fulfilment."),
        ("Administration", "FR-30 – FR-34", "Overview, all-orders oversight, product review and roles."),
        ("Cross-cutting", "FR-35 – FR-36", "Role-based access and actionable error reporting."),
    ], widths=[3.4, 3.2, 9.2], font_size=9)

    # 8 --------------------------------------------------------------------
    page_break(doc)
    h1(doc, "8. System Analysis")
    para(doc, "Analysis translated the requirements into the actors, use cases and domain "
              "concepts the system must represent.", align="justify")
    figure(doc, "02_use_case.png", "Figure 2 — Actors and use cases.")
    para(doc, "Three role behaviours emerged. A guest may browse and fill a basket but not "
              "transact. A customer adds ordering and history. A farmer is a customer who may "
              "additionally sell. An administrator is a farmer who may additionally see the whole "
              "marketplace. Modelling roles as widening circles rather than disjoint sets removed "
              "a class of authorisation bug: an administrator never lacks a capability a lesser "
              "role has.", align="justify")
    figure(doc, "06_activity_checkout.png", "Figure 6 — The principal business process.")

    # 9, 10 ----------------------------------------------------------------
    h1(doc, "9. System Design")
    para(doc, "Design is covered fully in Design_Documentation.docx, including component design, "
              "the domain model, interaction sequences and eight recorded design decisions with "
              "the alternatives rejected. The essentials follow.", align="justify")

    h1(doc, "10. Architecture")
    figure(doc, "01_system_architecture.png", "Figure 1 — Three-tier architecture.")
    para(doc, "Maya is a three-tier system. The decisive choice is that the browser never "
              "contacts the REST API directly: every call passes through a proxy route on the "
              "application server, which attaches the API key and the user's token. Because the "
              "key cannot be scoped per user, any key delivered to a browser would expose the "
              "whole marketplace. Routing through the server costs one hop and creates a genuine "
              "trust boundary.", align="justify")
    figure(doc, "08_component_diagram.png", "Figure 8 — Front-end module structure.")
    para(doc, "Modules are layered so that no component imports a server module and no client "
              "service reaches past the single api module. That rule is what makes the security "
              "property structural rather than a matter of discipline: the code that reads the "
              "key is never part of the client dependency graph.", align="justify")

    # 11 -------------------------------------------------------------------
    h1(doc, "11. Database and Data Design")
    figure(doc, "07_er_model.png", "Figure 7 — Entity relationship model.")
    para(doc, "The database belongs to the REST service; Maya holds none of its own. Its "
              "constraints are nevertheless visible in the application's behaviour and are "
              "documented so a maintainer is not surprised by them: a unique index makes the "
              "saved cart write-once, an order holds a single embedded product object, sizes are "
              "a case-sensitive enumeration, and stock may be absent entirely rather than zero.",
         align="justify")
    para(doc, "Client-side storage is limited to what the backend cannot hold: the basket, the "
              "wishlist and a non-sensitive profile for first paint. Credentials live only in "
              "httpOnly cookies.", align="justify")

    # 12 -------------------------------------------------------------------
    h1(doc, "12. User Interface Design")
    figure(doc, "10_wireframes.png", "Figure 10 — Wireframes for the principal screens.")
    para(doc, "The interface derives from a purchased produce-marketplace template. Every screen "
              "built for this project reuses its markup and classes, so new pages are "
              "indistinguishable from the original design. Three rules govern the work: every "
              "data-driven screen renders a loading, empty or error state; errors appear beside "
              "the control that failed; and every layout reflows to a phone, with administrative "
              "tables becoming labelled stacks rather than scrolling sideways.", align="justify")

    # 13 -------------------------------------------------------------------
    page_break(doc)
    h1(doc, "13. Implementation")
    h2(doc, "13.1 Technology stack")
    table(doc, ["Technology", "Role"], list(facts.TECH), widths=[5.0, 10.8], font_size=9)

    h2(doc, "13.2 Scale of the implementation")
    table(doc, ["Measure", "Value"], [
        ("Application source", f"{facts.LOC} lines across {facts.JS_FILES} JavaScript files"),
        ("Page routes", f"{facts.PAGE_ROUTES}"),
        ("Server routes", f"{facts.API_ROUTES} (one proxy, four authentication)"),
        ("Service modules", f"{facts.SERVICE_MODULES}"),
        ("React contexts", "3 — session, basket, wishlist"),
        ("Custom stylesheet", f"{facts.CSS_LINES} lines added to the template's stylesheet"),
        ("Commits", f"{facts.COMMITS}"),
    ], widths=[5.4, 10.4], font_size=9)

    h2(doc, "13.3 Implementation highlights")
    h3(doc, "Keeping the API key server-side")
    para(doc, "A catch-all server route forwards browser requests to the REST service, adding the "
              "key from the server environment and the bearer token from an httpOnly cookie. The "
              "browser sees only same-origin requests.", align="justify")
    code(doc,
         "// pages/api/maya/[...path].js  (server only)\n"
         "const { status, data } = await backendRequest(path, {\n"
         "  method: req.method,\n"
         "  body: req.body,\n"
         "  token: getTokenFromRequest(req),   // from the httpOnly cookie\n"
         "});                                   // x-apiKey injected server-side\n"
         "res.status(status).json(data);")

    h3(doc, "Authentication without exposing a token")
    para(doc, "The sign-in route calls the service, removes the token from the reply, writes it "
              "into an httpOnly cookie and returns only the profile — so page JavaScript never "
              "holds a credential it could leak.", align="justify")

    h3(doc, "Surviving an unreliable backend")
    para(doc, "The service sleeps when idle and answers 502 or 503 while restarting. Server calls "
              "retry three times with increasing delay, and server-rendered pages degrade to an "
              "empty result with a client-side retry rather than returning an error page.",
         align="justify")

    h3(doc, "Validation and error handling")
    para(doc, "Errors are classified before display. A rate-limit refusal arrives as plain text "
              "rather than JSON and is read accordingly; internal database errors are replaced "
              "with neutral wording; an expired session clears state and returns the user to "
              "sign-in.", align="justify")

    h2(doc, "13.4 Code organisation")
    code(doc,
         "pages/            route components, one per URL\n"
         "  api/maya/       proxy to the REST service      (server only)\n"
         "  api/auth/       session issuing and clearing   (server only)\n"
         "  farmer/         seller area\n"
         "  admin/          administrator console\n"
         "src/\n"
         "  components/     shop · farmer · admin presentation components\n"
         "  context/        session, basket and wishlist state\n"
         "  hooks/          reusable behaviour\n"
         "  layout/         header, footer, page chrome\n"
         "  services/       one module per API resource; server modules kept apart\n"
         "middleware.js     route guarding at the edge\n"
         "styles/           template stylesheet plus the admin console styles")

    # 14 -------------------------------------------------------------------
    page_break(doc)
    h1(doc, "14. Testing and Quality Assurance")
    para(doc, "Testing is reported in full in Testing_Report.docx. Testing was conducted against "
              "the live service rather than a mock, which is why it found what it did.",
         align="justify")
    table(doc, ["Activity", "Result"], [
        ("Functional and system cases", "25 executed — 24 passed, 1 blocked by a backend limitation"),
        ("Automated cases", f"{facts.TOTAL_AUTOMATED_CASES} across 4 suites, all passing"),
        ("Security cases", "8, all passing"),
        ("Defects found and resolved", f"{len(facts.DEFECTS)}"),
        ("Linting", "Zero errors"),
        ("Production build", "Clean; all routes under 150 kB first load"),
    ], widths=[6.0, 9.8], font_size=9)
    para(doc, "Six of the ten defects would have been invisible against fabricated data. The most "
              "serious made seventeen of twenty-two products impossible to buy; another allowed a "
              "crafted link to redirect a user off-site immediately after signing in; a third "
              "meant a partly-failed order was reported to the customer as a total failure, "
              "inviting them to order twice.", align="justify")

    # 15 -------------------------------------------------------------------
    h1(doc, "15. Deployment")
    figure(doc, "09_deployment.png", "Figure 9 — Deployment topology.")
    table(doc, ["Aspect", "Detail"], [
        ("Platform", "Vercel, Node runtime"),
        ("Trigger", "Every push to main builds and deploys automatically"),
        ("Live URL", facts.LIVE_URL),
        ("Administrator console", facts.ADMIN_URL),
        ("Repository", f"{facts.REPO_URL} — main (released) and development (baseline)"),
        ("Configuration", "MAYA_API_KEY and MAYA_API_BASE_URL, set in the platform and never committed"),
        ("Rollback", "Redeploy a previous build from the platform's deployment history"),
    ], widths=[4.4, 11.4], font_size=9)
    callout(doc, "Secret handling.",
            "Configuration is server-side only and deliberately carries no NEXT_PUBLIC_ prefix, "
            "which would inline the value into the browser bundle. Environment files are excluded "
            "from version control, and no credential has been committed at any point.")

    # 16, 17 ---------------------------------------------------------------
    h1(doc, "16. User Manual")
    para(doc, "Supplied as a separate deliverable (User_Manual.docx), covering shoppers, farmers "
              "and administrators, with a troubleshooting section written in terms of what a user "
              "sees rather than what the system does internally.", align="justify")

    h1(doc, "17. System Administration and Maintenance Guide")
    h2(doc, "17.1 Routine administration")
    table(doc, ["Task", "How"], [
        ("Review marketplace activity", "Open /admin for totals, revenue and recent orders."),
        ("Investigate an order", "Use /admin/orders; search by product, town or reference."),
        ("Correct an order", "Change its status from the row, or delete it if it was placed in error."),
        ("Review listings", "Use /admin/products; edit any listing that is wrong."),
        ("Create a role", "Use /admin/roles and record the identifier it returns — roles cannot be listed afterwards."),
    ], widths=[5.0, 10.8], font_size=9)

    h2(doc, "17.2 Operational tasks")
    table(doc, ["Task", "Procedure"], [
        ("Rotate the API key", "Update MAYA_API_KEY in the hosting platform and redeploy; no code change is needed."),
        ("Deploy a change", "Merge to main; the platform builds and deploys automatically."),
        ("Roll back", "Promote the previous deployment from the platform's history."),
        ("Run locally", "Create .env.local with the two variables, then npm install and npm run dev."),
        ("Diagnose a failing call", "Check the platform's function logs; the proxy reflects the upstream status code."),
    ], widths=[5.0, 10.8], font_size=9)

    # 18 -------------------------------------------------------------------
    page_break(doc)
    h1(doc, "18. Security Considerations")
    table(doc, ["Risk", "Control"], [
        ("Disclosure of the API key", "Read only by server modules and injected per request; absent from the client bundle."),
        ("Session theft by injected script", "Token held in an httpOnly, SameSite=Lax, Secure cookie and never returned to the browser."),
        ("Open redirect after sign-in", "Only root-relative paths accepted; 14 automated cases cover hostile inputs."),
        ("Unauthorised access to privileged pages", "Edge middleware plus role checks; the backend authorises independently."),
        ("Disclosure of internal errors", "Database and validation internals replaced with neutral messages."),
        ("Credentials in version control", "Environment files ignored; secrets held only in the hosting platform."),
        ("Stale sessions", "Any 401 clears the session and returns the user to sign-in."),
    ], widths=[5.4, 10.4], font_size=9)
    para(doc, "Two limitations are stated plainly. Password strength is enforced only as a "
              "six-character minimum, since account policy belongs to the backend. And the edge "
              "guard checks only that a cookie is present — it makes the interface behave "
              "sensibly and nothing more is claimed for it; real authorisation is the backend's "
              "responsibility.", align="justify")

    # 19 -------------------------------------------------------------------
    h1(doc, "19. Challenges and Solutions")
    table(doc, ["Challenge", "Response", "Outcome"], [
        ("The API documentation was wrong in four places.",
         "Every endpoint was probed against the live service and the observed behaviour treated as authoritative.",
         "Constraints identified before they became defects in front of users."),
        ("Most of the catalogue appeared unbuyable.",
         "Traced to absent stock fields being coerced to zero; stock remodelled as tri-state.",
         "All products purchasable; the whole catalogue became usable."),
        ("The documented cart endpoints do not exist.",
         "Basket redesigned around client-side storage, with the saved cart seeded once, best-effort.",
         "Basket works reliably; no doomed writes consume the rate limit."),
        ("Orders are created without a transaction.",
         "Partial failures detected and reported honestly instead of as total failure.",
         "Customers are no longer invited to order twice."),
        ("A ten-request-per-minute limit.",
         "Writes patch local state instead of refetching; test scripts paced deliberately.",
         "Ordinary use stays within the limit."),
        ("The backend sleeps and cold-starts slowly.",
         "Retries with backoff on the server; pages degrade to a client retry.",
         "A cold start no longer produces an error page."),
        ("The admin shell offered was on an incompatible stack.",
         "Its conventions were adopted and rebuilt on the existing base rather than porting the code.",
         "One application, one session, one deployment."),
        ("No account can reach the administrator area.",
         "Recorded as a limitation rather than concealed; role creation surfaced in the console.",
         "The gap is documented and the route to closing it is clear."),
    ], widths=[4.6, 6.2, 5.0], font_size=8.5)

    # 20 -------------------------------------------------------------------
    h1(doc, "20. Limitations")
    para(doc, "Stated plainly, because a limitation acknowledged is a limitation that can be "
              "planned around.", align="justify")
    table(doc, ["Limitation", "Cause", "Consequence"], [
        ("No online payment.", "No payment endpoint or provider integration.", "Payment is arranged directly between buyer and farmer."),
        ("Farmers cannot self-register.", "Registration always returns the Customer role.", "Sellers must be provisioned on the backend."),
        ("No administrator account exists.", "The backend offers no way to assign an administrator role.", "The console's data path is unverified against real data."),
        ("No user management.", "No endpoint lists users.", "Accounts cannot be administered in-app."),
        ("Baskets do not follow a user between devices.", "The saved cart cannot be updated.", "The basket is device-local."),
        ("A basket becomes several orders.", "One order document per line.", "Multi-item purchases appear as separate orders."),
        ("Tight rate limit.", "Ten requests per minute.", "Heavy browsing could reach the limit."),
        ("Slow first request after idle.", "The backend sleeps.", "Mitigated by retries, not eliminated."),
        ("No automated end-to-end suite.", "Testing effort concentrated on live integration.", "Regression testing of full journeys is manual."),
        ("Category data is inconsistent.", "Source records vary in spelling and case.", "Case is folded; a spelling error such as \"fuits\" remains visible."),
    ], widths=[4.4, 5.4, 6.0], font_size=8.5)

    # 21, 22 ---------------------------------------------------------------
    h1(doc, "21. Maintenance Strategy")
    para(doc, "Set out fully in Maintenance_and_Evolution.docx: corrective, adaptive, perfective "
              "and preventive maintenance, each illustrated with work already carried out on this "
              "system; an eight-step defect process; the branching and release model; and the "
              "dependency and security update policy.", align="justify")

    h1(doc, "22. Future System Evolution")
    table(doc, ["Phase", "Focus", "Representative items"], [
        ("1 (0–3 months)", "Complete the current design",
         "Role assignment at registration, administrator provisioning, cart update and delete, a higher rate limit."),
        ("2 (3–9 months)", "Commercial readiness",
         "Payment integration, delivery tracking, reviews, buyer–seller messaging, image hosting."),
        ("3 (9–18 months)", "Scale and reach",
         "Mobile application, offline browsing, seller analytics, local languages, logistics integration."),
        ("4 (18 months onward)", "Emerging technology",
         "Demand forecasting, recommendations, image-based grading, pricing guidance, conversational search."),
    ], widths=[3.2, 3.8, 8.8], font_size=9)
    para(doc, "The roadmap begins with backend capability because that, not the front-end code, "
              "is what genuinely constrains the product. The service layer isolates every external "
              "call, so when those limits lift the work required here is small.", align="justify")

    # 23 -------------------------------------------------------------------
    page_break(doc)
    h1(doc, "23. Conclusion")
    para(doc, "Maya is a complete, deployed marketplace covering the full lifecycle from "
              "requirements to a planned evolution path. Customers browse a live catalogue, "
              "collect a basket that survives a restart, and place orders they can track. Farmers "
              "publish produce and decide which orders to accept. Administrators oversee the "
              "marketplace. Every screen runs against real data on a public deployment.",
         align="justify")
    para(doc, "The project's most valuable lesson concerns verification. The team's own "
              "documentation of the backend was wrong in four material respects, and testing "
              "against real data exposed ten defects — six of which no amount of code review "
              "against a mock would have found. The single most serious made seventeen of "
              "twenty-two products impossible to buy while every automated check passed. Software "
              "engineering rigour, in practice, meant refusing to trust a specification that had "
              "not been tested.", align="justify")
    para(doc, "The second lesson concerns honesty about constraints. Several capabilities a "
              "marketplace ought to have cannot be built against this backend. Rather than "
              "conceal them behind screens that would fail in front of an examiner, they are "
              "specified as unsatisfiable requirements, traced to the backend change each needs, "
              "and carried into the roadmap. A system that states clearly what it cannot do is "
              "more trustworthy, and considerably more maintainable, than one that pretends "
              "otherwise.", align="justify")

    # 24 -------------------------------------------------------------------
    h1(doc, "24. References")
    numbered(doc, [
        "IEEE. IEEE Recommended Practice for Software Requirements Specifications (IEEE 830-1998). Institute of Electrical and Electronics Engineers, 1998.",
        "ISO/IEC. ISO/IEC 14764:2006 — Software Engineering: Software Life Cycle Processes — Maintenance. International Organization for Standardization, 2006.",
        "Sommerville, I. Software Engineering. 10th edition. Pearson, 2015.",
        "Pressman, R. S. and Maxim, B. R. Software Engineering: A Practitioner's Approach. 8th edition. McGraw-Hill, 2014.",
        "Fowler, M. Patterns of Enterprise Application Architecture. Addison-Wesley, 2002.",
        "OWASP Foundation. OWASP Top Ten Web Application Security Risks. https://owasp.org/www-project-top-ten/",
        "Vercel Inc. Next.js Documentation. https://nextjs.org/docs",
        "Meta Open Source. React Documentation. https://react.dev",
        f"E-commerce Backend API Documentation. {facts.API_DOCS_URL}",
        "Bootstrap Team. Bootstrap 4 Documentation. https://getbootstrap.com/docs/4.6/",
        "MDN Web Docs. HTTP Cookies. https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
        "Vercel Inc. Deployment Documentation. https://vercel.com/docs",
    ])

    h2(doc, "24.1 Third-party acknowledgements")
    table(doc, ["Component", "Provider", "Use"], [
        ("Next.js, React", "Vercel Inc., Meta Open Source", "Application framework and component model"),
        ("Bootstrap 4, react-bootstrap", "Bootstrap Team, react-bootstrap contributors", "Layout and interface components"),
        ("HTML template", "Third-party commercial template", "Visual design of the storefront"),
        ("react-slick, isotope-layout, wowjs", "Respective open-source authors", "Carousels, filtering layout and scroll animation"),
        ("E-commerce REST API", "Third party (supplied for the project)", "Products, accounts, carts and orders"),
        ("Vercel, Render, MongoDB", "Respective providers", "Hosting, backend hosting and data storage"),
        ("python-docx, matplotlib", "Open-source authors", "Generation of this documentation and its figures"),
    ], widths=[4.6, 5.2, 6.0], font_size=9)

    # 25 -------------------------------------------------------------------
    h1(doc, "25. Appendices")

    h2(doc, "Appendix A — Backend endpoints as verified")
    table(doc, ["Method", "Path", "Auth", "Purpose", "Status"],
          facts.ENDPOINTS, widths=[1.7, 4.6, 2.2, 5.4, 2.0], font_size=8)

    h2(doc, "Appendix B — Endpoints confirmed absent")
    para(doc, "Probed and found not to exist. Their absence explains why no user-management "
              "screen is offered and why statistics are derived in the browser.", align="justify")
    bullets(doc, facts.MISSING_ENDPOINTS)

    h2(doc, "Appendix C — Defect register")
    table(doc, ["Ref", "Defect", "Severity", "Resolution", "Commit"],
          [(d[0], d[1], d[2], d[4], d[5]) for d in facts.DEFECTS],
          widths=[1.1, 4.6, 2.0, 6.4, 1.7], font_size=8)

    h2(doc, "Appendix D — Route inventory")
    code(doc,
         "Storefront    /  /products  /product/[id]  /cart  /wishlist  /checkout\n"
         "Account       /login  /register  /account  /orders  /orders/[id]\n"
         "Seller        /farmer/dashboard  /farmer/products  /farmer/products/new\n"
         "              /farmer/products/[id]/edit  /farmer/orders\n"
         "Admin         /admin  /admin/orders  /admin/products  /admin/roles\n"
         "Marketing     /about  /services  /service-details  /farmers  /contact  /faqs\n"
         "              /blog-grid  /blog-standard  /blog-details\n"
         "              /portfolio-grid  /portfolio-fluid  /portfolio-details\n"
         "Server        /api/maya/[...path]  /api/auth/{login,logout,register,session}\n"
         "Redirects     /index2  /index3  /shop-grid  /shop-left-sidebar\n"
         "              /shop-right-sidebar  /product-details")

    h2(doc, "Appendix E — Repository history")
    table(doc, ["Commit", "Description"], [
        ("9d19d3d", "Administrator console for orders, products and roles"),
        ("036977f", "Recovery from stale chunk loads after a deployment"),
        ("df54fe7", "Buy flow corrected against actual backend behaviour"),
        ("ba0fe77", "Role parsing corrected and open redirect closed"),
        ("5eb259b", "Absent stock treated as untracked rather than sold out"),
        ("5ba5540", "Deployment and environment documentation"),
        ("69afca3", "Duplicate template pages collapsed onto canonical routes"),
        ("7818de9", "Wishlist context and hooks"),
        ("3b6585e", "Code structure refactor"),
        ("274eafc", "Initial commit"),
    ], widths=[3.0, 12.8], font_size=9)

    return save(doc, "Project_Documentation.docx")


if __name__ == "__main__":
    print(build())
