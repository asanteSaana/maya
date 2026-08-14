"""Generates SRS.docx — Software Requirements Specification."""

import facts
from docbuild import (bullets, callout, code, figure, h1, h2, h3, new_document,
                      numbered, page_break, para, save, table, title_page, toc)

FUNCTIONAL = [
    ("FR-01", "Browse catalogue", "Any visitor shall be able to view the list of products without signing in.", "High", "Implemented"),
    ("FR-02", "Search products", "A visitor shall be able to search products by name and description.", "High", "Implemented"),
    ("FR-03", "Filter by category", "A visitor shall be able to narrow the catalogue by product category.", "Medium", "Implemented"),
    ("FR-04", "Filter by price", "A visitor shall be able to narrow the catalogue by price band.", "Medium", "Implemented"),
    ("FR-05", "Sort catalogue", "A visitor shall be able to sort products by price and recency.", "Low", "Implemented"),
    ("FR-06", "Paginate catalogue", "The catalogue shall be presented in pages rather than one long list.", "Medium", "Implemented"),
    ("FR-07", "View product detail", "A visitor shall be able to open a product and see its description, price, available sizes and stock.", "High", "Implemented"),
    ("FR-08", "Select size variant", "Where a product offers several sizes, the buyer shall be able to choose one before adding it to the basket.", "High", "Implemented"),
    ("FR-09", "Add to basket", "A visitor shall be able to add a product to a basket without signing in.", "High", "Implemented"),
    ("FR-10", "Amend basket", "A visitor shall be able to change quantities and remove lines from the basket.", "High", "Implemented"),
    ("FR-11", "Persist basket", "The basket shall survive a page reload and a browser restart on the same device.", "High", "Implemented"),
    ("FR-12", "Basket totals", "The basket shall display a subtotal, shipping fee, VAT and an order total.", "High", "Implemented"),
    ("FR-13", "Wishlist", "A visitor shall be able to save products to a wishlist for later.", "Low", "Implemented (device-local)"),
    ("FR-14", "Register", "A visitor shall be able to create an account with a username, e-mail address and password.", "High", "Implemented"),
    ("FR-15", "Sign in", "A registered user shall be able to sign in with e-mail and password.", "High", "Implemented"),
    ("FR-16", "Sign out", "A signed-in user shall be able to end their session.", "High", "Implemented"),
    ("FR-17", "Session persistence", "A session shall survive a page reload and remain valid for up to seven days.", "Medium", "Implemented"),
    ("FR-18", "Merge basket on sign-in", "A basket collected before signing in shall be merged with any saved basket rather than replaced.", "Medium", "Implemented"),
    ("FR-19", "Manage profile", "A signed-in user shall be able to update their username and password.", "Medium", "Implemented"),
    ("FR-20", "Checkout", "A signed-in customer shall be able to submit an order with delivery details.", "High", "Implemented"),
    ("FR-21", "Order confirmation", "After a successful order the customer shall be taken to a confirmation of what was placed.", "High", "Implemented"),
    ("FR-22", "Order history", "A customer shall be able to see every order they have placed and its current status.", "High", "Implemented"),
    ("FR-23", "Order detail", "A customer shall be able to open an order and see its lines, totals and delivery address.", "Medium", "Implemented"),
    ("FR-24", "Seller listings", "A seller shall be able to see the listings they own.", "High", "Implemented"),
    ("FR-25", "Create listing", "A seller shall be able to publish a product with one or more size/price/stock entries.", "High", "Implemented"),
    ("FR-26", "Edit listing", "A seller shall be able to amend an existing listing.", "High", "Implemented"),
    ("FR-27", "Incoming orders", "A seller shall be able to see orders placed against their listings.", "High", "Implemented"),
    ("FR-28", "Fulfil orders", "A seller shall be able to accept or reject an incoming order.", "High", "Implemented"),
    ("FR-29", "Seller dashboard", "A seller shall be shown counts of listings, pending orders and accepted revenue.", "Medium", "Implemented"),
    ("FR-30", "Administrator overview", "An administrator shall see marketplace-wide order counts, revenue and recent activity.", "Medium", "Implemented"),
    ("FR-31", "All-orders view", "An administrator shall be able to view, search, sort and filter every order in the system.", "High", "Implemented"),
    ("FR-32", "Administer orders", "An administrator shall be able to change the status of, or delete, any order.", "Medium", "Implemented"),
    ("FR-33", "Administer products", "An administrator shall be able to review every listing on the marketplace.", "Medium", "Implemented"),
    ("FR-34", "Manage roles", "An administrator shall be able to create a role and read back its identifier.", "Medium", "Implemented"),
    ("FR-35", "Role-based access", "Seller and administrator areas shall be refused to accounts without the corresponding role.", "High", "Implemented"),
    ("FR-36", "Meaningful errors", "Every failed operation shall explain what happened in language the user can act on.", "High", "Implemented"),
]

