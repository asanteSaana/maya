"""Single source of truth for every figure quoted in the deliverables.

Anything the group still has to supply is written as a TODO marker so it shows
up highlighted in the Word files and cannot be submitted by accident.
"""

TODO = "[TO BE COMPLETED BY GROUP]"


def is_placeholder(value):
    return isinstance(value, str) and value.startswith("[TO BE COMPLETED")


COURSE = "CSCD602: Advanced Software Engineering — Capstone Project"
GROUP_NAME = TODO
PROJECT_TITLE = "Maya — A Farmer-to-Consumer Produce Marketplace"
TAGLINE = "Connecting local farmers directly with the people who buy their produce"
VERSION = "1.0"
DATE = "August 2026"

# One row per member: (name, student id, major contribution)
MEMBERS = [
    (TODO, TODO, TODO),
    (TODO, TODO, TODO),
    (TODO, TODO, TODO),
    (TODO, TODO, TODO),
    (TODO, TODO, TODO),
]

LIVE_URL = "https://maya-one-mu.vercel.app"
ADMIN_URL = "https://maya-one-mu.vercel.app/admin"
REPO_URL = "https://github.com/asanteSaana/maya"
BACKEND_URL = "https://ecommerce-backend-9tly.onrender.com"
API_DOCS_URL = "https://documenter.getpostman.com/view/37346255/2sAYJ6CKk5"

TEST_USER_EMAIL = "maya-test-customer-a1@example.com"
TEST_USER_PASSWORD = "TestPassw0rd!"
ADMIN_EMAIL = TODO
ADMIN_PASSWORD = TODO

# --- Measured from the repository -----------------------------------------
LOC = "14,153"
JS_FILES = 106
CSS_LINES = 1159
COMMITS = 20
PAGE_ROUTES = 34
API_ROUTES = 5
SERVICE_MODULES = 15
PRODUCT_COUNT = 23
RATE_LIMIT = "10 requests per minute"

TECH = [
    ("Next.js 12.2.5", "React framework: file-system routing, server-side rendering, API routes"),
    ("React 18.2", "Component model and hooks"),
    ("JavaScript (ES2020)", "Application language"),
    ("react-bootstrap 1.6 / Bootstrap 4", "Layout and form components"),
    ("Node.js runtime on Vercel", "Hosting for the rendered pages and server routes"),
    ("Node.js / Express REST API", "Third-party backend providing data and authentication"),
    ("MongoDB", "Document store behind the REST API"),
    ("Git / GitHub", "Version control, branch protection and deployment trigger"),
]

# --- Backend endpoints, as verified against the live service ---------------
ENDPOINTS = [
    ("POST", "/api/auth/register", "Public", "Create an account", "Working"),
    ("POST", "/api/auth/login", "Public", "Exchange credentials for a token", "Working"),
    ("GET", "/api/products", "API key", "List every product", "Working"),
    ("GET", "/api/products/{id}", "API key", "Single product", "Working"),
    ("GET", "/api/products/private", "Bearer", "Seller's own listings", "Working"),
    ("POST", "/api/products/create", "Bearer", "Publish a listing", "Working"),
    ("PUT", "/api/products/{id}", "Bearer", "Update a listing", "Working"),
    ("GET", "/api/carts", "Bearer", "Read the saved cart", "Working"),
    ("POST", "/api/carts/create", "Bearer", "Save a cart (once per user)", "Working"),
    ("PUT", "/api/carts", "Bearer", "Documented but NOT implemented (404)", "Unavailable"),
    ("DELETE", "/api/carts", "Bearer", "Documented but NOT implemented (404)", "Unavailable"),
    ("POST", "/api/orders/create", "Bearer", "Place an order per basket line", "Working"),
    ("GET", "/api/orders", "Bearer", "Customer's own orders", "Working"),
    ("GET", "/api/orders/{id}", "Bearer", "Single order by id", "Working"),
    ("PUT", "/api/orders/{id}", "Bearer", "Change order status", "Working"),
    ("DELETE", "/api/orders/{id}", "Bearer", "Remove an order", "Working"),
    ("GET", "/api/partner/orders", "Bearer", "Orders against a seller's own listings", "Working"),
    ("GET", "/api/partner/orders/system/all", "Bearer (partner)", "Every order in the system", "Working"),
    ("PUT", "/api/users", "Bearer", "Update own profile", "Working"),
    ("DELETE", "/api/users", "Bearer", "Delete own account", "Working"),
    ("POST", "/api/partner/roles/create", "Bearer", "Create a role", "Working"),
]

MISSING_ENDPOINTS = [
    "/api/users (list all users)", "/api/users/all", "/api/admin/users",
    "/api/admin/orders", "/api/partner/users", "/api/partner/customers",
    "/api/roles/all", "/api/partner/roles/all", "/api/stats", "/api/admin/stats",
]

