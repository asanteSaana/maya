"""Generates Maintenance_and_Evolution.docx."""

import facts
from docbuild import (bullets, callout, code, figure, h1, h2, h3, new_document,
                      numbered, page_break, para, save, table, title_page, toc)


def build():
    doc = new_document("Maya — Maintenance and Future Evolution Plan")
    title_page(doc, facts.PROJECT_TITLE, "Maintenance and Future Evolution Plan", facts)
    toc(doc)

    h1(doc, "1. Introduction")
    para(doc, "Software costs more to keep than to build. This plan sets out how Maya is "
              "maintained now and how it could grow. It is grounded in what the project actually "
              "encountered: ten defects found and fixed, four places where the supplied API "
              "documentation proved wrong, and a set of backend limitations that shape every "
              "option discussed here.", align="justify")

    h1(doc, "2. Maintenance Categories")
    para(doc, "Following the ISO/IEC 14764 classification, with examples drawn from work already "
              "carried out on this system rather than invented ones.", align="justify")

    h2(doc, "2.1 Corrective maintenance")
    para(doc, "Repairing faults found after delivery. All ten defects recorded in the Testing "
              "Report fall here. Two illustrate the range:", align="justify")
    table(doc, ["Defect", "Symptom", "Cause", "Correction"], [
        ("D-01", "Seventeen of twenty-two products showed as sold out.",
         "A missing stock field was coerced to zero.",
         "Stock modelled as tri-state; only an explicit zero means sold out."),
        ("D-05", "Order history showed no items and a zero total.",
         "The code expected an array where the service returns one embedded object.",
         "The normaliser accepts both shapes."),
    ], widths=[1.6, 4.6, 4.8, 4.8], font_size=8.5)
    para(doc, "Both share a cause worth remembering: the code trusted the documented shape of "
              "external data rather than the observed one.", align="justify")

    h2(doc, "2.2 Adaptive maintenance")
    para(doc, "Adjusting to a changed environment. Two examples have already occurred. The "
              "hosting platform moved from Firebase static hosting to Vercel, which required "
              "abandoning the static export, adding server routes and removing the obsolete "
              "deployment configuration. Separately, the discovery that the cart endpoints do not "
              "exist forced the basket to be redesigned around client-side storage.",
         align="justify")
    para(doc, "Foreseeable adaptive work includes a backend schema change, a Node runtime "
              "upgrade on the host, and browser changes to third-party cookie handling.",
         align="justify")

    h2(doc, "2.3 Perfective maintenance")
    para(doc, "Improving what already works. Completed examples include collapsing the "
              "template's three homepage and three shop-layout variants onto single canonical "
              "routes with permanent redirects, and folding category names case-insensitively so "
              "one category no longer appears as two filters.", align="justify")
    para(doc, "Planned perfective work is listed in the roadmap in Section 7.", align="justify")

    h2(doc, "2.4 Preventive maintenance")
    para(doc, "Reducing the chance of future failure. Three measures are already in place. "
              "Secrets are excluded from version control by explicit ignore rules, closing a real "
              "exposure. Cold starts are retried so an idle backend cannot produce an error page. "
              "Stale chunk loads trigger one guarded reload, so a deployment cannot leave an open "
              "page permanently broken.", align="justify")
    table(doc, ["Activity", "Frequency", "Purpose"], [
        ("Review dependencies for advisories", "Monthly", "Catch vulnerable packages before they are exploited."),
        ("Re-run the automated suites", "Every change", "Detect regressions in security and parsing logic."),
        ("Verify against live data", "Before each release", "Catch backend behaviour changes early."),
        ("Check the deployed site is reachable", "Weekly", "Confirm the assessed application is available."),
        ("Review error messages surfaced to users", "Quarterly", "Ensure no internal detail has begun to leak."),
    ], widths=[5.4, 3.0, 7.4], font_size=9)

    page_break(doc)
    h1(doc, "3. Defect Management Process")
    numbered(doc, [
        "Report — the defect is recorded with what was done, what was expected and what happened.",
        "Reproduce — it is confirmed against the live service; anything not reproducible is not fixed blind.",
        "Diagnose — the cause is traced to a specific module rather than guessed at.",
        "Assess — severity is judged by user impact, and security defects take precedence.",
        "Fix — the smallest change that addresses the cause, not the symptom.",
        "Verify — re-executed against the live service; a test is added where the logic allows one.",
        "Record — committed with a message explaining the defect, its cause and the evidence.",
        "Release — merged to main, which deploys automatically.",
    ])
    table(doc, ["Severity", "Definition", "Response"], [
        ("Critical", "A core journey is broken, or a security boundary is missing.", "Fix immediately, before other work."),
        ("Major", "A feature is unusable but a workaround exists.", "Fix in the current cycle."),
        ("Minor", "Cosmetic, or an unclear message.", "Schedule into routine work."),
    ], widths=[2.6, 7.6, 5.6])

    h1(doc, "4. Version Control")
    table(doc, ["Practice", "How it is applied here"], [
        ("Branch model", "main carries released code and deploys automatically; development preserves the pre-integration baseline."),
        ("Commit granularity", f"{facts.COMMITS} commits, each a single coherent change."),
        ("Commit messages", "State the defect, its cause and the evidence, so history explains itself years later."),
        ("Traceability", "Every defect in the Testing Report cites the commit that fixed it."),
        ("Secret hygiene", "Environment files are ignored; no credential has ever been committed."),
        ("Release", "A push to main triggers a Vercel build; a failed build does not replace the running site."),
    ], widths=[3.8, 12.0])

    h1(doc, "5. Dependency and Security Updates")
    para(doc, "The application depends on a deliberately small set of packages, which keeps the "
              "update surface manageable. The admin console was built on the existing Bootstrap "
              "base specifically to avoid introducing a second UI framework and its dependency "
              "tree.", align="justify")
    table(doc, ["Dependency", "Current", "Consideration"], [
        ("Next.js", "12.2.5", "Two major versions behind. An upgrade brings the App Router and better image handling but requires migration work."),
        ("React", "18.2", "Current for Next 12. React 19 requires the Next upgrade first."),
        ("react-bootstrap", "1.6", "Tied to Bootstrap 4. Moving to Bootstrap 5 would touch every template page."),
        ("Node runtime", "Managed by Vercel", "Follow the platform's supported versions."),
    ], widths=[3.4, 3.0, 9.4], font_size=9)
    bullets(doc, [
        "Security advisories are reviewed monthly; a critical advisory is treated as a critical defect.",
        "Patch and minor updates are applied routinely, each verified with a clean build.",
        "Major upgrades are planned as their own piece of work, never bundled with feature changes.",
    ])

    page_break(doc)
    h1(doc, "6. Scalability")
    para(doc, "The application tier scales without effort: pages are stateless and the host adds "
              "instances as needed. The constraints lie outside it.", align="justify")
    table(doc, ["Limit", "Effect", "Remedy"], [
        (f"API rate limit of {facts.RATE_LIMIT}", "A busy shopper could exhaust it; it was reached repeatedly during testing.",
         "Raise the limit, and cache catalogue responses at the proxy."),
        ("Backend sleeps when idle", "First visit after a quiet period is slow.", "Move to an always-on plan."),
        ("Whole catalogue fetched at once", "Filtering and sorting happen in the browser; fine at 22 products, not at 22,000.",
         "Add server-side query, sort and pagination parameters."),
        ("Images embedded as base64", "One product carries a 9.8 kB image inline in the JSON.",
         "Store images in object storage and return URLs."),
        ("Single backend instance", "No redundancy.", "Horizontal scaling and a managed database tier."),
    ], widths=[3.6, 6.2, 6.0], font_size=8.5)

    h1(doc, "7. Future Evolution Roadmap")
    para(doc, "Sequenced by dependency: each phase makes the next possible. Items marked "
              "“backend” cannot be delivered by the front end alone.", align="justify")

    h2(doc, "7.1 Phase 1 — Complete the current design (0–3 months)")
    table(doc, ["Item", "Why", "Depends on"], [
        ("Assign roles at registration", "Farmers cannot self-register; every seller must be provisioned by hand.", "Backend"),
        ("Provision an administrator account", "The console cannot be exercised against real data.", "Backend"),
        ("Implement cart update and delete", "A basket cannot follow a shopper between devices.", "Backend"),
        ("Raise the rate limit", "Ten requests a minute is too tight for real traffic.", "Backend"),
        ("List users and roles", "No user administration is possible.", "Backend"),
        ("Order confirmation e-mail", "Shoppers have no record away from the site.", "Mail service"),
    ], widths=[4.6, 7.2, 4.0], font_size=9)

    h2(doc, "7.2 Phase 2 — Commercial readiness (3–9 months)")
    bullets(doc, [
        ("Payment integration — ", "mobile money and card capture through a Ghanaian gateway such as Paystack or Hubtel, with orders reconciled against confirmed payment."),
        ("Delivery tracking — ", "status beyond accepted and rejected: dispatched, in transit, delivered."),
        ("Product reviews — ", "ratings and written feedback, giving shoppers a basis for choosing between farmers."),
        ("Buyer–seller messaging — ", "questions about produce before ordering."),
        ("Search improvements — ", "server-side search with spelling tolerance, so “tomatos” finds tomatoes."),
        ("Image hosting — ", "uploads to object storage, replacing inline base64 data."),
    ])

    h2(doc, "7.3 Phase 3 — Scale and reach (9–18 months)")
    bullets(doc, [
        ("Mobile application — ", "React Native sharing this project's service layer, for farmers working away from a computer."),
        ("Offline capability — ", "browse and build a basket on an intermittent connection, syncing when it returns."),
        ("Seller analytics — ", "which produce sells, when, and at what price."),
        ("Multi-language — ", "Twi, Ewe and Ga alongside English."),
        ("Logistics integration — ", "connecting to courier services for collection and delivery."),
        ("Bulk and subscription orders — ", "recurring weekly boxes, and wholesale quantities for restaurants."),
    ])

    h2(doc, "7.4 Phase 4 — Emerging technology (18 months onward)")
    table(doc, ["Opportunity", "Application to Maya", "Prerequisite"], [
        ("Demand forecasting", "Advise farmers what to plant and when to harvest, from observed order patterns.",
         "A meaningful history of orders."),
        ("Recommendations", "Suggest produce from what a shopper has bought and what is in season.",
         "Purchase history at scale."),
        ("Image-based quality grading", "Grade produce from a photograph at listing time.",
         "Labelled image data and image hosting."),
        ("Dynamic pricing guidance", "Suggest a price from current supply, demand and season.",
         "Market data across sellers."),
        ("Conversational assistance", "Let shoppers ask for produce in natural language, including local languages.",
         "Search infrastructure and language support."),
        ("Provenance records", "Verifiable origin for produce where buyers pay for traceability.",
         "Farm identity verification."),
    ], widths=[3.6, 8.0, 4.2], font_size=8.5)

    page_break(doc)
    h1(doc, "8. Technology Migration")
    table(doc, ["Migration", "Motivation", "Risk", "Approach"], [
        ("Next 12 → Next 15", "Modern rendering model, longer support window.",
         "The purchased template's markup and animation hooks may break.",
         "Upgrade on a branch, verify page by page, keep the pages router initially."),
        ("Bootstrap 4 → 5", "Bootstrap 4 is no longer maintained.",
         "Class names differ; every template page is affected.",
         "Only worthwhile alongside a wider redesign."),
        ("JavaScript → TypeScript", "External data shapes proved to be exactly where defects hid; types would have caught several.",
         "Wholesale conversion is disruptive.",
         "Adopt incrementally, starting with src/services where the value is highest."),
        ("Replace the backend", "Removes every constraint in this document.",
         "Substantial work and a data migration.",
         "The service layer already isolates all API access, so the change is contained."),
    ], widths=[3.4, 4.4, 4.2, 4.0], font_size=8.5)
    callout(doc, "Why migration is feasible.",
            "Every call to the external service passes through src/services and the proxy route. "
            "Replacing the backend means rewriting those modules, not the pages, the components "
            "or the state layer. That containment was a deliberate design goal, and it is what "
            "makes the roadmap above credible rather than aspirational.")

    h1(doc, "9. Integration with Other Systems")
    table(doc, ["System", "Purpose", "Feasibility"], [
        ("Payment gateway", "Take payment at checkout.", "Straightforward; checkout is a single, well-isolated flow."),
        ("SMS gateway", "Notify farmers of orders where e-mail is not used.", "Straightforward; needs a backend hook."),
        ("Accounting software", "Produce records of sale for farmers.", "Needs an export endpoint."),
        ("Agricultural extension services", "Share aggregate demand signals to inform planting advice.", "Needs anonymised aggregation and a data-sharing agreement."),
        ("Logistics providers", "Arrange collection and delivery.", "Needs an address and scheduling model beyond the current single city field."),
    ], widths=[3.6, 6.0, 6.2], font_size=9)

    h1(doc, "10. Summary")
    para(doc, "Maya is maintainable because its layers are separated and its history is legible: "
              "each commit records not only what changed but why, and every fix cites the "
              "evidence that confirmed it. The clearest constraint on its future is not the "
              "front-end code but the external service, which cannot assign roles, cannot update "
              "a saved cart, cannot list its own users and permits only ten requests a minute. "
              "The roadmap therefore begins with backend capability, because that is what "
              "genuinely limits the product — and the front end has been arranged so that when "
              "those limits lift, the work required here is small.", align="justify")

    return save(doc, "Maintenance_and_Evolution.docx")


if __name__ == "__main__":
    print(build())
