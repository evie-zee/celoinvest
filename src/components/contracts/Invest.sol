// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

/**
* @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {
  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b);
    return c;

  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;

  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;
    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);
    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }

}

contract celoinvest{
    struct Investment{
        address payable investor;
        string name;
        string identificationNumber;
        uint amount;
        uint duration;
        bool isMature;
        bool isPaid;
        uint timestamp;
    }
    
    using SafeMath for uint256;
    
    uint internal investmentLength = 0;
    uint internal taxFee = 1000000000000000000;
    mapping (uint => Investment) internal investments;
    
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    modifier isAdmin(uint _id){
         require(msg.sender == address(this),"Accessible only to the admin");
        _;
    }
    
    modifier isInvestmentOwner(uint _index) {
        require(msg.sender == investments[_index].investor,"Accessible only to the owner");
        _;
    }
    
    // modifier that ensures that a loan is mature we use a test period of 2 minutes
    modifier isLoanMature(uint _index){
        require(block.timestamp > (investments[_index].timestamp.add(2 minutes)));
        _;
    }
    
    function invest(
        string memory _name,
        string memory _identification,
        uint _amount,
        uint _duration
    )public{
        require(
              IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
              ),    
              "This transaction could not be performed"
        );
        investments[investmentLength] = Investment(
            payable(msg.sender),
            _name,
            _identification,
            _amount,
            _duration,
            false,
            false,
            block.timestamp
        );
        
        investmentLength++;
    }
    
    function getInvestments(uint _index) public view isAdmin(_index) returns(
        address payable,
        string memory,
        string memory,
        uint,
        uint,
        bool,
        bool,
        uint
    ){
        Investment storage _investments = investments[_index];
        return(
            _investments.investor,
            _investments.name,
            _investments.identificationNumber,
            _investments.amount,
            _investments.duration,
            _investments.isMature,
            _investments.isPaid,
            _investments.timestamp
        );
    }
    
    
    function payInvestor(uint _index) public isAdmin(_index) isLoanMature(_index) {
        require(IERC20Token(cUsdTokenAddress).balanceOf(address(this)) > investments[_index].amount.add(investments[_index].duration.mul(15).div(100)), "Cannot withdraw from smart contract. Try later" );

        require(
              IERC20Token(cUsdTokenAddress).transfer(
                investments[_index].investor,
                investments[_index].amount.add(investments[_index].duration.mul(15).div(100))
              ),    
              "This transaction could not be performed"
        );
        investments[_index].isPaid = true;
    }
    
    // function that allows an investor to personally withdraw her investments if the maturity time is reached
    function collectInvestment(uint _index) public isInvestmentOwner(_index) isLoanMature(_index){
    require(IERC20Token(cUsdTokenAddress).balanceOf(address(this)) > investments[_index].amount.add(investments[_index].duration.mul(15).div(100)), "Cannot withdraw from smart contract. Try later" );

        require(
              IERC20Token(cUsdTokenAddress).transfer(
                investments[_index].investor,
                investments[_index].amount.add(investments[_index].duration.mul(15).div(100))
              ),    
              "This transaction could not be performed"
        );
        investments[_index].isPaid = true;
    }
    
    
    // function to check if the user is an admin
    function isUserAdmin(address _address) public view returns (bool){
        if(_address == address(this)){
            return true;
        }
        return false;
    }
    
    function getInvestmentLength() public view returns (uint){
        return investmentLength;
    }


     function reInvest(uint _index)public{

         //user collects his interest and leaves the capital
          require(
              IERC20Token(cUsdTokenAddress).transfer(
                investments[_index].investor,
                investments[_index].duration.mul(15).div(100)
              ),    
              "This transaction could not be performed"
        );
        investments[_index].isPaid = false;
        investments[_index].timestamp = block.timestamp;
       
    }

}