import Head from "next/head";
import { Fragment, useEffect } from "react";
import niceSelect from "react-nice-select";
import ImageView from "../components/ImageView";
import VideoPopup from "../components/VideoPopup";
import { animation, stickyNav } from "../utils";
import Footer from "./Footer";
import Header from "./Header";
import SideBar from "./SideBar";

const SITE_NAME = "Maya";
const DEFAULT_DESCRIPTION =
  "Buy fresh produce straight from Ghanaian farmers, or sell your own harvest " +
  "to customers directly.";

/**
 * Every page previously shared one title and carried no description at all,
 * which makes browser tabs indistinguishable and gives search engines nothing
 * to work with. Pages pass their own; the defaults cover anything that does not.
 */
const Layout = ({ header, footer, title, description, children }) => {
  useEffect(() => {
    stickyNav();
    animation();
    niceSelect();
  }, []);
  // The "home-three" body class belonged to the deleted index3 variant. Any
  // stale copy is cleared so it cannot leak the alternate theme onto a page.
  useEffect(() => {
    document.querySelector("body").classList.remove("home-three");
  }, []);

  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Farm-fresh produce, direct from the grower`;

  return (
    <Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description || DEFAULT_DESCRIPTION} />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={description || DEFAULT_DESCRIPTION}
        />
        <meta property="og:type" content="website" />
      </Head>
      <VideoPopup />
      <ImageView />
      <div className="page-wrapper">
        <Header header={header} />
        <SideBar />
        {children}
        <Footer footer={footer} />
      </div>
    </Fragment>
  );
};
export default Layout;
