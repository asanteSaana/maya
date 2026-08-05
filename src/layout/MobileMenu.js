import Link from "next/link";
import { useState } from "react";
import { Account, Blog, Contact, Gallery, PagesMobile, Shop } from "./Menus";
const MobileMenu = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  return (
    <ul className="navigation clearfix d-block d-lg-none mobile-header">
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/products">Products</Link>
      </li>
      <li className="dropdown">
        <a href="#">pages</a>
        <ul style={activeLi("pages")}>
          <PagesMobile />
        </ul>
        <div className="dropdown-btn" onClick={() => activeMenuSet("pages")}>
          <span className="fas fa-chevron-down" />
        </div>
      </li>
      <li className="dropdown">
        <a href="#">gallery</a>
        <ul style={activeLi("gallery")}>
          <Gallery />
        </ul>
        <div className="dropdown-btn" onClick={() => activeMenuSet("gallery")}>
          <span className="fas fa-chevron-down" />
        </div>
      </li>
      <li className="dropdown">
        <a href="#">blog</a>
        <ul style={activeLi("blog")}>
          <Blog />
        </ul>
        <div className="dropdown-btn" onClick={() => activeMenuSet("blog")}>
          <span className="fas fa-chevron-down" />
        </div>
      </li>
      <li className="dropdown">
        <a href="#">shop</a>
        <ul style={activeLi("shop")}>
          <Shop />
        </ul>
        <div className="dropdown-btn" onClick={() => activeMenuSet("shop")}>
          <span className="fas fa-chevron-down" />
        </div>
      </li>
      <li className="dropdown">
        <a href="#">account</a>
        <ul style={activeLi("account")}>
          <Account />
        </ul>
        <div className="dropdown-btn" onClick={() => activeMenuSet("account")}>
          <span className="fas fa-chevron-down" />
        </div>
      </li>
      <Contact />
    </ul>
  );
};
export default MobileMenu;
