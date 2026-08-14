"""Draws the design diagrams required by the coursework brief.

Everything is rendered with matplotlib so the figures regenerate from source and
stay consistent with one another. Each function writes one PNG and returns its
path.
"""

import math
import os

import matplotlib

matplotlib.use("Agg")

import matplotlib.patches as patches
import matplotlib.pyplot as plt

# Palette taken from the storefront's own theme so the documents match the app.
GREEN = "#7EB693"
GREEN_DARK = "#274c3b"
SAND = "#F4F1EA"
INK = "#233020"
GREY = "#8a938c"
BLUE = "#5b8fb9"
AMBER = "#d9a441"
RED = "#c96a5f"

FONT = "DejaVu Sans"
plt.rcParams["font.family"] = FONT

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "diagrams")
os.makedirs(OUT_DIR, exist_ok=True)


def _canvas(width, height, title=None):
    fig, ax = plt.subplots(figsize=(width, height))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")
    if title:
        ax.text(50, 97, title, ha="center", va="top", fontsize=13, fontweight="bold", color=INK)
    return fig, ax


def _save(fig, name):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return path


def box(ax, x, y, w, h, text, fill="white", edge=GREEN_DARK, fontsize=8.5,
        weight="normal", text_color=INK, radius=1.2, lw=1.2):
    """Rounded rectangle with centred, pre-wrapped text."""
    patch = patches.FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad=0.4,rounding_size={radius}",
        linewidth=lw, edgecolor=edge, facecolor=fill,
    )
    ax.add_patch(patch)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            fontsize=fontsize, color=text_color, fontweight=weight, linespacing=1.45)
    return (x + w / 2, y + h / 2)


def arrow(ax, start, end, label=None, color=GREY, style="-|>", dashed=False,
          fontsize=7.5, label_offset=(0, 1.4), lw=1.1, rad=0.0):
    ax.annotate(
        "", xy=end, xytext=start,
        arrowprops=dict(
            arrowstyle=style, color=color, lw=lw,
            linestyle="--" if dashed else "-",
            connectionstyle=f"arc3,rad={rad}",
            shrinkA=2, shrinkB=2,
        ),
    )
    if label:
        mx = (start[0] + end[0]) / 2 + label_offset[0]
        my = (start[1] + end[1]) / 2 + label_offset[1]
        ax.text(mx, my, label, ha="center", va="center", fontsize=fontsize,
                color=INK, bbox=dict(boxstyle="round,pad=0.25", fc="white", ec="none", alpha=0.92))


def elbow(ax, points, label=None, color=GREY, label_at=None, fontsize=7.4, lw=1.1):
    """Orthogonal polyline with an arrowhead on the final segment.

    Curved connectors kept cutting straight through the boxes they were meant
    to route around, so branch flows are drawn as explicit right-angled paths.
    """
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    ax.plot(xs[:-1] + [xs[-1]], ys[:-1] + [ys[-1]], color=color, lw=lw, solid_joinstyle="miter")
    ax.annotate("", xy=points[-1], xytext=points[-2],
                arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, shrinkA=0, shrinkB=1))
    if label:
        lx, ly = label_at if label_at else points[0]
        ax.text(lx, ly, label, ha="center", va="center", fontsize=fontsize, color=color,
                bbox=dict(boxstyle="round,pad=0.25", fc="white", ec="none", alpha=0.95))


def actor(ax, x, y, label, scale=1.0):
    """Stick figure for use-case diagrams."""
    s = scale
    head = patches.Circle((x, y + 4.4 * s), 1.5 * s, fill=False, lw=1.3, edgecolor=GREEN_DARK)
    ax.add_patch(head)
    ax.plot([x, x], [y + 2.9 * s, y - 0.6 * s], color=GREEN_DARK, lw=1.3)
    ax.plot([x - 2.2 * s, x + 2.2 * s], [y + 1.9 * s, y + 1.9 * s], color=GREEN_DARK, lw=1.3)
    ax.plot([x, x - 1.8 * s], [y - 0.6 * s, y - 3.6 * s], color=GREEN_DARK, lw=1.3)
    ax.plot([x, x + 1.8 * s], [y - 0.6 * s, y - 3.6 * s], color=GREEN_DARK, lw=1.3)
    ax.text(x, y - 5.4 * s, label, ha="center", va="top", fontsize=8.5,
            fontweight="bold", color=INK)


