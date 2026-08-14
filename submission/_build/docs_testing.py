"""Generates Testing_Report.docx.

Every result quoted here was produced by an execution recorded during
development. Nothing is projected or estimated.
"""

import facts
from docbuild import (bullets, callout, code, figure, h1, h2, h3, new_document,
                      numbered, page_break, para, save, table, title_page, toc)

FUNCTIONAL_CASES = [
    ("TC-01", "Catalogue loads for an anonymous visitor", "Open /products signed out",
     "22 products listed with prices", "22 products rendered", "Pass"),
    ("TC-02", "Search narrows the catalogue", "Type a product name into the search field",
     "Only matching products remain", "Matching subset shown", "Pass"),
    ("TC-03", "Category filter groups correctly", "Select the Breakfast category",
     "All Breakfast products, regardless of spelling", "6 products (4 + 2 differently cased)", "Pass"),
    ("TC-04", "Price filter", "Select a price band", "Only products in that band", "Correct subset", "Pass"),
    ("TC-05", "Pagination", "Move to page 2", "Next set of products", "Correct page shown", "Pass"),
    ("TC-06", "Product detail renders", "Open a product without a catalogue entry",
     "Price, availability and an enabled Add to Cart", "\"In stock\", button enabled", "Pass"),
    ("TC-07", "Size selection", "Open a product with several sizes", "Size selector with price per size",
     "Selector present, price updates", "Pass"),
    ("TC-08", "Add to basket anonymously", "Add an item while signed out", "Basket count increases",
     "Count incremented, item listed", "Pass"),
    ("TC-09", "Basket survives reload", "Add an item, reload the page", "Item still present", "Item retained", "Pass"),
    ("TC-10", "Quantity change updates totals", "Increase a line quantity", "Line and order totals recalculate",
     "Totals correct", "Pass"),
    ("TC-11", "Remove a line", "Remove an item from the basket", "Line disappears, totals adjust",
     "Line removed", "Pass"),
    ("TC-12", "Registration", "Submit the registration form", "Account created and signed in",
     "HTTP 201, session established", "Pass"),
    ("TC-13", "Sign in with valid credentials", "Submit correct credentials", "Session established",
     "HTTP 200, cookies set", "Pass"),
    ("TC-14", "Sign in with invalid credentials", "Submit a wrong password", "Clear rejection message",
     "\"Incorrect email or password\"", "Pass"),
    ("TC-15", "Session survives reload", "Reload after signing in", "Still signed in", "Session restored", "Pass"),
    ("TC-16", "Sign out", "Use the sign-out control", "Session ends and guards re-engage",
     "Cookies cleared, /orders redirects", "Pass"),
    ("TC-17", "Checkout places an order", "Submit checkout with delivery details",
     "Order created and basket cleared", "Orders created, basket emptied", "Pass"),
    ("TC-18", "Order history lists orders", "Open /orders", "Every order with status and total",
     "4 orders with correct totals", "Pass"),
    ("TC-19", "Multi-line order", "Check out with two different products",
     "Every line ordered", "2 orders created, one per line", "Pass"),
    ("TC-20", "Seller listings", "Open the farmer listings page", "Only that seller's products",
     "Own listings only", "Pass"),
    ("TC-21", "Create a listing", "Publish a product with two sizes", "Listing appears in the catalogue",
     "Created and visible", "Pass"),
    ("TC-22", "Accept an incoming order", "Accept a pending order", "Status becomes accepted",
     "Status updated", "Pass"),
    ("TC-23", "Administrator routes are guarded", "Open /admin signed out",
     "Redirect to sign-in preserving the destination", "307 to /login?redirect=%2Fadmin", "Pass"),
    ("TC-24", "Administrator gate for a customer", "Open /admin as a customer",
     "Refusal explaining staff access is required", "Gate shown, no data requested", "Pass"),
    ("TC-25", "Administrator gate opens for a Partner", "Load /admin with a Partner profile",
     "Console renders instead of the refusal", "All four routes served; role derivation covered by 9 cases", "Pass"),
    ("TC-26", "Administrator data path returns orders", "Call the console's order source",
     "Orders across several customers", "10 real orders returned and normalised", "Pass"),
    ("TC-27", "Staff sign-in derives administrator rights", "Sign in with the staff account",
     "Session reports administrator and partner rights", "isAdmin true, isPartner true", "Pass"),
    ("TC-28", "Every privileged data source answers", "Call all five endpoints the privileged pages use",
     "All return data for the staff session", "5/5 returned HTTP 200 with populated payloads", "Pass"),
    ("TC-29", "Privileged pages render real data without throwing", "Replay each page's render expressions over the live payloads",
     "No exception on any path", "6/6 render paths complete", "Pass"),
]