NON_FUNCTIONAL = [
    ("NFR-01", "Security", "The backend API key shall never be delivered to the browser.", "Verified by inspecting the built bundle and the network log."),
    ("NFR-02", "Security", "The authentication token shall be stored in an httpOnly cookie and be unreadable from page JavaScript.", "Verified via the cookie jar during integration testing."),
    ("NFR-03", "Security", "Post-authentication redirects shall be restricted to same-origin paths.", "14 automated cases covering absolute, protocol-relative and control-character inputs."),
    ("NFR-04", "Security", "Privileged routes shall be guarded before the page is served.", "Edge middleware on /account, /orders, /farmer/* and /admin/*."),
    ("NFR-05", "Security", "Internal database errors shall not be shown to end users.", "Duplicate-key and validation errors are replaced with plain messages."),
    ("NFR-06", "Performance", "Catalogue and product pages shall be server-rendered for first paint and indexability.", "getServerSideProps on /products and /product/[id]."),
    ("NFR-07", "Performance", "First-load JavaScript shall remain below 150 kB per route.", "Measured at 104–130 kB across all routes in the production build."),
    ("NFR-08", "Reliability", "A cold start of the backend shall not produce a server error page.", "502/503/504 retried three times with backoff; pages degrade to a client retry."),
    ("NFR-09", "Reliability", "The application shall stay within the backend's rate limit during ordinary use.", "Writes patch local state instead of refetching; no polling."),
    ("NFR-10", "Reliability", "A deployment shall not permanently break the page a visitor already has open.", "ChunkLoadError triggers one guarded reload."),
    ("NFR-11", "Usability", "Every screen shall be usable on a mobile viewport.", "Responsive Bootstrap grid; admin tables collapse to labelled stacks below 768 px."),
    ("NFR-12", "Usability", "Loading, empty and error states shall be distinguishable on every data-driven screen.", "Shared LoadingState, EmptyState and ErrorState components."),
    ("NFR-13", "Usability", "Sign-in and registration forms shall support password managers.", "autocomplete attributes on all credential fields."),
    ("NFR-14", "Maintainability", "Presentation, state and data access shall be separated.", "pages/ · context/ · services/ with no cross-layer imports."),
    ("NFR-15", "Maintainability", "The codebase shall pass linting with no errors.", "npm run lint reports zero errors."),
    ("NFR-16", "Portability", "The application shall run unchanged on any Node-capable host.", "No Vercel-specific APIs; configuration is entirely by environment variable."),
    ("NFR-17", "Compatibility", "The application shall work on current versions of Chrome, Firefox, Edge and Safari.", "Standard ES2020 output produced by the framework's compiler."),
]