def ellipse(ax, x, y, w, h, text, fill=SAND, edge=GREEN_DARK, fontsize=7.6):
    ax.add_patch(patches.Ellipse((x, y), w, h, facecolor=fill, edgecolor=edge, lw=1.1))
    ax.text(x, y, text, ha="center", va="center", fontsize=fontsize, color=INK, linespacing=1.35)


# --------------------------------------------------------------------------
# 1. System architecture
# --------------------------------------------------------------------------
def system_architecture():
    fig, ax = _canvas(11, 7.6, "Figure 1 — System Architecture")

    ax.add_patch(patches.FancyBboxPatch((3, 62), 94, 26, boxstyle="round,pad=0.6,rounding_size=1.5",
                                        fc="#fbfdfb", ec=GREY, lw=1, linestyle="--"))
    ax.text(5, 86, "Client tier — browser", fontsize=8, color=GREY, style="italic")

    ax.add_patch(patches.FancyBboxPatch((3, 24), 94, 34, boxstyle="round,pad=0.6,rounding_size=1.5",
                                        fc="#f7fbf8", ec=GREEN, lw=1, linestyle="--"))
    ax.text(5, 56, "Application tier — Next.js server on Vercel", fontsize=8, color=GREEN_DARK, style="italic")

    ax.add_patch(patches.FancyBboxPatch((3, 4), 94, 15, boxstyle="round,pad=0.6,rounding_size=1.5",
                                        fc="#fdf8f2", ec=AMBER, lw=1, linestyle="--"))
    ax.text(5, 17.5, "Service tier — external", fontsize=8, color="#8a6a25", style="italic")

    box(ax, 7, 68, 24, 14, "Storefront pages\nproducts · cart · checkout\norders · account", fill="white")
    box(ax, 38, 68, 24, 14, "Farmer dashboard\nlistings · incoming orders", fill="white")
    box(ax, 69, 68, 24, 14, "Admin console\noverview · orders\nproducts · roles", fill="white")

    box(ax, 7, 44, 40, 9, "React contexts\nAuth · Cart · Wishlist", fill=SAND)
    box(ax, 53, 44, 40, 9, "Client service layer\nsrc/services/*.js  (same-origin fetch)", fill=SAND)

    box(ax, 7, 27, 40, 12,
        "API proxy\npages/api/maya/[...path].js\ninjects x-apiKey + Bearer\nretries cold starts",
        fill=GREEN, text_color="white", weight="bold", edge=GREEN_DARK)
    box(ax, 53, 27, 40, 12,
        "Auth routes\npages/api/auth/*\nissues httpOnly cookies\n(token never reaches JS)",
        fill=GREEN, text_color="white", weight="bold", edge=GREEN_DARK)

    box(ax, 20, 6.5, 26, 10, "E-commerce REST API\nNode.js / Express", fill="white", edge=AMBER)
    box(ax, 54, 6.5, 26, 10, "MongoDB\n(managed by the API)", fill="white", edge=AMBER)

    arrow(ax, (19, 68), (19, 53.5), "state")
    arrow(ax, (50, 68), (73, 53.5), "calls")
    arrow(ax, (81, 68), (79, 53.5))
    arrow(ax, (27, 44), (27, 39.5))
    arrow(ax, (73, 44), (73, 39.5))
    arrow(ax, (27, 27), (30, 16.8), "HTTPS + x-apiKey", label_offset=(-9, 0.5))
    arrow(ax, (73, 27), (40, 16.8), "HTTPS + Bearer", label_offset=(11, 2.2))
    arrow(ax, (46, 11.5), (54, 11.5), "", color=AMBER)

    ax.text(50, -2, "The browser never contacts the API directly: the key stays on the server.",
            ha="center", fontsize=8, color=GREEN_DARK, style="italic")
    ax.set_ylim(-6, 100)
    return _save(fig, "01_system_architecture.png")