SECURITY_CASES = [
    ("ST-01", "API key absent from the client bundle",
     "Search the built JavaScript and the network log for the key and the x-apiKey header",
     "No occurrence anywhere in client-delivered code", "Pass"),
    ("ST-02", "Session token unreadable by script",
     "Inspect cookie attributes after signing in",
     "maya_token and maya_user both HttpOnly", "Pass"),
    ("ST-03", "Token absent from the sign-in response body",
     "Inspect the JSON returned by /api/auth/login",
     "Profile only; no accessToken field", "Pass"),
    ("ST-04", "Open redirect rejected",
     "Request /login?redirect=https://evil.example.com and 13 further hostile inputs",
     "All 14 fall back to a safe local path", "Pass"),
    ("ST-05", "Protected routes guarded",
     "Request /account, /orders, /farmer/*, /admin/* without a session",
     "All redirect to sign-in with the destination preserved", "Pass"),
    ("ST-06", "Expired session handled",
     "Present an expired cookie to a protected route",
     "Redirected to sign-in rather than shown an error", "Pass"),
    ("ST-07", "Internal database errors masked",
     "Force a duplicate-key error by saving a second cart",
     "Neutral message shown; Mongo text not surfaced", "Pass"),
    ("ST-08", "Secrets excluded from version control",
     "Check .env and .env.local against the repository index",
     "Both ignored and untracked", "Pass"),
]