def build():
    doc = new_document("Maya — Software Requirements Specification")
    title_page(doc, facts.PROJECT_TITLE, "Software Requirements Specification (SRS)", facts)
    toc(doc)

    h1(doc, "1. Introduction")

    h2(doc, "1.1 Purpose")
    para(doc, "This document specifies the requirements for Maya, a web marketplace that lets "
              "farmers sell produce directly to consumers. It is written for the project "
              "supervisor and examiner, for the developers who will maintain the system, and for "
              "anyone who later has to judge whether a proposed change is in scope. It states "
              "what the system must do and the qualities it must exhibit; it deliberately avoids "
              "prescribing how any requirement is realised, except where an external constraint "
              "leaves no choice.", align="justify")

    h2(doc, "1.2 Scope")
    para(doc, "Maya is a responsive web application with three classes of user. Customers browse "
              "a catalogue, collect items in a basket and place orders. Farmers publish and "
              "maintain their own listings and decide whether to accept the orders placed against "
              "them. Administrators oversee the marketplace as a whole. The product data, user "
              "accounts and orders are held by an existing third-party REST service; Maya is the "
              "complete user-facing system built on top of it, together with the server-side "
              "layer that secures access to it.", align="justify")
    para(doc, "Out of scope for this version: online payment capture, delivery logistics and "
              "courier tracking, messaging between buyer and seller, and product reviews. These "
              "are considered in the Maintenance and Future Evolution Plan.", align="justify")

    h2(doc, "1.3 Definitions, Acronyms and Abbreviations")
    table(doc, ["Term", "Meaning"], [
        ("Catalogue entry", "A size/price/stock combination belonging to a product. A product may have several."),
        ("Basket / Cart", "The collection of items a shopper intends to buy, held in the browser until checkout."),
        ("Partner / Seller / Farmer", "An account permitted to publish listings and fulfil orders. Used interchangeably."),
        ("Bearer token", "A JSON Web Token issued at sign-in and presented on subsequent API calls."),
        ("httpOnly cookie", "A cookie the browser will not expose to JavaScript, limiting the damage of a script injection."),
        ("Proxy route", "A server route in this application that forwards a browser request to the REST API."),
        ("SSR", "Server-side rendering: HTML produced on the server for the first response."),
        ("Cold start", "The delay while a sleeping backend instance restarts."),
    ], widths=[4.6, 11.2])

    h2(doc, "1.4 References")
    bullets(doc, [
        ("CSCD602 Capstone Project Coursework brief", " — assessment requirements."),
        ("E-commerce Backend API documentation", f" — {facts.API_DOCS_URL}"),
        ("Next.js documentation", " — https://nextjs.org/docs"),
        ("OWASP Top Ten", " — web application security risks, used to frame the security requirements."),
        ("IEEE 830-1998", " — recommended practice for software requirements specifications, used as the structure for this document."),
    ])

    h2(doc, "1.5 Overview")
    para(doc, "Section 2 describes the system in context and the factors that constrain it. "
              "Section 3 states the numbered functional and non-functional requirements. Section 4 "
              "records the assumptions the specification rests on, and Section 5 traces "
              "requirements to the components that satisfy them.", align="justify")

    page_break(doc)
    h1(doc, "2. Overall Description")

    h2(doc, "2.1 Product Perspective")
    para(doc, "Maya is a new front-end system built against an existing REST service. That service "
              "was not written for this project and could not be modified during it. The "
              "consequence runs through the whole specification: several requirements are shaped "
              "not by what the marketplace ideally needs, but by what the API is able to do. "
              "Where that is the case it is stated explicitly rather than hidden.", align="justify")
    figure(doc, "01_system_architecture.png",
           "Figure 1 — Maya in context: browser, application server and the external service tier.")

    h2(doc, "2.2 Product Functions")
    bullets(doc, [
        ("Catalogue and discovery — ", "browsing, search, category and price filtering, sorting and pagination."),
        ("Basket management — ", "adding, amending and removing lines, with totals and device-local persistence."),
        ("Accounts — ", "registration, sign-in, sign-out and profile maintenance."),
        ("Ordering — ", "checkout with delivery details, order confirmation and order history."),
        ("Selling — ", "listing creation and maintenance, and acceptance or rejection of incoming orders."),
        ("Administration — ", "marketplace-wide order oversight, product review and role creation."),
    ])

    h2(doc, "2.3 User Characteristics")
    table(doc, ["User class", "Profile", "Technical skill", "Frequency of use"], [
        ("Guest", "A prospective buyer who has not signed in.", "Everyday web user.", "Occasional"),
        ("Customer", "A registered buyer purchasing produce.", "Everyday web user; may be on a modest mobile device.", "Weekly"),
        ("Farmer", "A producer selling their own harvest.", "Comfortable with forms; not necessarily computer-literate beyond that.", "Daily"),
        ("Administrator", "Marketplace staff overseeing trade.", "Confident user familiar with the business rules.", "Daily"),
    ], widths=[2.8, 5.6, 4.4, 2.8])
    figure(doc, "02_use_case.png", "Figure 2 — Actors and the use cases available to each.")

    h2(doc, "2.4 Constraints")
    para(doc, "The following are fixed conditions the system must work within. Each was confirmed "
              "empirically against the live service, not assumed from documentation.", align="justify")
    table(doc, ["Ref", "Constraint", "Consequence for the design"], [
        ("C-01", "The REST API cannot be modified.", "Every gap has to be worked around in the client or accepted as a limitation."),
        ("C-02", f"The API permits only {facts.RATE_LIMIT}.", "Writes update local state instead of refetching; no polling or background sync."),
        ("C-03", "The backend sleeps when idle and cold-starts slowly.", "Server calls retry on 502/503/504; pages must degrade rather than fail."),
        ("C-04", "PUT and DELETE /api/carts are not implemented.", "The saved cart is write-once; the browser holds the authoritative basket."),
        ("C-05", "An order stores products as one embedded object.", "Each basket line becomes a separate order document."),
        ("C-06", "Order creation is not transactional.", "A partly-failed submission must warn the customer rather than report total failure."),
        ("C-07", "Product size is a case-sensitive enumeration.", "Sizes must be normalised before an order is submitted."),
        ("C-08", "No endpoint lists users or roles.", "User administration cannot be offered; role ids must be captured when created."),
        ("C-09", "Registration always returns the Customer role.", "Seller accounts must be provisioned outside the application."),
        ("C-10", "The user interface derives from a purchased HTML template.", "New screens reuse the template's markup and classes for visual consistency."),
    ], widths=[1.5, 6.0, 8.3])

    h2(doc, "2.5 Assumptions and Dependencies")
    bullets(doc, [
        "The REST API and its database remain available at the documented address for the duration of assessment.",
        "The API key issued to the group remains valid and is configured in the hosting environment.",
        "Product records are created by sellers through the application or already exist in the backend.",
        "Users reach the system over HTTPS on a current browser with JavaScript and cookies enabled.",
        "Prices are expressed in Ghana Cedis and no currency conversion is required.",
        "Payment is settled outside the system; an order records intent to buy, not a completed payment.",
    ])

    page_break(doc)
    h1(doc, "3. Specific Requirements")

    h2(doc, "3.1 Functional Requirements")
    para(doc, "Requirements are numbered FR-nn and grouped by the capability they belong to. The "
              "status column records what has actually been built and verified, not what was "
              "planned.", align="justify")
    table(doc, ["Ref", "Title", "Requirement", "Priority", "Status"],
          FUNCTIONAL, widths=[1.4, 3.0, 7.6, 1.6, 2.2], font_size=8.5)

    h2(doc, "3.2 Non-Functional Requirements")
    table(doc, ["Ref", "Quality", "Requirement", "How it is satisfied"],
          NON_FUNCTIONAL, widths=[1.4, 2.2, 6.2, 6.0], font_size=8.5)

    h2(doc, "3.3 External Interface Requirements")

    h3(doc, "3.3.1 User interfaces")
    para(doc, "The application presents a single responsive web interface. Layout adapts from a "
              "four-column product grid on the desktop to a single column on a phone; "
              "administrative tables become labelled stacks below 768 pixels so that no screen "
              "requires horizontal scrolling. Wireframes for the principal screens appear in the "
              "Design Documentation.", align="justify")

    h3(doc, "3.3.2 Software interfaces")
    para(doc, "All data is exchanged with the REST service listed below over HTTPS as JSON. "
              "Requests carry an API key in the x-apiKey header, and operations on behalf of a "
              "user additionally carry a bearer token. Both are attached on the server; neither "
              "is present in the browser.", align="justify")
    table(doc, ["Method", "Path", "Auth", "Purpose", "Status"],
          facts.ENDPOINTS, widths=[1.7, 4.6, 2.2, 5.4, 2.0], font_size=8.5)
    callout(doc, "Note.",
            "FR-31 is satisfied by GET /api/partner/orders/system/all, which returns every "
            "order in the system and was added to the API documentation partway through the "
            "project. Two earlier candidates were wrong: /api/orders/all is not a route at all "
            "but GET /api/orders/{id} given \"all\" as an identifier — it answers 403 to a "
            "customer, which was misread as a hidden endpoint, and 500 with a cast error to a "
            "partner — while /api/partner/orders is real but narrower, covering only the "
            "signed-in seller's own listings.")

    h3(doc, "3.3.3 Communications interfaces")
    bullets(doc, [
        "HTTPS for all traffic between browser, application server and REST service.",
        "Session state carried in cookies scoped to the application origin, marked HttpOnly and SameSite=Lax, and Secure in production.",
        "No WebSocket, push or background synchronisation is used, in keeping with constraint C-02.",
    ])

    page_break(doc)
    h1(doc, "4. Requirements Not Satisfiable Against the Current Backend")
    para(doc, "Honest specification means recording the requirements a stakeholder would "
              "reasonably expect that this backend cannot support. Each is carried into the "
              "Future Evolution roadmap with the backend change it depends on.", align="justify")
    table(doc, ["Ref", "Desired requirement", "Obstacle", "Depends on"], [
        ("X-01", "Administrators can list and manage user accounts.",
         "No endpoint returns a list of users; every candidate path answers 404.",
         "A user-listing endpoint."),
        ("X-02", "A shopper's basket follows them between devices.",
         "The saved cart cannot be updated or deleted once created.",
         "PUT and DELETE on /api/carts."),
        ("X-03", "A basket is placed as a single order.",
         "The order schema holds one product object, so one order is created per line.",
         "An array-valued products field."),
        ("X-04", "A person can register as a farmer and start selling immediately.",
         "Registration always returns the Customer role, whatever role identifier is sent.",
         "Role assignment at registration."),
        ("X-05", "Administrators can browse the roles that exist.",
         "No endpoint lists roles; identifiers are only visible at the moment of creation.",
         "A role-listing endpoint."),
        ("X-06", "Customers can pay online.",
         "No payment endpoint exists and no payment provider is integrated.",
         "Payment gateway integration."),
    ], widths=[1.4, 5.2, 5.6, 3.6], font_size=8.5)

    page_break(doc)
    h1(doc, "5. Traceability")
    para(doc, "Each requirement group is realised by an identifiable part of the codebase, so a "
              "future maintainer can move from a requirement to the code that satisfies it and "
              "back again.", align="justify")
    table(doc, ["Requirements", "Realised by", "Verified by"], [
        ("FR-01 – FR-08", "pages/products.js, pages/product/[id].js, src/hooks/useProductCatalog.js, src/components/shop/*",
         "Functional and exploratory testing against 22 live products"),
        ("FR-09 – FR-13", "src/context/CartContext.js, src/context/WishlistContext.js, pages/cart.js",
         "Functional testing; basket persistence checked across reloads"),
        ("FR-14 – FR-19", "pages/login.js, pages/register.js, pages/account.js, pages/api/auth/*, src/context/AuthContext.js",
         "Integration testing of the live sign-in loop; 7 automated role cases"),
        ("FR-20 – FR-23", "pages/checkout.js, pages/orders/*, src/services/orders.js",
         "Integration testing; 4 real orders normalised correctly"),
        ("FR-24 – FR-29", "pages/farmer/*, src/components/farmer/*, src/services/partner.js",
         "Functional testing of the seller screens"),
        ("FR-30 – FR-34", "pages/admin/*, src/components/admin/*, src/services/admin.js",
         "Routing and guard testing; data path pending an administrator account"),
        ("FR-35", "middleware.js, src/services/userProfile.js, AdminLayout, FarmerLayout",
         "7 automated role cases; guard responses confirmed on every protected route"),
        ("FR-36", "src/services/api.js, src/components/shop/StateMessage.js, FormAlert",
         "Error-path testing including rate-limit and validation failures"),
        ("NFR-01 – NFR-05", "pages/api/maya/[...path].js, pages/api/auth/*, src/services/navigation.js",
         "Bundle inspection, cookie inspection, 14 redirect cases"),
        ("NFR-06 – NFR-10", "getServerSideProps, src/services/serverApi.js, src/useChunkRecovery.js",
         "Production build metrics; 9 chunk-detection cases"),
    ], widths=[3.0, 6.6, 6.2], font_size=8.5)

    return save(doc, "SRS.docx")


if __name__ == "__main__":
    print(build())
