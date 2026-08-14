"""Generates README.docx and Links.txt — the examiner's quick guide."""

import os

import facts
from docbuild import (OUT, bullets, callout, code, h1, h2, new_document,
                      numbered, para, save, table, title_page, toc)


def build_readme():
    doc = new_document("Maya — README for the Examiner")
    title_page(doc, facts.PROJECT_TITLE, "README — Quick Guide for the Examiner", facts)

    h1(doc, "1. Project Overview")
    para(doc, "Maya is a web marketplace that lets farmers sell produce directly to consumers, "
              "removing the intermediaries who currently take a margin and add delay between "
              "harvest and table. It supports three roles: customers who browse and buy, farmers "
              "who publish listings and fulfil orders, and administrators who oversee the "
              "marketplace. The application is deployed and running against a live backend with "
              f"{facts.PRODUCT_COUNT} real products.", align="justify")

    h1(doc, "2. Main Features")
    table(doc, ["Area", "Features"], [
        ("Catalogue", "Server-rendered product listing, search, category and price filters, sorting, pagination, product detail with size selection."),
        ("Basket", "Add, amend and remove lines; totals with shipping and VAT; survives a browser restart; merges with the saved basket at sign-in."),
        ("Accounts", "Registration, sign-in and sign-out; sessions in httpOnly cookies; profile maintenance."),
        ("Ordering", "Checkout with delivery details, order confirmation, order history and order detail with status."),
        ("Selling", "Seller dashboard, listing creation and editing with multiple size/price/stock entries, incoming order acceptance and rejection."),
        ("Administration", "Marketplace overview, searchable and sortable all-orders table with status changes, product oversight, role creation."),
        ("Cross-cutting", "Role-based access control, actionable error messages, responsive layout, recovery from deployment-time chunk failures."),
    ], widths=[3.0, 12.8], font_size=9)

    h1(doc, "3. Technology Stack")
    table(doc, ["Technology", "Role"], list(facts.TECH), widths=[5.0, 10.8], font_size=9)

    h1(doc, "4. How to Access the Application")
    table(doc, ["Resource", "Address"], [
        ("Live application", facts.LIVE_URL),
        ("Products page", f"{facts.LIVE_URL}/products"),
        ("Administrator console", facts.ADMIN_URL),
        ("Source repository", facts.REPO_URL),
    ], widths=[4.4, 11.4])
    callout(doc, "First load may be slow.",
            "The backend runs on a free tier that sleeps when idle. The first request after a "
            "quiet period can take up to a minute while it restarts; the application retries "
            "automatically. Please allow for this before concluding that something has failed.")

    h1(doc, "5. Test Credentials")
    table(doc, ["Role", "Username / e-mail", "Password"], [
        ("Test customer", facts.TEST_USER_EMAIL, facts.TEST_USER_PASSWORD),
        ("Administrator", facts.ADMIN_EMAIL, facts.ADMIN_PASSWORD),
    ], widths=[3.4, 7.0, 5.4])
    para(doc, "The test customer already has orders in its history, so the ordering and "
              "order-tracking features can be inspected immediately without placing an order "
              "first. You are welcome to register a fresh account instead — registration is open "
              "and immediate.", align="justify")

    h1(doc, "6. Suggested Walkthrough")
    numbered(doc, [
        f"Open {facts.LIVE_URL}/products and browse the catalogue. Try the search box and the category filter.",
        "Open any product, choose a size where offered, and add it to the basket.",
        "Open the basket from the header, change a quantity and watch the totals update.",
        "Reload the page — the basket is still there.",
        "Choose Proceed to checkout and sign in with the test customer above.",
        "Enter delivery details and place the order.",
        "Open My orders to see the order and its status.",
        "Sign out and try to open /orders — you are redirected to sign-in and returned afterwards.",
    ])

    h1(doc, "7. Deployment Information")
    table(doc, ["Aspect", "Detail"], [
        ("Platform", "Vercel, Node runtime"),
        ("Build", "next build; deployed automatically on every push to main"),
        ("Branches", "main carries released code; development preserves the pre-integration baseline"),
        ("Configuration", "MAYA_API_KEY and MAYA_API_BASE_URL, set in the platform and never committed"),
        ("Backend", f"{facts.BACKEND_URL} (Node.js/Express, MongoDB)"),
    ], widths=[4.0, 11.8], font_size=9)
    para(doc, "In accordance with the brief, no password or key appears in the public repository. "
              "Credentials are supplied only in this document and in Links.txt.", italic=True)

    h1(doc, "8. Known Limitations")
    para(doc, "Every limitation below is a property of the third-party backend, which could not "
              "be modified during the project. Each is analysed in the Project Documentation and "
              "carried into the evolution roadmap.", align="justify")
    table(doc, ["Limitation", "Explanation"], [
        ("No online payment.", "The backend exposes no payment endpoint. An order records intent to buy; payment is arranged directly with the farmer."),
        ("Farmers cannot self-register.", "Registration always returns the Customer role whatever role identifier is sent, so sellers must be provisioned on the backend."),
        ("Administrator access is provisioned externally.", "The backend offers no way to assign an administrator role, so the console's data path could not be verified against real data."),
        ("No user management screen.", "No endpoint lists users; every candidate path returns 404."),
        ("Baskets are device-local.", "The saved cart cannot be updated once created, so a basket does not follow a user to another device."),
        ("A basket becomes several orders.", "The backend creates one order per line, so a three-item purchase appears as three orders."),
        ("Rate limit of ten requests per minute.", "Rapid browsing may briefly hit the limit; the application explains this and recovers."),
        ("Slow first request after idle.", "The backend sleeps; retries mitigate but do not eliminate the delay."),
    ], widths=[5.0, 10.8], font_size=8.5)

    h1(doc, "9. Special Instructions for Testing")
    bullets(doc, [
        ("Allow for the cold start — ", "the first page load after a quiet period may take up to a minute."),
        ("Pace rapid testing — ", "the backend permits ten requests a minute; if you see a rate-limit message, wait a moment."),
        ("Multi-item orders — ", "buying several different products deliberately creates one order per product; this is backend behaviour, not a defect."),
        ("Products showing “In stock” — ", "most listings carry no numeric stock figure; they are purchasable and this is intentional."),
        ("Guarded routes — ", "/account, /orders, /farmer/* and /admin/* redirect to sign-in when signed out, then return you to your destination."),
    ])

    h1(doc, "10. Documents in This Submission")
    table(doc, ["File", "Contents"], [
        ("Project_Documentation", "All 25 required sections: background, requirements, analysis, design, implementation, testing, deployment, security, limitations, evolution, references and appendices."),
        ("SRS", "36 functional and 17 non-functional requirements, constraints, assumptions, unsatisfiable requirements and traceability."),
        ("Design_Documentation", "Architecture, component and data design, interaction sequences, interface design and eight recorded design decisions."),
        ("Testing_Report", "Strategy, 25 functional cases, 34 automated cases, 8 security cases, 10 defects with resolutions."),
        ("User_Manual", "Guides for shoppers, farmers and administrators, with troubleshooting."),
        ("Maintenance_and_Evolution", "Four maintenance categories, defect process, version control, scalability and a four-phase roadmap."),
        ("README", "This document."),
        ("Links.txt", "URLs and access credentials."),
    ], widths=[4.6, 11.2], font_size=9)

    return save(doc, "README.docx")