# --------------------------------------------------------------------------
# 2. Use-case diagram
# --------------------------------------------------------------------------
def use_case():
    fig, ax = _canvas(11, 8.6, "Figure 2 — Use-Case Diagram")

    ax.add_patch(patches.FancyBboxPatch((26, 6), 48, 84, boxstyle="round,pad=0.5,rounding_size=1.5",
                                        fc="#fcfdfc", ec=GREEN_DARK, lw=1.2))
    ax.text(50, 88, "Maya Marketplace", ha="center", fontsize=9.5, fontweight="bold", color=GREEN_DARK)

    cases = [
        (50, 82, "Browse products"),
        (50, 74, "Search & filter\ncatalogue"),
        (50, 66, "View product\ndetails"),
        (50, 58, "Manage cart"),
        (50, 50, "Register / sign in"),
        (50, 42, "Place order"),
        (50, 34, "Track own orders"),
        (50, 26, "Manage listings"),
        (50, 18, "Fulfil incoming\norders"),
        (50, 10, "Administer\nmarketplace"),
    ]
    for x, y, label in cases:
        ellipse(ax, x, y, 32, 6.6, label)

    actor(ax, 10, 74, "Guest")
    actor(ax, 10, 46, "Customer")
    actor(ax, 90, 60, "Farmer")
    actor(ax, 90, 22, "Administrator")

    for y in (82, 74, 66):
        arrow(ax, (13.5, 74), (34, y), color=GREY, style="-")
    for y in (58, 50, 42, 34, 66, 82):
        arrow(ax, (13.5, 46), (34, y), color=GREY, style="-")
    for y in (26, 18, 82):
        arrow(ax, (86.5, 60), (66, y), color=GREY, style="-")
    for y in (10, 18, 26, 34):
        arrow(ax, (86.5, 22), (66, y), color=GREY, style="-")

    ax.text(50, 3, "A Farmer inherits every Customer capability; an Administrator additionally sees all orders.",
            ha="center", fontsize=7.8, color=GREY, style="italic")
    return _save(fig, "02_use_case.png")


