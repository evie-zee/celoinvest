import React, { useEffect, useState } from "react";
import "./App.css";
import Banner from "./components/Banner";
import MyAdmin from "./components/MyAdmin";
import MyInvestments from "./components/MyInvesments";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import abi from "./components/contracts/abi.abi.json";
import IERC20 from "./components/contracts/IERC20.abi.json";
function App() {
  const ERC20_DECIMALS = 18;

  const contractAddress = "0x678289796f4336E7044EE73fA9916D587eafa156";
  const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

  const [usdBalance, setUsdBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const connection = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        // notificationOff()
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        console.log(user_address);

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log("There is an error");
        console.log({ error });
      }
    } else {
      console.log("please install the extension");
    }
  };

  const getUSDBalance = async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const contract = new kit.web3.eth.Contract(abi, contractAddress);
      setContract(contract);
      setUsdBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  };

  const listOfInvestments = async (props) => {
    try {
      const investmentLength = await contract.methods
        .getInvestmentLength()
        .call();
      const _investments = [];

      for (let index = 0; index < investmentLength; index++) {
        let _investment = new Promise(async (resolve, reject) => {
          try {
            let investment = await contract.methods
              .getInvestments(index)
              .call();
            resolve({
              index: index,
              investor: investment[0],
              name: investment[1],
              identificationNumber: investment[2],
              amount: investment[3],
              duration: investment[4],
              isMature: investment[5],
              isPaid: investment[6],
              timestamp: investment[7],
            });
          } catch (error) {
            console.log(error);
          }
        });
        _investments.push(_investment);
      }
      const investments = await Promise.all(_investments);
      const _newInvestments = investments.filter(
        (investment) => investment.investor === address
      );
      setInvestments(investments);
      setUserInvestments(_newInvestments);
    } catch (error) {
      console.log(error);
    }
  };

  const isUserAdmin = async () => {
    try {
      console.log(address);
      const admin = await contract.methods.isUserAdmin(address).call();
      setIsAdmin(admin);
    } catch (error) {
      console.log(error);
    }
  };

  const invest = async (_name, _identification, _amount, _duration) => {
    const cUSDContract = new kit.web3.eth.Contract(IERC20, cUSDContractAddress);
    try {
      const amount = new BigNumber(_amount)
        .shiftedBy(ERC20_DECIMALS)
        .toString();
      await cUSDContract.methods
        .approve(contractAddress, amount)
        .send({ from: address });
      await contract.methods
        .invest(_name, _identification, _amount, _duration)
        .send({ from: address });
      listOfInvestments();
    } catch (error) {
      console.log(error);
    }
  };

  const matureHandler = async (index) => {
    console.log(index);
    try {
      await contract.methods.isInvestmentMature(index).send({ from: address });
      listOfInvestments();
    } catch (error) {
      console.log(error);
    }
  };

  const payInvestment = async (investment) => {
    console.log("Pay");
    try {
      const cUSDContract = new kit.web3.eth.Contract(
        IERC20,
        cUSDContractAddress
      );
      const amount = new BigNumber(10/100 + investment.amount * investment.amount)
        .shiftedBy(ERC20_DECIMALS)
        .toString();
      await cUSDContract.methods
        .approve(contractAddress, amount)
        .send({ from: address });
      await contract.methods
        .payInvestor(investment.index)
        .send({ from: address });
      listOfInvestments();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connection();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getUSDBalance();
    } else {
      console.log("no kit or address");
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      listOfInvestments();
      isUserAdmin();
    }
  }, [contract]);


  return (
    <Router>
      <Navbar balance={usdBalance} isAdmin={isAdmin} />
      <Switch>
        <Route exact path="/">
          <Banner invest={invest} />
        </Route>
        <Route path="/admin">
          {isAdmin && (
            <MyAdmin
              investments={investments}
              matureHandler={matureHandler}
              payInvestment={payInvestment}
            />
          )}
        </Route>
      </Switch>
      <MyInvestments investments={userInvestments} />
      {/* <Banner /> */}
    </Router>
  );
}

export default App;
