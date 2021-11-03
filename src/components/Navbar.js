import { Link } from "react-router-dom";

const Navbar = (props) => {
  return (
    <div className="navbar-area navbar-color-two">
      <div className="main-responsive-nav">
        <div className="container">
          <div className="main-responsive-menu">
            <div className="logo">
              <a href="">
                <h1>CeloInvest</h1>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="main-navbar">
        <div className="container">
          <nav className="navbar navbar-expand-md navbar-light">
            <a className="navbar-brand" href="/">
              <h2>CeloInvest</h2>
            </a>
            <div
              className="collapse navbar-collapse mean-menu"
              id="navbarSupportedContent"
            >
              {props.isAdmin && (
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">
                      Admin
                    </Link>
                  </li>
                </ul>
              )}

              <div className="others-options d-flex align-items-center">
                <div className="option-item">
                  <a href="#" className="default-btn">
                    CUSD: ${props.balance}
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="others-option-for-responsive color-two">
        <div className="container">
          <div className="dot-menu">
            <div className="inner">
              <div className="circle circle-one" />
              <div className="circle circle-two" />
              <div className="circle circle-three" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