# --------------------------------------------------------------------------
# 3. Class / domain model
# --------------------------------------------------------------------------
def class_diagram():
    fig, ax = _canvas(12, 8.4, "Figure 3 — Domain Class Diagram")

    def cls(x, y, w, h, name, attrs):
        ax.add_patch(patches.Rectangle((x, y), w, h, fc="white", ec=GREEN_DARK, lw=1.2))
        ax.add_patch(patches.Rectangle((x, y + h - 5), w, 5, fc=GREEN, ec=GREEN_DARK, lw=1.2))
        ax.text(x + w / 2, y + h - 2.5, name, ha="center", va="center",
                fontsize=8.6, fontweight="bold", color="white")
        ax.text(x + 1.6, y + h - 6.6, "\n".join(attrs), ha="left", va="top",
                fontsize=7.1, color=INK, linespacing=1.5)
        return (x + w / 2, y + h / 2)

    cls(4, 66, 26, 24, "User", [
        "id : ObjectId", "username : String", "email : String",
        "role : Role", "partnerId : ObjectId?", "isPartner : Boolean (derived)",
        "isAdmin : Boolean (derived)"])
    cls(37, 74, 24, 16, "Role", [
        "id : ObjectId", "name : String", "description : String"])
    cls(69, 66, 27, 24, "Product", [
        "id : ObjectId", "title : String", "desc : String",
        "img : String", "categories : [String]", "price : Number",
        "owner / partnerId : ObjectId"])
    cls(69, 40, 27, 18, "CatalogueEntry", [
        "id : ObjectId", "size : Enum", "price : Number",
        "stock : Number | null"])
    cls(4, 38, 26, 20, "Cart", [
        "id : ObjectId", "userId : ObjectId",
        "products : [CartLine]", "createdAt : Date"])
    cls(4, 12, 26, 20, "CartLine", [
        "productId : ObjectId", "catalogueId : ObjectId",
        "quantity : Number"])
    cls(37, 12, 26, 24, "Order", [
        "id : ObjectId", "userId : ObjectId",
        "products : OrderLine", "address : Address",
        "status : Enum", "createdAt : Date"])
    cls(69, 12, 27, 20, "OrderLine", [
        "productId : ObjectId", "productName : String",
        "productImageUrl : String", "size : Enum",
        "quantity : Number", "amount : Number"])

    arrow(ax, (30, 80), (37, 82), "1", style="-", color=GREEN_DARK)
    arrow(ax, (82.5, 66), (82.5, 58), "1..*", style="-", color=GREEN_DARK)
    arrow(ax, (17, 66), (17, 58), "1  (write-once)", style="-", color=GREEN_DARK)
    arrow(ax, (17, 38), (17, 32), "0..*", style="-", color=GREEN_DARK)
    arrow(ax, (30, 22), (37, 24), "refs", style="-", dashed=True)
    arrow(ax, (63, 24), (69, 22), "1", style="-", color=GREEN_DARK)
    arrow(ax, (69, 76), (30, 78), "places", style="-", dashed=True, rad=-0.12)

    ax.text(50, 5,
            "Note: the API stores Order.products as a single embedded object, so one basket line "
            "becomes one Order.",
            ha="center", fontsize=7.8, color=RED, style="italic")
    return _save(fig, "03_class_diagram.png")


# --------------------------------------------------------------------------
# 4/5. Sequence diagrams
# --------------------------------------------------------------------------
def _sequence(title, actors, steps, filename, height=8.0, note=None):
    fig, ax = _canvas(12, height, title)
    n = len(actors)
    span = 92 / n
    xs = [6 + span * i + span / 2 for i in range(n)]
    top = 86
    bottom = 12 if note else 8

    for x, name in zip(xs, actors):
        box(ax, x - span / 2 + 3, top, span - 6, 6, name, fill=GREEN, text_color="white",
            weight="bold", fontsize=7.8)
        ax.plot([x, x], [top, bottom], color=GREY, lw=0.9, linestyle="--")

    y = top - 6
    gap = (top - bottom - 6) / max(len(steps), 1)
    for frm, to, label, dashed in steps:
        y -= gap
        x1, x2 = xs[frm], xs[to]
        if frm == to:
            ax.annotate("", xy=(x1 + 5, y - 1.4), xytext=(x1, y + 1.2),
                        arrowprops=dict(arrowstyle="-|>", color=GREY, lw=1.0,
                                        connectionstyle="arc3,rad=-1.6"))
            ax.text(x1 + 7, y, label, ha="left", va="center", fontsize=7.2, color=INK)
        else:
            arrow(ax, (x1, y), (x2, y), label, dashed=dashed, fontsize=7.2, label_offset=(0, 1.6))

    if note:
        ax.text(50, 4, note, ha="center", fontsize=7.8, color=GREEN_DARK, style="italic")
    return _save(fig, filename)


