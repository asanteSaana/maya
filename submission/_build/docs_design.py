"""Generates Design_Documentation.docx — system analysis and design."""

import facts
from docbuild import (bullets, callout, code, figure, h1, h2, h3, new_document,
                      numbered, page_break, para, save, table, title_page, toc)


def build():
    doc = new_document("Maya — Design Documentation")
    title_page(doc, facts.PROJECT_TITLE, "System Analysis and Design Documentation", facts)
    toc(doc)

    h1(doc, "1. Introduction")
    para(doc, "This document records how Maya is put together and, more importantly, why. It "
              "covers the architecture, the component and data designs, the principal "
              "interaction flows, and the interface design. Where a decision could reasonably "
              "have gone another way, the alternative and the reason for rejecting it are "
              "stated, so that a future maintainer can tell a deliberate choice from an "
              "accident.", align="justify")

    h2(doc, "1.1 Design Goals")
    table(doc, ["Goal", "What it means in practice"], [
        ("Keep secrets on the server",
         "No credential of any kind may be reachable from page JavaScript, however convenient that would be."),
        ("Fail visibly, never silently",
         "Every failure path produces a message the user can act on; nothing is swallowed."),
        ("Survive an unreliable backend",
         "A sleeping service, a rate limit or a partial write must degrade the experience, not break it."),
        ("Separate concerns strictly",
         "Presentation, state and data access are distinct layers so any one can be changed alone."),
        ("Preserve the visual language",
         "New screens reuse the existing template's markup and classes rather than introducing a second design system."),
        ("Model what the backend really does",
         "The design follows the API's observed behaviour, not its documentation, wherever the two disagree."),
    ], widths=[4.4, 11.4])

    page_break(doc)
    h1(doc, "2. System Architecture")

    h2(doc, "2.1 Architectural Style")
    para(doc, "Maya is a three-tier application. The presentation tier is a React single-page "
              "experience delivered by server-rendered HTML. The application tier is a Next.js "
              "server that renders those pages and, critically, mediates every call to the "
              "outside world. The service tier is the external REST API and its database.",
         align="justify")
    para(doc, "The pivotal decision is that the browser never speaks to the REST API directly. "
              "All traffic passes through a proxy route on the application server, which attaches "
              "the API key and the user's bearer token. This is what makes it possible to keep "
              "both secrets out of the browser entirely — an outcome no purely client-side "
              "architecture can achieve.", align="justify")
    figure(doc, "01_system_architecture.png", "Figure 1 — Three-tier architecture and the trust boundary.")

    h2(doc, "2.2 Why not call the API from the browser?")
    para(doc, "The obvious alternative — fetching directly from React components — was rejected. "
              "The API requires a key on every request. Any key shipped to the browser is public: "
              "it appears in the JavaScript bundle and in the network log, and can be extracted "
              "and reused by anyone. Because the key cannot be scoped or rotated per user, "
              "leaking it would expose the whole marketplace. Routing through the server costs "
              "one extra hop and buys a real security boundary.", align="justify")
    callout(doc, "Consequence.",
            "An earlier iteration of this project did read the key from NEXT_PUBLIC_MAYA_API_KEY, "
            "which Next.js inlines into the client bundle. Removing that variable and introducing "
            "the proxy was the single most significant change made during the project.")

    h2(doc, "2.3 Technology Architecture")
    table(doc, ["Layer", "Technology", "Reason for the choice"], [
        ("Client", "React 18, Bootstrap 4",
         "Component model suited to a catalogue UI; Bootstrap already underpins the purchased template."),
        ("Application", "Next.js 12.2.5 on the Node runtime",
         "Gives server-side rendering for catalogue SEO and server routes for the proxy in one framework."),
        ("Session", "httpOnly cookies",
         "Immune to token theft by injected script, unlike localStorage."),
        ("Hosting", "Vercel",
         "First-class Next.js support, environment-variable management, deploy on push."),
        ("Service", "Node.js/Express REST API on Render",
         "Supplied for the project; not modifiable."),
        ("Data", "MongoDB",
         "Managed entirely by the REST service; reached only through it."),
    ], widths=[2.6, 4.4, 8.8])
    figure(doc, "09_deployment.png", "Figure 9 — Deployment topology and environment configuration.")

    page_break(doc)
    h1(doc, "3. Component Design")
    para(doc, "The front end is organised so that a change of data source, of visual design, or "
              "of business rule each touches one layer only.", align="justify")
    figure(doc, "08_component_diagram.png", "Figure 8 — Front-end modules and their dependencies.")

    table(doc, ["Layer", "Location", "Responsibility", "May depend on"], [
        ("Routes", "pages/", "One component per URL; composes layout and feature components.", "Components, contexts, services"),
        ("Feature components", "src/components/{shop,farmer,admin}/", "Reusable presentation: product cards, tables, state messages, forms.", "Contexts, services"),
        ("Layout", "src/layout/", "Header, footer, navigation, page chrome.", "Contexts"),
        ("State", "src/context/", "Cross-cutting client state: session, basket, wishlist.", "Services"),
        ("Hooks", "src/hooks/", "Reusable behaviour: catalogue filtering, product loading, chunk recovery.", "Services"),
        ("Client services", "src/services/*.js", "One module per API resource; returns normalised data.", "api.js only"),
        ("Server services", "src/services/server*.js, authHandler.js", "Server-only code holding secrets and issuing cookies.", "Nothing client-side"),
        ("Server routes", "pages/api/", "Proxy and authentication endpoints.", "Server services"),
        ("Edge", "middleware.js", "Route guarding before a page is served.", "Nothing"),
    ], widths=[2.4, 4.0, 6.4, 3.0], font_size=8.5)

    callout(doc, "Rule.",
            "No component imports a server service, and no client service reaches past api.js. This "
            "is what guarantees the API key cannot reach the browser by accident: the modules that "
            "read it are never part of the client dependency graph.")

    page_break(doc)
    h1(doc, "4. Domain Model")
    para(doc, "The domain follows the shapes the REST service actually returns, which differ from "
              "its documentation in two places that materially affect the design. Both are marked "
              "in the diagram.", align="justify")
    figure(doc, "03_class_diagram.png", "Figure 3 — Domain classes and their relationships.")

    h2(doc, "4.1 Entities")
    table(doc, ["Entity", "Key attributes", "Notes"], [
        ("User", "id, username, email, role, partnerId",
         "isPartner and isAdmin are derived from the role name; the API returns no such flags."),
        ("Role", "id, name, description",
         "Returned as a nested object, not an identifier. No endpoint lists roles."),
        ("Product", "id, title, desc, img, categories, price, owner",
         "Owned by the seller who created it."),
        ("CatalogueEntry", "id, size, price, stock",
         "Embedded in a product. Size is a case-sensitive enumeration; stock may be absent."),
        ("Cart", "id, userId, products[]",
         "One per user, enforced by a unique index. Cannot be updated or deleted."),
        ("Order", "id, userId, products, address, status",
         "products is a single embedded object, so one basket line produces one order."),
    ], widths=[2.6, 5.0, 8.2], font_size=9)

    h2(doc, "4.2 Stock is tri-state")
    para(doc, "Most products in the live catalogue carry no catalogue entry and no stock figure at "
              "all, yet do have a valid price. Treating a missing stock value as zero would mark "
              "them sold out. The model therefore distinguishes three states: a number means a "
              "tracked count, zero means genuinely sold out, and null means the seller does not "
              "track stock for that item — in which case it remains purchasable.", align="justify")
    code(doc,
         "export const toStock = (value) =>\n"
         "  value === undefined || value === null || value === \"\" ? null : Number(value);\n\n"
         "export const isSoldOut = (stock) => stock !== null && Number(stock) <= 0;")

    page_break(doc)
    h1(doc, "5. Data Design")
    figure(doc, "07_er_model.png", "Figure 7 — Entity relationship model of the backing store.")
    para(doc, "The database is owned by the REST service and is reached only through it; Maya "
              "holds no database of its own. The model is recorded here because the constraints "
              "it imposes are visible in the application's behaviour, and a maintainer needs to "
              "understand them.", align="justify")

    table(doc, ["Constraint observed", "Effect on the application"], [
        ("carts.userId carries a unique index.",
         "A second attempt to save a cart fails with a duplicate-key error, so the cart is written once and never replaced."),
        ("orders.products is one embedded document.",
         "A three-item basket becomes three order documents, each independently accepted or rejected."),
        ("catalogue.size is an enumeration.",
         "Values are matched exactly, including case; sizes are normalised before submission."),
        ("products.stock may be entirely absent.",
         "Stock is modelled as nullable rather than defaulted to zero."),
        ("No collection is exposed for users or roles.",
         "User administration is not offered; role identifiers must be captured at creation."),
    ], widths=[6.4, 9.4])

    h2(doc, "5.1 Client-side storage")
    table(doc, ["Key", "Store", "Contents", "Why there"], [
        ("maya.cart", "localStorage", "Basket lines with title, image, price, size, quantity",
         "The saved cart cannot be updated, so the browser holds the authoritative basket."),
        ("maya.wishlist", "localStorage", "Saved products",
         "The API offers no wishlist resource."),
        ("maya.user", "localStorage", "Non-sensitive profile for instant hydration",
         "Avoids a blank header on first paint; confirmed against the server on mount."),
        ("maya_token", "httpOnly cookie", "Bearer token",
         "Unreadable by JavaScript, so a script injection cannot steal the session."),
        ("maya_user", "httpOnly cookie", "Encoded profile",
         "Lets the server answer 'who am I' without a backend call, which has no such endpoint."),
    ], widths=[2.6, 2.6, 5.0, 5.6], font_size=8.5)

    page_break(doc)
    h1(doc, "6. Process and Interaction Design")

    h2(doc, "6.1 Authentication")
    para(doc, "Sign-in is the only flow that handles a token, and it is deliberately confined to "
              "the server. The credentials are posted to an application route, which calls the "
              "REST service, strips the token from the reply, writes it into an httpOnly cookie "
              "and returns only the profile. The browser therefore never holds a credential it "
              "could leak.", align="justify")
    figure(doc, "04_sequence_login.png", "Figure 4 — Sign-in: the token is captured server-side.")

    h2(doc, "6.2 Placing an order")
    para(doc, "Checkout reads the basket from client state, normalises each line, and submits them "
              "through the proxy. The service creates one order per line and answers with an "
              "array, which the application reflects: a single-line basket lands on that order's "
              "page, a multi-line basket on the order history.", align="justify")
    figure(doc, "05_sequence_order.png", "Figure 5 — Order placement through the proxy.")

    h2(doc, "6.3 The shopping journey")
    figure(doc, "06_activity_checkout.png", "Figure 6 — From browsing to a placed order.")
    para(doc, "Sign-in is deferred until checkout. A shopper can fill a basket anonymously, and "
              "the contents are merged with any saved basket when they do sign in, rather than "
              "one silently overwriting the other.", align="justify")

    page_break(doc)
    h1(doc, "7. Security Design")
    table(doc, ["Risk", "Control", "Where implemented"], [
        ("API key disclosure", "The key is read only by server modules and injected per request; it is absent from the client bundle.",
         "src/services/serverApi.js, pages/api/maya/[...path].js"),
        ("Session token theft via script", "The token lives in an httpOnly, SameSite=Lax, Secure cookie and is never returned to the browser.",
         "pages/api/auth/*, src/services/serverApi.js"),
        ("Open redirect after sign-in", "Only root-relative paths are accepted; absolute, protocol-relative, backslash and control-character inputs fall back to a safe default.",
         "src/services/navigation.js"),
        ("Unauthorised page access", "Edge middleware rejects unauthenticated requests before rendering; role checks gate the seller and administrator areas.",
         "middleware.js, AdminLayout, FarmerLayout"),
        ("Privilege escalation by forged cookie", "The middleware check is a convenience only; the API authorises every request independently.",
         "Backend authorisation"),
        ("Internal error disclosure", "Duplicate-key and validation errors are replaced with neutral messages.",
         "src/services/api.js"),
        ("Credential leakage to the repository", "Environment files are ignored by version control and secrets live only in the hosting platform.",
         ".gitignore, Vercel environment"),
        ("Stale session", "A 401 from any call clears the session and returns the user to sign-in.",
         "src/services/api.js, src/context/AuthContext.js"),
    ], widths=[3.4, 7.4, 5.0], font_size=8.5)

    callout(doc, "Defence in depth.",
            "The edge guard is intentionally shallow — it only checks that a cookie is present. It "
            "makes the interface behave sensibly, and nothing more is claimed for it. Authorisation "
            "is the backend's responsibility, so a forged cookie yields an empty shell and failed "
            "API calls rather than access to data.")

    page_break(doc)
    h1(doc, "8. User Interface Design")
    para(doc, "The interface derives from a purchased produce-marketplace template. New screens "
              "reuse its markup, class names and animation hooks so that pages built for this "
              "project are indistinguishable from the original design, rather than introducing a "
              "competing visual language.", align="justify")
    figure(doc, "10_wireframes.png", "Figure 10 — Wireframes for the four principal screens.")

    h2(doc, "8.1 Two layouts, chosen by purpose")
    para(doc, "The storefront and the privileged areas are laid out differently on purpose. A "
              "shopper is browsing, so the storefront keeps the template's marketing chrome. A "
              "farmer working through orders is not browsing, so the seller and administrator "
              "areas use an application shell: a fixed sidebar grouping destinations by purpose, "
              "collapsing to an icon rail whose state is remembered, a top bar carrying the "
              "current location and the account menu, and a content area that owns the full "
              "height. Below 992 pixels the sidebar becomes a drawer, since an icon rail is no "
              "use on a phone.", align="justify")

    h2(doc, "8.2 Interface principles")
    bullets(doc, [
        ("Three states, always — ", "every data-driven screen renders a loading, empty or error state; a blank page is never an acceptable outcome."),
        ("Errors sit where the action was — ", "messages appear next to the control that failed, not in a global banner."),
        ("Destructive actions are distinguishable — ", "deletion is visually separated from routine controls."),
        ("Responsive by rule — ", "the product grid reflows from four columns to one; administrative tables become labelled stacks below 768 pixels."),
        ("Accessible forms — ", "every input has a label, credential fields carry autocomplete hints, and icon-only buttons carry accessible names."),
        ("One filled action per view — ", "buttons are ranked by consequence. The expected action is filled, alternatives are outlined, and anything irreversible is set apart from the controls it must not be confused with."),
        ("No claim without data behind it — ", "categories, counts and totals are derived from the catalogue, so the interface cannot advertise something that does not exist."),
    ])

    h2(doc, "8.3 Screen inventory")
    table(doc, ["Area", "Routes", "Purpose"], [
        ("Storefront", "/, /products, /product/[id]", "Discovery and product detail"),
        ("Basket", "/cart, /wishlist", "Basket and saved items"),
        ("Ordering", "/checkout, /orders, /orders/[id]", "Placing and tracking orders"),
        ("Account", "/login, /register, /account", "Registration, sign-in and profile"),
        ("Seller", "/farmer/dashboard, /farmer/products, /farmer/products/new, /farmer/products/[id]/edit, /farmer/orders", "Listing and fulfilment"),
        ("Administration", "/admin, /admin/orders, /admin/products, /admin/roles", "Marketplace oversight"),
        ("Marketing", "/about, /services, /farmers, /contact, /faqs, blog and gallery pages", "Supporting content from the template"),
    ], widths=[2.6, 8.0, 5.2], font_size=8.5)

    page_break(doc)
    h1(doc, "9. Key Design Decisions")
    para(doc, "Recorded in the style of architecture decision records: the decision, what was "
              "rejected, and why.", align="justify")

    decisions = [
        ("DD-01", "Route all API traffic through a server proxy",
         "Fetch directly from the browser with a public key.",
         "The key cannot be scoped per user, so exposing it would compromise the whole marketplace. The extra hop is a small price for a real trust boundary."),
        ("DD-02", "Store the session token in an httpOnly cookie",
         "Keep the token in localStorage, which is simpler to read from React.",
         "localStorage is readable by any injected script. The cookie approach needs a server route to report the session, which the application already has."),
        ("DD-03", "Treat the browser basket as authoritative",
         "Synchronise every basket change to the server.",
         "The saved cart cannot be updated — PUT and DELETE are unimplemented and a unique index blocks a second create. Retrying a doomed write would only consume the rate limit."),
        ("DD-04", "Render catalogue pages on the server",
         "Fetch products on the client after mount.",
         "Product pages are the ones that must be indexable and fast to first paint. Decorative product carousels remain client-fetched so they cannot delay the first byte."),
        ("DD-05", "Model stock as nullable",
         "Default a missing stock value to zero.",
         "Seventeen of twenty-two live products carry no stock field; defaulting to zero marked them sold out and made most of the catalogue unbuyable."),
        ("DD-06", "Build the admin console inside the storefront",
         "Reuse an existing React 19 / Tailwind admin shell from another project.",
         "That shell cannot run on this application's Next 12 and React 18 base. Building in-app reuses the proxy, session and guards, and keeps one deployment and one sign-in."),
        ("DD-07", "Derive roles from the role name",
         "Rely on a partnerId or an explicit flag.",
         "The API returns neither on authentication responses. The role name is the only signal available, so it is used and the assumption is documented."),
        ("DD-08", "Give the privileged areas their own application shell",
         "Keep the seller and administrator screens inside the storefront layout.",
         "Those screens are a working tool, not a shopfront. Inside the marketing chrome their navigation was a widget in the page body and the work started below the fold. A fixed sidebar, a collapsing icon rail and a working top bar suit someone processing orders."),
        ("DD-09", "Reserve the photographic banner for pages people browse",
         "Open every page with the same full-bleed hero.",
         "The hero is 165px of padding above and below an image, and the content beneath added another 130px — roughly 460 pixels before a sign-in form. Task pages get a compact heading instead; marketing pages keep the image, where it is the point."),
        ("DD-10", "Derive categories from the catalogue rather than listing them",
         "Keep the template's hand-written category tiles.",
         "The five shipped categories existed nowhere in the data. Deriving them from what farmers have listed means the site cannot advertise a category with nothing behind it, and the same case-folding used by the shop filter keeps one category from appearing twice."),
        ("DD-11", "Recover from chunk failures with one guarded reload",
         "Let the error surface, or reload on any error.",
         "Deployments rename lazily-loaded chunks, breaking pages already open. Reloading on any error would mask real defects and risk a refresh loop, so only genuine chunk errors qualify and a cooldown prevents looping."),
    ]
    table(doc, ["Ref", "Decision", "Alternative rejected", "Rationale"],
          decisions, widths=[1.3, 3.6, 4.0, 6.9], font_size=8.5)

    return save(doc, "Design_Documentation.docx")


if __name__ == "__main__":
    print(build())
