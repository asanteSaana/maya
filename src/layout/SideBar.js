import { Fragment } from "react";
import { sidebarToggle } from "../utils";
const SideBar = () => {
  return (
    <Fragment>
      <div className="form-back-drop" onClick={() => sidebarToggle()} />
      {/* Hidden Sidebar */}
      <section className="hidden-bar">
        <div className="inner-box text-center">
          <div className="cross-icon" onClick={() => sidebarToggle()}>
            <span className="fa fa-times" />
          </div>
          <div className="title">
            <h4>Get Appointment</h4>
          </div>
          {/*Appointment Form*/}
          <div className="appointment-form">
            <form onSubmit={(e) => e.preventDefault()} method="post">
              <div className="form-group">
                <input
                  type="text"
                  name="text"
                  defaultValue=""
                  placeholder="Name"
                  required=""
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  defaultValue=""
                  placeholder="Email Address"
                  required=""
                />
              </div>
              <div className="form-group">
                <textarea placeholder="Message" rows={5} defaultValue={""} />
              </div>
              <div className="form-group">
                <button type="submit" className="theme-btn">
                  Submit now
                </button>
              </div>
            </form>
          </div>
          {/* The template's social icons all pointed at "#". Icons that lead
              nowhere cost trust; they return once there are real accounts. */}
        </div>
      </section>
    </Fragment>
  );
};
export default SideBar;