def sequence_login():
    return _sequence(
        "Figure 4 — Sequence: Sign In (token never reaches the browser)",
        ["Customer\n(browser)", "Login page", "/api/auth/login\n(Next server)", "REST API"],
        [
            (0, 1, "submits email + password", False),
            (1, 2, "POST credentials", False),
            (2, 3, "POST /api/auth/login\n+ x-apiKey", False),
            (3, 2, "200 { user, accessToken }", True),
            (2, 2, "strip accessToken", False),
            (2, 1, "Set-Cookie: maya_token (httpOnly)\n200 { user }", True),
            (1, 0, "redirect to safe path", True),
        ],
        "04_sequence_login.png",
        note="The access token is written straight into an httpOnly cookie; page JavaScript never sees it.",
    )


def sequence_order():
    return _sequence(
        "Figure 5 — Sequence: Place an Order",
        ["Customer", "Checkout page", "CartContext", "/api/maya proxy", "REST API"],
        [
            (0, 1, "submits delivery details", False),
            (1, 2, "read basket lines", False),
            (2, 1, "items + totals", True),
            (1, 1, "normalise size (uppercase)", False),
            (1, 3, "POST /api/orders/create", False),
            (3, 3, "attach x-apiKey + Bearer\nfrom httpOnly cookie", False),
            (3, 4, "POST /api/orders/create", False),
            (4, 3, "201 [ order per line ]", True),
            (3, 1, "orders[]", True),
            (1, 2, "clearCart()", False),
            (1, 0, "redirect to order history", True),
        ],
        "05_sequence_order.png",
        height=8.6,
        note="The API creates one order document per basket line and returns them as an array.",
    )


# --------------------------------------------------------------------------
# 6. Activity diagram
# --------------------------------------------------------------------------
def activity_checkout():
    fig, ax = _canvas(8.6, 11, "Figure 6 — Activity: Browse to Order")

    ax.add_patch(patches.Circle((50, 92), 2.2, fc=GREEN_DARK, ec=GREEN_DARK))

    def act(y, text, w=44, fill="white"):
        return box(ax, 50 - w / 2, y, w, 6.4, text, fill=fill, fontsize=8)

    def dec(y, text):
        ax.add_patch(patches.Polygon([[50, y + 8], [72, y + 4], [50, y], [28, y + 4]],
                                     fc=SAND, ec=GREEN_DARK, lw=1.1))
        ax.text(50, y + 4, text, ha="center", va="center", fontsize=7.6, color=INK)
        return (50, y + 4)

    act(82, "Browse the catalogue")
    act(72, "Open a product and pick size")
    act(62, "Add to basket (stored locally)")
    dec(50, "Signed in?")
    act(38, "Sign in or register", fill=SAND)
    act(28, "Enter delivery details")
    act(18, "Submit order")
    dec(6, "All lines accepted?")

    ax.add_patch(patches.Circle((50, -6), 2.4, fc="white", ec=GREEN_DARK, lw=1.4))
    ax.add_patch(patches.Circle((50, -6), 1.3, fc=GREEN_DARK, ec=GREEN_DARK))

    arrow(ax, (50, 90), (50, 88.4))
    arrow(ax, (50, 82), (50, 78.4))
    arrow(ax, (50, 72), (50, 68.4))
    arrow(ax, (50, 62), (50, 58))
    arrow(ax, (50, 50), (50, 44.4), "no", label_offset=(4, 0))
    arrow(ax, (50, 38), (50, 34.4))
    arrow(ax, (50, 28), (50, 24.4))
    arrow(ax, (50, 18), (50, 14))
    arrow(ax, (50, 6), (50, -3.6), "yes", label_offset=(4, 0))

    # "Signed in? → yes" must bypass the sign-in step, so it is routed around
    # the right-hand side rather than drawn straight through the box.
    elbow(ax, [(72, 54), (86, 54), (86, 36.6), (50, 36.6), (50, 34.6)],
          label="yes", label_at=(86, 45))

    # Rejected lines send the shopper back to review before resubmitting.
    elbow(ax, [(28, 10), (14, 10), (14, 21.2), (27.6, 21.2)],
          label="no", color=RED, label_at=(14, 15.5))
    ax.text(14, 5, "some lines may already\nhave been placed",
            fontsize=6.9, color=RED, ha="center", va="top")

    ax.text(50, -13, "The basket lives in the browser; sign-in is required only at checkout.",
            ha="center", fontsize=7.8, color=GREY, style="italic")
    ax.set_xlim(-2, 100)
    ax.set_ylim(-17, 100)
    return _save(fig, "06_activity_checkout.png")