# --- Defects found during verification -------------------------------------
# Each: (id, title, severity, how found, resolution, commit)
DEFECTS = [
    ("D-01", "Absent stock treated as zero, making 17 of 22 products unbuyable",
     "Critical", "Exploratory testing against live catalogue data",
     "Stock made tri-state: null means untracked, only an explicit 0 is sold out.",
     "5eb259b"),
    ("D-02", "Category filter split identical categories by letter case",
     "Major", "Exploratory testing against live catalogue data",
     "Category names folded case-insensitively; the most common spelling is displayed.",
     "5eb259b"),
    ("D-03", "Role parsed incorrectly, so no account could ever be a partner",
     "Critical", "Integration testing of the real registration response",
     "Role read from the nested object; selling rights derived from the role name.",
     "ba0fe77"),
    ("D-04", "Open redirect on the sign-in page",
     "Critical (security)", "Security review of the authentication flow",
     "safeRedirect() accepts only root-relative paths; 14 unit cases added.",
     "ba0fe77"),
    ("D-05", "Order history rendered no line items and a zero total",
     "Critical", "Integration testing against real orders",
     "normalizeOrder now accepts the single embedded object the API returns.",
     "df54fe7"),
    ("D-06", "Lower-case product sizes rejected by the API, failing checkout",
     "Critical", "Integration testing of order creation",
     "Sizes normalised to upper case before submission.",
     "df54fe7"),
    ("D-07", "Partial order writes reported to the customer as a total failure",
     "Major", "Integration testing with a multi-line basket",
     "Failed multi-line submissions warn that some items may have been placed.",
     "df54fe7"),
    ("D-08", "Cart synchronisation retried a write the API does not implement",
     "Major", "Integration testing of cart endpoints",
     "Local cart made the source of truth; the saved cart is seeded once.",
     "df54fe7"),
    ("D-09", "Rate-limit message discarded because the body is not JSON",
     "Minor", "Integration testing under repeated requests",
     "Plain-text error bodies are read; internal database errors are masked.",
     "df54fe7"),
    ("D-10", "Lazy-loaded chunks fail for visitors held over a deployment",
     "Major", "Defect reported during user testing",
     "ChunkLoadError triggers one guarded reload; 9 detection cases added.",
     "036977f"),
    ("D-11", "Admin console called an endpoint that does not exist",
     "Critical", "Defect reported during administrator testing",
     "A 403 was misread as a hidden route; it is GET /api/orders/{id} refusing a "
     "customer. Now reads /api/partner/orders/system/all, added to the API "
     "documentation during the project.",
     "02a03c1"),
    ("D-12", "Error bodies with an object-valued message rendered as [object Object]",
     "Major", "Defect reported during administrator testing",
     "All error bodies coerced to text, including nested objects and HTML pages. 10 cases added.",
     "02a03c1"),
    ("D-13", "Populated productId produced links to /product/[object Object]",
     "Major", "Integration testing of /api/partner/orders",
     "Order lines normalise productId whether it arrives as an id or a populated object.",
     "02a03c1"),
    ("D-14", "Multi-child Link crashed the seller dashboard and order history",
     "Critical", "Defect reported during administrator testing",
     "Next requires one child per Link; \"Order #{id}\" is two. Both wrapped in an "
     "anchor; all 326 Link elements scanned.",
     "58c0377"),
    ("D-15", "Relative asset paths broke every nested route",
     "Critical", "Reported during interface review",
     "Images, stylesheets and scripts resolved against the current route, so on "
     "/farmer/* and /admin/* they 404ed and the auth middleware redirected them. "
     "350 references made root-relative.",
     "05b7471"),
    ("D-16", "Prices rendered as \"$GHS 25.00\"",
     "Minor", "Reported during interface review",
     "The template injects a dollar sign before every price via ::before. The six "
     "rules are overridden, since prices are in Ghana Cedis.",
     "05b7471"),
    ("D-17", "Form labels rendered on top of their inputs",
     "Major", "Reported during interface review",
     "The template pins .form-group label with position:absolute as its own "
     "convention. All 21 labels returned to normal flow.",
     "8edac16"),
    ("D-18", "Countdown displayed \"0NaN\"",
     "Major", "Reported during interface review",
     "The target was built by adding 20 to the day of the month without rolling "
     "into the next, producing an invalid date on any day after the 11th. Replaced "
     "with date arithmetic and a clamp on non-finite values.",
     "8edac16"),
    ("D-19", "Home page advertised five categories that do not exist",
     "Major", "Reported during interface review",
     "Invented template categories replaced with a strip derived from the live "
     "catalogue, linking through to a pre-filtered listing.",
     "8edac16"),
    ("D-20", "Header call to action wrapped and stretched the header",
     "Minor", "Reported during interface review",
     "a.theme-btn carries no white-space rule; a longer label broke onto three "
     "lines. Pinned to one line and shortened.",
     "73f7d3e"),
]

# --- Automated checks actually executed ------------------------------------
# (suite, cases, what it protects)
TEST_SUITES = [
    ("Redirect safety (safeRedirect)", 14,
     "Rejects absolute URLs, protocol-relative hosts, backslash variants and control characters."),
    ("Chunk-error detection", 9,
     "Reloads only on genuine chunk failures; ignores network, API and application errors."),
    ("Role and profile parsing", 9,
     "Nested and flat role shapes, admin/partner derivation, access-token stripping."),
    ("Order normalisation", 4,
     "Real orders produce line items and non-zero totals."),
    ("Error-message coercion", 10,
     "Every body shape the API returns — JSON, bare string, HTML page, object-valued message — becomes readable text."),
]

TOTAL_AUTOMATED_CASES = sum(item[1] for item in TEST_SUITES)
