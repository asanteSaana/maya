import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { sidebarToggle } from "../utils";
import { Account, Blog, Contact, Gallery, PagesDasktop, Shop } from "./Menus";
import MobileMenu from "./MobileMenu";

// header={1} is the home page's overlay treatment; every other page uses the
// standard bar.
const Header = ({ header }) => <SiteHeader absolute={header === 1} />;

export default Header;

const SearchBtn = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <Fragment>
      <button className="far fa-search" onClick={() => setToggle(!toggle)} />
      <form
        onSubmit={(e) => e.preventDefault()}
        action="#"
        className={`${toggle ? "" : "hide"}`}
      >
        <input
          type="text"
          placeholder="Search"
          className="searchbox"
          required=""
        />
        <button type="submit" className="searchbutton far fa-search" />
      </form>
    </Fragment>
  );
};

const HeaderCartButton = ({ showCount = true }) => {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <button
      type="button"
      className="cart"
      aria-label="View cart"
      onClick={() => router.push("/cart")}
    >
      <i className="far fa-shopping-basket" />
      {showCount && <span>{itemCount}</span>}
    </button>
  );
};

const HeaderUserButton = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <button
      type="button"
      className="user"
      aria-label={isAuthenticated ? "View account" : "Sign in"}
      onClick={() => router.push(isAuthenticated ? "/account" : "/login")}
    >
      <i className="far fa-user-circle" />
    </button>
  );
};

const DaskTopMenu = () => (
  <ul className="navigation clearfix d-none d-lg-flex">
    <li>
      <Link href="/">Home</Link>
    </li>
    <li>
      <Link href="/products">Products</Link>
    </li>
    <li className="dropdown">
      <a href="#">pages</a>
      <ul>
        <PagesDasktop />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li className="dropdown">
      <a href="#">gallery</a>
      <ul>
        <Gallery />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li className="dropdown">
      <a href="#">blog</a>
      <ul>
        <Blog />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li className="dropdown">
      <a href="#">shop</a>
      <ul>
        <Shop />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <li className="dropdown">
      <a href="#">account</a>
      <ul>
        <Account />
      </ul>
      <div className="dropdown-btn">
        <span className="fas fa-chevron-down" />
      </div>
    </li>
    <Contact />
  </ul>
);

const Nav = () => {
  const [nav, setNav] = useState(false);
  return (
    <nav className="main-menu navbar-expand-lg mobile-nav">
      <div className="navbar-header">
        <div className="mobile-logo my-15 ">
          <Link href="/">
            <a>
              <img src="/assets/images/logos/logo.png" alt="Logo" title="Logo" />
              <img
                src="/assets/images/logos/logo-white.png"
                alt="Logo"
                title="Logo"
              />
            </a>
          </Link>
        </div>
        {/* Toggle Button */}
        <button
          type="button"
          className="navbar-toggle"
          data-toggle="collapse"
          data-target=".navbar-collapse"
          onClick={() => setNav(!nav)}
        >
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
      </div>
      <div className={`navbar-collapse collapse clearfix ${nav ? "show" : ""}`}>
        <DaskTopMenu />
        <MobileMenu />
      </div>
    </nav>
  );
};


const CONTACT_EMAIL = "mayatek@gmail.com";
const CONTACT_PHONE = "+233 579 2200";

/**
 * The template shipped four header variants that differed only in a class name
 * and stray placeholder copy. Two of them belonged to homepages that no longer
 * exist. One component now covers every page; `absolute` is the overlay
 * treatment the home hero needs.
 */
const TopBar = () => (
  <div className="header-top-wrap bg-light-green text-white py-10">
    <div className="container-fluid">
      <div className="header-top">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="top-left">
              <ul>
                <li>
                  <i className="far fa-envelope" /> <b>Email :</b>{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="top-right text-lg-right">
              <ul>
                <li>
                  <i className="far fa-phone" /> <b>Call :</b>{" "}
                  <a href={`tel:${CONTACT_PHONE.replace(/[^0-9+]/g, "")}`}>
                    {CONTACT_PHONE}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HeaderActions = () => {
  const { isPartner, isReady } = useAuth();

  return (
    <div className="menu-icons">
      <div className="nav-search py-15">
        <SearchBtn />
      </div>
      <HeaderCartButton />
      <HeaderUserButton />
      {/* Recruiting sellers is what this marketplace needs; farmers who are
          already selling get their dashboard instead. The label is kept to two
          words: the slot is narrow, and anything longer wraps and stretches the
          whole header. Visibility is handled in CSS rather than with Bootstrap
          display utilities, which would override the button's flex alignment. */}
      <Link href={isReady && isPartner ? "/farmer/dashboard" : "/register"}>
        <a className="header-cta theme-btn">
          {isReady && isPartner ? "My dashboard" : "Start selling"}
          <i className="fas fa-angle-double-right" />
        </a>
      </Link>
      <div className="menu-sidebar" onClick={() => sidebarToggle()}>
        <button type="button" aria-label="Open menu">
          <i className="far fa-ellipsis-h" />
          <i className="far fa-ellipsis-h" />
          <i className="far fa-ellipsis-h" />
        </button>
      </div>
    </div>
  );
};

const SiteHeader = ({ absolute = false }) => (
  <header className={`main-header ${absolute ? "menu-absolute" : ""}`}>
    <TopBar />
    <div className="header-upper">
      <div className="container-fluid clearfix">
        <div className="header-inner d-flex align-items-center">
          <div className="logo-outer">
            <div className="logo">
              <Link href="/">
                <a>
                  <img
                    src="/assets/images/logos/logo.png"
                    alt="Maya"
                    title="Maya"
                  />
                </a>
              </Link>
            </div>
          </div>
          <div className="nav-outer clearfix">
            <Nav />
          </div>
          <HeaderActions />
        </div>
      </div>
    </div>
  </header>
);
