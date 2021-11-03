

const MyAdmin = (props) => {
  const matureHandler = (index) =>{
    props.matureHandler(index);
  }
  const payInvestment = (investment)=>{
    props.payInvestment(investment)
  }
  return (
    <section className="pricing-area pt-100 pb-70">
     <div className="container">
        <div className="container">
          <div className="tab pricing-list-tab">
            <div className="tab_content">
              <div className="tabs_item">
                <div className="row">
                  {props.investments.map(investment=><div className="col-lg-4 col-md-6">                  
                    <div className="single-pricing-box">
                      <div className="pricing-header">
                        <h3>{investment.name}</h3>
                      </div>
                      <div className="price">
                        ${investment.amount}
                      </div>
                      {!investment.isPaid ? <div className="pricing-btn">
                        <a onClick={investment.isMature? ()=>payInvestment(investment):()=>matureHandler(investment.index)} className="default-btn">
                          {investment.isMature ? "Pay Off" : "Check if mature"} 
                          <span />
                        </a>
                      </div> : <p>Paid</p>} 
                      
                    </div>
                  </div>)}
                  
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAdmin;
