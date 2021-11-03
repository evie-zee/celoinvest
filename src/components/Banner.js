import { useState } from "react";

const Banner = (props) => {
  const [name, setName] = useState("");
  const [identification, setIdentification] = useState("");
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(0);
  const submitHandler = (event) => {
    event.preventDefault();
    props.invest(name, identification, amount, duration);
  };

  return (
    <div className="main-banner">
      <div className="main-banner-item banner-item-two">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="main-banner-content">
                <h1>However, you make it we'll help you increase it</h1>
                <p>
                  Join CeloInvest, a revolutionary investment platform, get 15%
                  percent on your investment after every month.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="main-banner-form">
                <div className="content">
                  <h3>Investment Form</h3>
                </div>
                <form onSubmit={submitHandler}>
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label>Identification Number</label>
                        <input
                          onChange={(e) => setIdentification(e.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Identification Number"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label>Amount (CUSD)</label>
                        <input
                          onChange={(e) => setAmount(e.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Amount"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label>Duration (Months)</label>
                        <input
                          onChange={(e) => setDuration(e.target.value)}
                          type="text"
                          className="form-control"
                          placeholder="Duration"
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="banner-form-btn">
                        <button type="submit" className="default-btn">
                          Invest NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