def build_links():
    lines = [
        "=" * 66,
        "  CSCD602 — CAPSTONE PROJECT SUBMISSION",
        "=" * 66,
        "",
        f"Group Number/Name : {facts.GROUP_NAME}",
        f"Project Title     : {facts.PROJECT_TITLE}",
        "",
        "-" * 66,
        "ACCESS",
        "-" * 66,
        f"Live Application  : {facts.LIVE_URL}",
        f"Admin URL         : {facts.ADMIN_URL}",
        f"Source Code Repo  : {facts.REPO_URL}",
        f"Backend API       : {facts.BACKEND_URL}",
        "",
        "-" * 66,
        "TEST USER",
        "-" * 66,
        f"Username          : {facts.TEST_USER_EMAIL}",
        f"Password          : {facts.TEST_USER_PASSWORD}",
        "",
        "-" * 66,
        "ADMINISTRATOR",
        "-" * 66,
        f"Username          : {facts.ADMIN_EMAIL}",
        f"Password          : {facts.ADMIN_PASSWORD}",
        "",
        "-" * 66,
        "NOTES FOR THE EXAMINER",
        "-" * 66,
        "* The backend runs on a free tier that sleeps when idle. The first",
        "  request after a quiet period may take up to a minute while it",
        "  restarts. The application retries automatically.",
        "",
        "* The backend permits only 10 requests per minute. If a rate-limit",
        "  message appears, please wait a moment and continue.",
        "",
        "* Buying several different products creates one order per product.",
        "  This is backend behaviour and is documented, not a defect.",
        "",
        "* No credential appears in the public repository, as required by",
        "  the coursework brief.",
        "",
        "=" * 66,
    ]
    path = os.path.join(OUT, "Links.txt")
    with open(path, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")
    return path


if __name__ == "__main__":
    print(build_readme())
    print(build_links())
