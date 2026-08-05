import { Fragment, useEffect } from "react";
import niceSelect from "react-nice-select";
import ImageView from "../components/ImageView";
import VideoPopup from "../components/VideoPopup";
import { animation, stickyNav } from "../utils";
import Footer from "./Footer";
import Header from "./Header";
import SideBar from "./SideBar";
const Layout = ({ header, footer, children }) => {
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
  return (
    <Fragment>
      <VideoPopup />
      <ImageView />
      {/* <ImageGallery /> */}
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