# --------------------------------------------------------------------------
# 7. Entity relationship / data model
# --------------------------------------------------------------------------
def er_diagram():
    fig, ax = _canvas(11.5, 7.8, "Figure 7 — Entity Relationship / Data Model")

    def ent(x, y, w, h, name, rows):
        ax.add_patch(patches.Rectangle((x, y), w, h, fc="white", ec=GREEN_DARK, lw=1.2))
        ax.add_patch(patches.Rectangle((x, y + h - 5.2), w, 5.2, fc=GREEN_DARK, ec=GREEN_DARK))
        ax.text(x + w / 2, y + h - 2.6, name, ha="center", va="center",
                fontsize=8.4, fontweight="bold", color="white")
        ax.text(x + 1.5, y + h - 6.8, "\n".join(rows), ha="left", va="top",
                fontsize=6.9, color=INK, linespacing=1.55)

    ent(3, 58, 27, 30, "users", [
        "PK  _id", "     username", "     email", "     password (hashed)",
        "FK  role  → roles._id", "     partnerId"])
    ent(38, 66, 24, 22, "roles", [
        "PK  _id", "     name", "     description"])
    ent(70, 58, 27, 30, "products", [
        "PK  _id", "     title, desc, img", "     categories []", "     price, size, color",
        "FK  owner / partnerId", "     catalogue [ ]"])
    ent(70, 26, 27, 24, "catalogue (embedded)", [
        "PK  _id", "     size  (enum)", "     price", "     stock"])
    ent(3, 24, 27, 26, "carts", [
        "PK  _id", "FK  userId  → users._id  (unique)",
        "     products [ { productId,", "        catalogueId, quantity } ]",
        "     createdAt, updatedAt"])
    ent(38, 12, 27, 34, "orders", [
        "PK  _id", "FK  userId  → users._id",
        "     products { productId,", "        productName, size,",
        "        quantity, amount }", "     address { city, ... }",
        "     status  (enum)", "     createdAt, updatedAt"])

    arrow(ax, (30, 76), (38, 78), "N : 1", style="-", color=GREEN_DARK)
    arrow(ax, (30, 62), (70, 62), "1 : N   (owns)", style="-", color=GREEN_DARK, rad=-0.08)
    arrow(ax, (83.5, 58), (83.5, 50), "1 : N", style="-", color=GREEN_DARK)
    arrow(ax, (16, 58), (16, 50), "1 : 1", style="-", color=GREEN_DARK)
    arrow(ax, (30, 34), (38, 30), "N : 1", style="-", dashed=True)
    arrow(ax, (65, 30), (70, 34), "refs", style="-", dashed=True)

    ax.text(50, 6,
            "carts.userId carries a unique index — one cart per user, and it cannot be replaced.",
            ha="center", fontsize=7.8, color=RED, style="italic")
    return _save(fig, "07_er_model.png")


