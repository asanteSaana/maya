"""Generates User_Manual.docx — for customers, farmers and administrators."""

import facts
from docbuild import (bullets, callout, code, figure, h1, h2, h3, new_document,
                      numbered, page_break, para, save, table, title_page, toc)


def build():
    doc = new_document("Maya — User Manual")
    title_page(doc, facts.PROJECT_TITLE, "User Manual", facts)
    toc(doc)

    h1(doc, "1. About Maya")
    para(doc, "Maya is a marketplace where farmers sell produce directly to the people who eat "
              "it. Shoppers browse what local farmers have listed, collect items in a basket and "
              "place an order. Farmers publish their own produce and decide which orders to "
              "accept. This manual covers all three kinds of user; start at the section that "
              "matches what you want to do.", align="justify")

    table(doc, ["If you want to…", "Go to"], [
        ("Buy produce", "Section 3 — For Shoppers"),
        ("Sell your harvest", "Section 4 — For Farmers"),
        ("Oversee the marketplace", "Section 5 — For Administrators"),
        ("Fix something that has gone wrong", "Section 6 — Troubleshooting"),
    ], widths=[8.0, 7.8])

    h1(doc, "2. Getting Started")

    h2(doc, "2.1 What you need")
    bullets(doc, [
        "A current web browser: Chrome, Firefox, Edge or Safari.",
        "An internet connection. The site works on a phone as well as a computer.",
        "JavaScript and cookies enabled — both are on by default.",
    ])

    h2(doc, "2.2 Opening the site")
    para(doc, f"Visit {facts.LIVE_URL}. You can browse everything on sale without an account. "
              "You only need to sign in when you are ready to place an order.", align="justify")

    h2(doc, "2.3 Creating an account")
    numbered(doc, [
        "Open the account menu in the header and choose Create account.",
        "Enter a username, your e-mail address and a password of at least six characters.",
        "Type the password a second time to confirm it.",
        "Choose whether you want to buy produce or sell it.",
        "Select Create Account. You are signed in immediately.",
    ])
    callout(doc, "Selling.",
            "Choosing “Sell my produce” creates your account, but selling has to be switched on "
            "by Maya before your farmer dashboard opens. You will be told this on screen and "
            "given your account reference to quote. You can shop straight away in the meantime.")

    h2(doc, "2.4 Signing in and out")
    para(doc, "Choose Sign in from the account menu and enter your e-mail address and password. "
              "If you were interrupted on your way to another page, you are returned there once "
              "you have signed in. To sign out, use Sign out in the same menu. Your session lasts "
              "seven days unless you sign out.", align="justify")

    page_break(doc)
    h1(doc, "3. For Shoppers")

    h2(doc, "3.1 Finding produce")
    para(doc, "Choose Products in the main menu to see everything on sale. The panel on the left "
              "helps you narrow it down:", align="justify")
    table(doc, ["Tool", "What it does"], [
        ("Search box", "Matches words in the product name and description as you type."),
        ("Category", "Shows only one kind of produce. The number beside each category is how many products it holds."),
        ("Filter by price", "Limits results to a price band."),
        ("Sort", "Orders results by newest, oldest, or price."),
        ("Page controls", "Move through the catalogue when there is more than one page."),
    ], widths=[4.2, 11.6])
    para(doc, "Filters combine. Choosing a category and then a price band shows only products "
              "matching both. To clear a filter, select it again or choose All Products.",
         align="justify")

    h2(doc, "3.2 Looking at a product")
    para(doc, "Select any product to open its page, where you will find the description, the "
              "price, the sizes available and whether it is in stock. Where a farmer offers "
              "several sizes, choose one — the price updates as you change it. Some farmers do "
              "not track exact stock; those products show simply “In stock”.", align="justify")

    h2(doc, "3.3 Your basket")
    numbered(doc, [
        "Choose Add to Cart on a product page, or the basket button on any product card.",
        "The basket icon in the header shows how many items you are carrying.",
        "Open the basket from that icon to review what you have.",
        "Use − and + to change a quantity, or × to remove a line.",
        "The totals — subtotal, shipping, VAT and order total — update as you go.",
    ])
    callout(doc, "Your basket is kept on your device.",
            "You can close the browser and come back later and it will still be there. If you add "
            "items before signing in, they are combined with anything already saved to your "
            "account rather than replacing it. A basket does not currently follow you to a "
            "different device.")

    h2(doc, "3.4 Wishlist")
    para(doc, "Use the heart control to save a product for later. Your wishlist is reached from "
              "the account menu, and is stored on the device you are using.", align="justify")

    h2(doc, "3.5 Placing an order")
    numbered(doc, [
        "Open your basket and choose Proceed to checkout.",
        "Sign in if you have not already; you are returned to checkout afterwards.",
        "Enter your delivery details, including the town or city.",
        "Check the order summary.",
        "Choose Place order.",
    ])
    para(doc, "You are then taken to your order, or to your order history if you bought several "
              "different items, and your basket is emptied.", align="justify")
    callout(doc, "Several items means several orders.",
            "Each different product becomes its own order so that each farmer can accept their "
            "part independently. Buying three products creates three orders, all visible in your "
            "order history. Payment is arranged directly with the farmer; the site does not take "
            "payment.")

    h2(doc, "3.6 Tracking your orders")
    para(doc, "Choose My orders from the account menu. Each order shows what you bought, the "
              "total, where it is going and its current state:", align="justify")
    table(doc, ["Status", "Meaning"], [
        ("Pending", "The farmer has not yet responded."),
        ("Accepted", "The farmer has agreed to supply the order."),
        ("Rejected", "The farmer cannot supply it. Nothing is owed."),
    ], widths=[4.0, 11.8])

    h2(doc, "3.7 Your account details")
    para(doc, "Choose My account to see your username, e-mail address and account type, and to "
              "change your username or password. Your e-mail address cannot be changed.",
         align="justify")

    page_break(doc)
    h1(doc, "4. For Farmers")
    para(doc, "Everything in Section 3 applies to you as well; this section covers the selling "
              "tools. Your dashboard opens once selling has been enabled on your account.",
         align="justify")

    h2(doc, "4.1 Your dashboard")
    para(doc, "Choose Farmer dashboard from the account menu. It shows how many listings you "
              "have, how many orders are waiting for you, how many you have accepted, and the "
              "revenue from those accepted orders, together with your most recent orders.",
         align="justify")

    h2(doc, "4.2 Publishing produce")
    numbered(doc, [
        "Choose Add Listing.",
        "Give the produce a name and a description telling shoppers what it is and how it was grown.",
        "Provide an image address, or leave it blank to use a default picture.",
        "Enter one or more categories, separated by commas.",
        "Add a row for each size you sell, with its price and how much you have.",
        "Choose Publish listing.",
    ])
    callout(doc, "Sizes.",
            "Sizes must be one of the accepted values — S, M, L or XL. Use the size boxes rather "
            "than typing your own, or an order for that product may be refused.")

    h2(doc, "4.3 Keeping listings up to date")
    para(doc, "Choose My Listings to see everything you sell, with its price and remaining stock. "
              "Select Edit on any listing to change its description, prices or stock levels. "
              "Reducing a size's stock to zero marks it sold out; shoppers can still see it but "
              "cannot buy it.", align="justify")

    h2(doc, "4.4 Handling orders")
    numbered(doc, [
        "Choose Incoming Orders to see what has been ordered from you.",
        "Each entry shows the produce, quantity, total and delivery town.",
        "Choose Accept if you can supply it, or Reject if you cannot.",
        "The shopper sees the change in their order history straight away.",
    ])
    para(doc, "Respond promptly: an order left pending gives the shopper no indication of whether "
              "their food is coming.", align="justify")

    page_break(doc)
    h1(doc, "5. For Administrators")
    para(doc, f"The console is at {facts.ADMIN_URL} and is also linked from the account menu. It "
              "requires a staff account; other users are shown a polite refusal.", align="justify")

    h2(doc, "5.1 Overview")
    para(doc, "Shows total orders, how many await a farmer's response, the revenue from accepted "
              "orders and the number of live listings, followed by the most recent orders across "
              "the whole marketplace.", align="justify")

    h2(doc, "5.2 All orders")
    para(doc, "Every order placed by anyone. You can search by product, town or order reference, "
              "sort any column by selecting its heading, and filter by status. To change an "
              "order, use the status selector on its row; to remove one, use Delete.",
         align="justify")
    callout(doc, "Deletion is permanent.", "A deleted order cannot be recovered.")

    h2(doc, "5.3 Products")
    para(doc, "Every listing on the marketplace with its category, price, sizes and stock. Select "
              "Edit to correct a listing, or Add listing to publish one.", align="justify")

    h2(doc, "5.4 Roles")
    para(doc, "Roles decide what an account may do. Creating one here returns its identifier, "
              "which is needed to enable farmer registration. Copy it before leaving the page — "
              "there is no way to list roles again afterwards.", align="justify")

    page_break(doc)
    h1(doc, "6. Troubleshooting")
    table(doc, ["What you see", "Why", "What to do"], [
        ("The first page load is very slow.",
         "The service sleeps when unused and takes a moment to wake.",
         "Wait; it retries automatically. Reload if nothing appears after a minute."),
        ("“Too many requests just now.”",
         "The service accepts a limited number of requests each minute.",
         "Wait about a minute and try again."),
        ("“Incorrect email or password.”",
         "The credentials do not match an account.",
         "Check the address and password. Create an account if you have not registered."),
        ("You are sent to the sign-in page unexpectedly.",
         "Your session has expired or you signed out elsewhere.",
         "Sign in again; you are returned to where you were."),
        ("“Administrator access required.”",
         "Your account is not a staff account.",
         "Contact Maya if you should have access."),
        ("Your farmer dashboard will not open.",
         "Selling has not yet been enabled for your account.",
         "Contact Maya quoting the account reference shown on your account page."),
        ("An order failed but appears in your history.",
         "Orders are created one item at a time and part of the request succeeded.",
         "Check your order history before trying again, so you do not order twice."),
        ("A product shows “Sold out”.",
         "The farmer has set that size's stock to zero.",
         "Try a different size, or come back later."),
        ("Part of the page fails to load after an update.",
         "The site was updated while your page was open.",
         "It reloads itself once. If not, refresh the page."),
    ], widths=[4.4, 5.2, 6.2], font_size=8.5)

    h1(doc, "7. Privacy and Security")
    bullets(doc, [
        "Your password is never stored by this site; it is sent once to the account service and kept only in an encrypted form there.",
        "Your session is held in a cookie that the website's own code cannot read, which limits what a malicious script could do.",
        "Sign out on a shared computer to end your session immediately.",
        "Maya does not take payment and never asks for card details. Treat any request for them as fraudulent.",
    ])

    return save(doc, "User_Manual.docx")


if __name__ == "__main__":
    print(build())
