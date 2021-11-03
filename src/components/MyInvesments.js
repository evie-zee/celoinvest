const MyInvestments = (props) => {
  return (
    <section className="pricing-area pt-100 pb-70">
      <div className="container">
        <div className="container">
        <h2>My Investments</h2>
          <div className="tab pricing-list-tab">
            <div className="tab_content">
              <div className="tabs_item">
                <div className="row">
                  {props.investments.map((investment) => (
                    <div className="col-lg-4 col-md-6">
                      <div className="single-pricing-box">
                        <div className="pricing-header">
                        {console.log(investment.isPaid)}
                          <p>{investment.investor}</p>
                        </div>
                        <div className="price">
                          ${investment.amount}
                        </div>
                        <div className="pricing-header">
                          Name: {investment.name}
                        </div>
                        <div className="pricing-header">
                          Duration: {investment.duration} month(s)
                        </div>
                        {investment.isPaid && <div className="pricing-header">
                         Retrieved
                        </div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyInvestments;