# --------------------------------------------------------------------------
# 8. Component diagram
# --------------------------------------------------------------------------
def component_diagram():
    fig, ax = _canvas(11.5, 7.4, "Figure 8 — Component Diagram (front-end modules)")

    box(ax, 4, 78, 28, 10, "pages/*\nroute components", fill=GREEN, text_color="white", weight="bold")
    box(ax, 36, 78, 28, 10, "src/components/*\nshop · farmer · admin", fill=GREEN, text_color="white", weight="bold")
    box(ax, 68, 78, 28, 10, "src/layout/*\nHeader · Footer · Layout", fill=GREEN, text_color="white", weight="bold")

    box(ax, 4, 58, 28, 12, "src/context/*\nAuthContext\nCartContext\nWishlistContext", fill=SAND)
    box(ax, 36, 58, 28, 12, "src/hooks/*\nuseProducts\nuseProductCatalog\nuseChunkRecovery", fill=SAND)
    box(ax, 68, 58, 28, 12, "src/services/normalizers.js\nshapes API records for the UI", fill=SAND)

    box(ax, 4, 38, 43, 12,
        "src/services (client)\napi · auth · products · cart\norders · partner · admin · users", fill="white")
    box(ax, 53, 38, 43, 12,
        "src/services (server-only)\nserverApi · serverProducts\nauthHandler · userProfile", fill="white")

    box(ax, 4, 18, 43, 10, "pages/api/maya/[...path].js\nAPI proxy", fill=BLUE, text_color="white", weight="bold")
    box(ax, 53, 18, 43, 10, "pages/api/auth/*\nsession issuer", fill=BLUE, text_color="white", weight="bold")

    box(ax, 26, 3, 48, 9, "middleware.js — route guard on /account, /orders, /farmer, /admin",
        fill="#eef4f0", edge=GREY)

    for x in (18, 50, 82):
        arrow(ax, (x, 78), (x, 70.5))
    arrow(ax, (18, 58), (18, 50.5))
    arrow(ax, (50, 58), (30, 50.5))
    arrow(ax, (82, 58), (70, 50.5))
    arrow(ax, (25, 38), (25, 28.5))
    arrow(ax, (74, 38), (74, 28.5))
    arrow(ax, (25, 18), (40, 12.5), dashed=True)
    arrow(ax, (74, 18), (60, 12.5), dashed=True)
    return _save(fig, "08_component_diagram.png")


# --------------------------------------------------------------------------
# 9. Deployment / technology architecture
# --------------------------------------------------------------------------
def deployment_diagram():
    fig, ax = _canvas(11, 6.4, "Figure 9 — Deployment / Technology Architecture")

    box(ax, 4, 62, 26, 20, "Browser\nChrome · Safari · Firefox\nHTML5 · CSS3 · ES2020",
        fill="white", edge=GREY)
    box(ax, 37, 62, 26, 20, "Vercel (Node runtime)\nNext.js 12.2.5 · React 18\nSSR + API routes",
        fill=GREEN, text_color="white", weight="bold")
    box(ax, 70, 62, 26, 20, "Render (free tier)\nNode.js / Express REST API",
        fill="white", edge=AMBER)

    box(ax, 70, 32, 26, 16, "MongoDB Atlas\ndocument store", fill="white", edge=AMBER)
    box(ax, 37, 32, 26, 16, "GitHub\nasanteSaana/maya\nmain · development", fill="white", edge=GREY)
    box(ax, 4, 32, 26, 16, "Vercel build pipeline\npush to main → deploy", fill="white", edge=GREY)

    arrow(ax, (30, 72), (37, 72), "HTTPS")
    arrow(ax, (63, 72), (70, 72), "HTTPS\nx-apiKey + Bearer", label_offset=(0, 3.4))
    arrow(ax, (83, 62), (83, 48), "driver")
    arrow(ax, (50, 32), (50, 62), "", dashed=True)
    arrow(ax, (30, 40), (37, 40), "", dashed=True)

    ax.text(50, 24,
            "Environment variables MAYA_API_KEY and MAYA_API_BASE_URL are set in Vercel and are "
            "never exposed to the client bundle.",
            ha="center", fontsize=8, color=GREEN_DARK, style="italic")
    ax.text(50, 15,
            "The Render free tier sleeps when idle; the server layer retries 502/503 cold starts "
            "up to three times.",
            ha="center", fontsize=8, color=GREY, style="italic")
    return _save(fig, "09_deployment.png")