def build():
    doc = new_document("Maya — Testing and Quality Assurance Report")
    title_page(doc, facts.PROJECT_TITLE, "Testing and Quality Assurance Report", facts)
    toc(doc)

    h1(doc, "1. Testing Strategy")
    para(doc, "Testing was carried out against the live REST service rather than a mock. That "
              "decision shaped the outcome of this project more than any other: nearly every one of "
              "the twenty defects in Section 5 was invisible against fabricated data, and eight "
              "would have reached an examiner as a broken feature. Where the supplied API "
              "documentation and the running service disagreed, the service was treated as "
              "correct and the documentation as wrong.", align="justify")

    h2(doc, "1.1 Levels applied")
    table(doc, ["Level", "Scope", "Method", "Evidence"], [
        ("Unit", "Pure functions with security or correctness significance",
         "Executable assertions run under Node against the real modules",
         f"{facts.TOTAL_AUTOMATED_CASES} cases across 5 suites, all passing"),
        ("Integration", "Client to proxy to REST service",
         "Scripted request sequences using a real authenticated session",
         "Cart, order and authentication flows exercised end to end"),
        ("System", "Complete journeys across roles",
         "Manual and scripted execution of the 29 functional cases in Section 2",
         "All passing"),
        ("Security", "Authentication, authorisation and secret handling",
         "Targeted probing plus inspection of bundles and cookies",
         "8 cases, all passing"),
        ("Usability", "Responsive behaviour and clarity of feedback",
         "Manual inspection at desktop, tablet and phone widths",
         "Findings in Section 6"),
        ("Performance", "Bundle size and response behaviour",
         "Production build metrics and timed requests",
         "Findings in Section 7"),
        ("Interface review", "Layout, copy and interaction across every page",
         "Walking each screen at several widths and reading every visible string",
         "Six further defects, Section 5"),
        ("Acceptance", "Requirement satisfaction",
         "Each functional requirement walked through in the deployed application",
         "Section 8"),
    ], widths=[2.0, 4.2, 5.0, 4.6], font_size=8.5)

    h2(doc, "1.2 Environment")
    table(doc, ["Item", "Detail"], [
        ("Application under test", f"{facts.LIVE_URL} and a local development server"),
        ("Backend", f"{facts.BACKEND_URL} (Node.js/Express, MongoDB)"),
        ("Live data", f"{facts.PRODUCT_COUNT} products, real customer accounts, real orders"),
        ("Browsers", "Chrome, Firefox and Edge on Windows 11"),
        ("Runtime", "Node.js 24 for scripted tests"),
        ("Known environmental limit", f"The backend permits only {facts.RATE_LIMIT}, so test scripts were paced"),
    ], widths=[4.6, 11.2])

    page_break(doc)
    h1(doc, "2. Functional and System Testing")
    para(doc, "Twenty-nine cases covering every user journey. The observed column records what "
              "actually happened, including the one case that could not be executed.", align="justify")
    table(doc, ["Ref", "Case", "Action", "Expected", "Observed", "Result"],
          FUNCTIONAL_CASES, widths=[1.2, 3.4, 3.2, 3.4, 3.4, 1.2], font_size=8)

    callout(doc, "Verified with a staff account.",
            "The administrator console was exercised with real staff credentials late in the "
            "project. Sign-in derives administrator rights correctly, all five privileged data "
            "sources answer, and every page's render path completes over the live payloads. The "
            "case that was previously blocked for want of a credential is now closed.")

    page_break(doc)
    h1(doc, "3. Unit Testing")
    para(doc, "Automated cases concentrate on logic where a silent error would be costly and "
              "manual testing unreliable: security decisions, role derivation and the parsing of "
              "external data.", align="justify")
    table(doc, ["Suite", "Cases", "What it protects"],
          [(name, str(count), purpose) for name, count, purpose in facts.TEST_SUITES],
          widths=[4.4, 1.6, 9.8])

    h2(doc, "3.1 Redirect safety")
    para(doc, "The sign-in page accepts a redirect target from the query string. Fourteen cases "
              "confirm that only same-origin paths survive.", align="justify")
    code(doc,
         "  PASS  \"/orders\"                      -> \"/orders\"\n"
         "  PASS  \"/orders?tab=1\"                -> \"/orders?tab=1\"\n"
         "  PASS  \"https://evil.example.com\"     -> \"/account\"\n"
         "  PASS  \"//evil.example.com\"           -> \"/account\"\n"
         "  PASS  \"/\\\\evil.example.com\"          -> \"/account\"\n"
         "  PASS  \"javascript:alert(1)\"          -> \"/account\"\n"
         "  PASS  \"   https://evil.example.com\"  -> \"/account\"\n"
         "  PASS  \"/\\u0000//evil.example.com\"    -> \"/account\"\n"
         "  ... 6 further cases\n\n"
         "  14/14 redirect-guard cases pass")

    h2(doc, "3.2 Role and profile parsing")
    para(doc, "Seven cases run against the exact payload the live service returns, confirming "
              "that roles are read correctly, that an administrator also receives seller rights, "
              "and that the access token never survives into the browser profile.", align="justify")
    code(doc,
         "  PASS  admin=false partner=false real Customer payload\n"
         "  PASS  admin=true  partner=true  Admin - admins also get seller screens\n"
         "  PASS  admin=true  partner=true  case and whitespace tolerated\n"
         "  PASS  admin=false partner=true  Farmer is a partner, not an admin\n"
         "  PASS  admin=false partner=false flat role id string still parses\n"
         "  PASS  admin=false partner=true  partnerId implies partner\n"
         "  PASS  accessToken stripped from profile\n\n"
         "  7/7 role cases pass")

    h2(doc, "3.3 Order normalisation")
    para(doc, "Run against a genuine order payload retrieved from the service. Before the "
              "corresponding fix every row produced no line items and a zero total.", align="justify")
    code(doc,
         "  normalized 4 orders\n\n"
         "  OK   6a735a695feccc5949ccd1ef  lines=1  total=25  status=pending\n"
         "         Orange  size=L qty=1 amount=25\n"
         "  OK   6a735a695feccc5949ccd1f0  lines=1  total=10  status=pending\n"
         "         Melon  size=XL qty=1 amount=10\n"
         "  OK   6a7358975feccc5949ccd1eb  lines=1  total=20  status=pending\n"
         "  OK   6a734c48c088666609fe2845  lines=1  total=30  status=pending\n\n"
         "  4/4 orders normalize with line items and a non-zero total")

    h2(doc, "3.4 Chunk-error detection")
    para(doc, "Nine cases confirm that a guarded page reload is triggered by genuine chunk "
              "failures only, and never by network, API or application errors — which would mask "
              "defects and risk a refresh loop.", align="justify")

    page_break(doc)
    h1(doc, "4. Integration Testing")
    para(doc, "Integration tests drove the application's own proxy with a real authenticated "
              "session, so each exercised the browser-to-server-to-service path in full. They "
              "produced the most valuable findings of the project: the supplied API documentation "
              "proved unreliable in four separate places.", align="justify")

    table(doc, ["Documented behaviour", "Actual behaviour", "Impact"], [
        ("PUT /api/carts updates the saved cart.",
         "Answers 404 \"Cannot PUT /api/carts\" for every path variant.",
         "Cart synchronisation could never have worked."),
        ("DELETE /api/carts removes the cart.",
         "Answers 404 \"Cannot DELETE /api/carts\".",
         "A saved cart cannot be replaced or cleared."),
        ("An order carries an array of products.",
         "Stores a single embedded object; one order is created per line.",
         "Order history rendered empty until corrected."),
        ("Rate limit of 10 requests per second.",
         "Enforced at 10 requests per minute, and the reply is plain text, not JSON.",
         "The limit message was being discarded."),
    ], widths=[5.0, 5.4, 5.4], font_size=8.5)

    h2(doc, "4.1 Endpoint discovery")
    para(doc, "Seventeen candidate paths were probed to establish what administrative capability "
              "exists. A 404 shows a route is absent; a 403 shows it exists but is closed to the "
              "role in use. This distinction located an endpoint absent from the documentation "
              "entirely.", align="justify")
    code(doc,
         "  status  endpoint                        verdict\n"
         "  403     /api/orders/all                 EXISTS (forbidden for this role)\n"
         "  404     /api/users                      does not exist\n"
         "  404     /api/admin/users                does not exist\n"
         "  404     /api/users/all                  does not exist\n"
         "  404     /api/roles/all                  does not exist\n"
         "  404     /api/stats                      does not exist\n"
         "  ... 11 further paths, all absent")
    para(doc, "The absence of any user-listing endpoint is why no user-management screen is "
              "offered. The single 403 was, however, misread — and correcting that produced one "
              "of the more instructive findings of the project.", align="justify")

    h3(doc, "4.2 A status code that meant the opposite of what it appeared to")
    para(doc, "The 403 on /api/orders/all was taken as evidence of a hidden administrative route: "
              "a route that does not exist answers 404, so a 403 implies one that exists but is "
              "closed to the caller. The administrator console was built on that inference.",
         align="justify")
    para(doc, "It was wrong. Once a staff account was available the same path returned 500 with a "
              "Mongoose CastError, revealing what the route really is:", align="justify")
    code(doc, "\n".join([
        '{\"message\":{\"stringValue\":\"\\\"all\\\"\",'
        ' \"kind\":\"ObjectId\",\"value\":\"all\",',
        '            \"path\":\"_id\",\"name\":\"CastError\",',
        '            \"message\":\"Cast to ObjectId failed for value '
        '\\\"all\\\" at path \\\"_id\\\"\"}}',
    ]))
    para(doc, "It is GET /api/orders/{id} with \"all\" supplied as the identifier. The 403 was "
              "that route refusing a customer, not a hidden endpoint guarding itself. The console "
              "was moved to /api/partner/orders, and then to "
              "/api/partner/orders/system/all once that appeared in an updated version of the "
              "API documentation; it was verified with a staff account, returning every order in "
              "the system. The lesson is that a status code is evidence of behaviour, not proof "
              "of intent, and an inference drawn from one deserves confirmation before anything "
              "is built upon it.", align="justify")

    page_break(doc)
    h1(doc, "5. Defects Found and Resolved")
    para(doc, "Ten defects were identified and every one was fixed and verified. Severity is "
              "judged by user impact: critical means a core journey was broken or a security "
              "boundary was absent.", align="justify")
    table(doc, ["Ref", "Defect", "Severity", "Found by", "Resolution", "Commit"],
          facts.DEFECTS, widths=[1.1, 4.2, 1.9, 2.6, 4.6, 1.4], font_size=8)

    h2(doc, "5.1 What interface review caught that testing did not")
    para(doc, "Six defects came from walking the pages rather than exercising the API, and they "
              "share a cause: the application was built on a purchased template whose CSS makes "
              "assumptions the new screens broke. The template pins form labels to the top right "
              "of their group, so twenty-one labels written for this project landed on top of "
              "their inputs. It injects a currency symbol before every price, so Ghana Cedi "
              "amounts read \"$GHS 25.00\". Its header button never needed a wrapping rule "
              "because its label was one word.", align="justify")
    para(doc, "The most serious of the six was invisible from the home page entirely. Every asset "
              "was referenced relatively, so on a nested route such as /farmer/orders the browser "
              "resolved the logo to /farmer/assets/... — which the authentication middleware then "
              "matched and redirected. On a cold load of any nested page the stylesheets "
              "themselves would have failed, rendering it unstyled. It affected twelve routes and "
              "would only ever have shown itself to someone who refreshed a page below the top "
              "level.", align="justify")

    h2(doc, "5.2 The three most serious")

    h3(doc, "D-01 — Most of the catalogue could not be bought")
    para(doc, "Seventeen of twenty-two live products carry no catalogue entry and no stock field, "
              "though they do have valid prices. The normaliser coerced the missing value to zero, "
              "so those products rendered a \"Sold out\" badge with a disabled button. On the "
              "first page of the catalogue, five of six products were unbuyable. Stock became "
              "tri-state, and all six now add to the basket normally.", align="justify")

    h3(doc, "D-04 — Open redirect on the sign-in page")
    para(doc, "The redirect target was taken from the query string and used verbatim, so a "
              "crafted link could carry a user to an external site immediately after "
              "authenticating — the moment they are most likely to trust the destination. The "
              "guard now admits only root-relative paths, and rejects absolute URLs, "
              "protocol-relative hosts, backslash variants and embedded control characters.",
         align="justify")

    h3(doc, "D-07 — Partial order writes reported as total failure")
    para(doc, "Because the service creates one order per basket line without a transaction, a "
              "line failing validation left earlier lines committed while the call returned 500. "
              "This was observed directly: a failed request left a real order in the account. A "
              "customer would have seen \"failed\", retried, and been charged twice. Failed "
              "multi-line submissions now warn that some items may already have been placed and "
              "link to the order history.", align="justify")

    page_break(doc)
    h1(doc, "6. Usability Testing")
    table(doc, ["Aspect", "Method", "Finding"], [
        ("Responsive layout", "Inspection at 1920, 1024, 768 and 375 pixels",
         "The product grid reflows correctly; administrative tables become labelled stacks below 768 px, avoiding horizontal scrolling."),
        ("Feedback on slow calls", "Loading a page against a sleeping backend",
         "A loading state appears immediately; a cold start no longer produces an error page."),
        ("Error clarity", "Forcing validation, authentication and rate-limit failures",
         "Messages are specific and actionable; database internals are not shown."),
        ("Form ergonomics", "Completing sign-in and registration with a password manager",
         "Autocomplete hints allow credentials to be filled and saved."),
        ("Navigation clarity", "Walking the menu structure",
         "Duplicate template routes were collapsed and the portfolio menu renamed so it no longer competes with the real products page."),
        ("Empty states", "Visiting the basket, wishlist and orders with no data",
         "Each explains the situation and offers a route onward rather than showing a blank panel."),
    ], widths=[3.0, 4.6, 8.2], font_size=8.5)

    page_break(doc)
    h1(doc, "7. Performance Testing")
    h2(doc, "7.1 Bundle size, production build")
    table(doc, ["Route", "Route JS", "First load JS"], [
        ("/ (home)", "5.51 kB", "129 kB"),
        ("/products", "4.65 kB", "107 kB"),
        ("/product/[id]", "3.46 kB", "130 kB"),
        ("/cart", "2.53 kB", "121 kB"),
        ("/checkout", "5.35 kB", "112 kB"),
        ("/orders", "2.47 kB", "105 kB"),
        ("/admin/orders", "2.94 kB", "109 kB"),
        ("Shared by all routes", "—", "87 kB"),
    ], widths=[6.0, 4.4, 5.4])
    para(doc, "Every route stays below the 150 kB first-load target set in NFR-07.", align="justify")

    h2(doc, "7.2 Response behaviour")
    table(doc, ["Condition", "Observation", "Mitigation"], [
        ("Backend warm", "Catalogue page rendered in approximately 2.6 seconds including the upstream call.",
         "Acceptable; dominated by the external service."),
        ("Backend cold", "First request after idle returned 503 while the instance restarted.",
         "Retried three times with backoff; the page degrades to a client retry rather than failing."),
        ("Rate limit reached", "Plain-text refusal after 10 requests in a minute.",
         "Writes patch local state instead of refetching; no polling."),
        ("Large product image", "One product carries a 9.8 kB base64 image inline in the JSON.",
         "Tolerated at current scale; flagged for the evolution roadmap."),
    ], widths=[3.4, 6.6, 5.8], font_size=8.5)

    page_break(doc)
    h1(doc, "8. Acceptance Testing")
    para(doc, "Each functional requirement was walked through in the deployed application.",
         align="justify")
    table(doc, ["Requirement group", "Requirements", "Outcome"], [
        ("Catalogue and discovery", "FR-01 – FR-08", "Accepted"),
        ("Basket and wishlist", "FR-09 – FR-13", "Accepted"),
        ("Accounts and sessions", "FR-14 – FR-19", "Accepted"),
        ("Ordering", "FR-20 – FR-23", "Accepted"),
        ("Selling", "FR-24 – FR-29", "Accepted"),
        ("Administration", "FR-30 – FR-34", "Accepted for routing, guards and rendering; data path pending an administrator account"),
        ("Access control", "FR-35", "Accepted"),
        ("Error reporting", "FR-36", "Accepted"),
    ], widths=[4.4, 3.6, 7.8])

    h1(doc, "9. Quality Assurance Practices")
    bullets(doc, [
        ("Linting — ", "npm run lint reports zero errors; the build is configured not to hide lint failures from a separate check."),
        ("Build verification — ", "every change is confirmed with a clean production build before commit."),
        ("Small, described commits — ", f"{facts.COMMITS} commits, each explaining the defect, the cause and the evidence."),
        ("Branching — ", "main carries the released code and is deployed automatically; development preserves the pre-integration baseline."),
        ("Verification before claiming — ", "no fix was recorded as complete until re-executed against the live service."),
    ])

    h1(doc, "10. Conclusion")
    para(doc, "All 29 functional cases pass. "
              f"All {facts.TOTAL_AUTOMATED_CASES} automated cases pass, as do all 8 security "
              f"cases. {len(facts.DEFECTS)} defects were found and resolved.",
         align="justify")
    para(doc, "The most useful conclusion is methodological. Testing against the live service, "
              "rather than a convenient mock, is what exposed every significant defect: the "
              "unbuyable catalogue, the broken order history, the rejected sizes, the "
              "unimplemented cart endpoints and the silent partial writes. A mock built from the "
              "supplied documentation would have agreed with the code and passed cleanly, and the "
              "application would have failed in front of its examiner.", align="justify")

    return save(doc, "Testing_Report.docx")


if __name__ == "__main__":
    print(build())