# --------------------------------------------------------------------------
# 10. Wireframes
# --------------------------------------------------------------------------
def wireframes():
    fig, ax = _canvas(12, 8.4, "Figure 10 — Key Interface Wireframes")

    def frame(x, y, w, h, title):
        ax.add_patch(patches.Rectangle((x, y), w, h, fc="white", ec=INK, lw=1.3))
        ax.add_patch(patches.Rectangle((x, y + h - 4), w, 4, fc=GREEN_DARK, ec=INK, lw=1.3))
        ax.text(x + w / 2, y + h - 2, title, ha="center", va="center",
                fontsize=8, fontweight="bold", color="white")

    def bar(x, y, w, h, fill="#e9eeea", ec=GREY, label=None, fs=6.2):
        ax.add_patch(patches.Rectangle((x, y), w, h, fc=fill, ec=ec, lw=0.7))
        if label:
            ax.text(x + w / 2, y + h / 2, label, ha="center", va="center", fontsize=fs, color=INK)

    # Products listing
    frame(3, 52, 44, 40, "Products  (/products)")
    bar(5, 84, 12, 5, label="Search")
    bar(5, 76, 12, 6.5, label="Categories")
    bar(5, 68, 12, 6.5, label="Price")
    bar(5, 60, 12, 6.5, label="Best sellers")
    for i in range(3):
        for j in range(2):
            bar(19 + i * 9, 76 - j * 12, 8, 10.5, fill="white", label="product\ncard", fs=5.6)
    bar(19, 55, 26, 3.5, label="« 1 2 3 »", fs=6)

    # Product detail
    frame(53, 52, 44, 40, "Product detail  (/product/[id])")
    bar(55, 62, 18, 24, fill="#eef4f0", label="image")
    bar(75, 82, 20, 4, label="Title")
    bar(75, 76, 20, 4, label="Price · stock")
    bar(75, 70, 20, 4, label="Size selector")
    bar(75, 64, 9.5, 4, fill=GREEN, ec=GREEN_DARK, label="Add to cart")
    bar(85.5, 64, 9.5, 4, label="Wishlist")
    bar(55, 55, 40, 5, label="Description · Additional information · Related products")

    # Cart
    frame(3, 6, 44, 40, "Cart  (/cart)")
    for i in range(3):
        bar(5, 34 - i * 7, 40, 6, label="image   name   price   [− qty +]   line total", fs=5.8)
    bar(25, 10, 20, 10, fill="#f4f7f5", label="Subtotal\nShipping · VAT\nOrder total", fs=6)
    bar(25, 6.5, 20, 3, fill=GREEN, ec=GREEN_DARK, label="Proceed to checkout", fs=6)

    # Admin
    frame(53, 6, 44, 40, "Admin console  (/admin/orders)")
    bar(55, 12, 9, 28, fill="#f4f7f5", label="Overview\n\nOrders\n\nProducts\n\nRoles", fs=5.8)
    bar(66, 36, 29, 4, label="Search                    [status ▾]")
    ax.add_patch(patches.Rectangle((66, 14), 29, 20, fc="white", ec=GREY, lw=0.7))
    for i in range(5):
        ax.plot([66, 95], [34 - (i + 1) * 3.3, 34 - (i + 1) * 3.3], color="#dfe5e1", lw=0.6)
    ax.text(80.5, 32.2, "order   items   total   city   status   actions", ha="center",
            fontsize=5.6, color=INK, fontweight="bold")
    bar(66, 9, 29, 3.5, label="Showing 1–10 of N          « Prev   Next »", fs=5.6)

    return _save(fig, "10_wireframes.png")


ALL = [
    system_architecture, use_case, class_diagram, sequence_login, sequence_order,
    activity_checkout, er_diagram, component_diagram, deployment_diagram, wireframes,
]


if __name__ == "__main__":
    for fn in ALL:
        path = fn()
        print(f"  {os.path.basename(path)}")
    print(f"\n{len(ALL)} diagrams written to {OUT_DIR}")
