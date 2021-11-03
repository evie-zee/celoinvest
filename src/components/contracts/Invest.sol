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
    
    uint internal investmentLength = 0;
    uint internal taxFee = 1000000000000000000;
    mapping (uint => Investment) internal investments;
    
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    modifier isAdmin(uint _id){
         require(msg.sender == address(this),"Accessible only to the admin");
        _;
    }
    
    modifier isOwner(uint _index) {
        require(msg.sender == investments[_index].investor,"Accessible only to the owner");
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
    // function to check if the loan is mature we use a test period of 2 minutes
    function isLoanMature(uint _index)public view isAdmin(_index)returns(bool) {
        if(block.timestamp > (investments[_index].timestamp + 2 minutes)){
            return true;
        }
        return false;
    }
    
    function payInvestor(uint _index) public isAdmin(_index){
        require(
              IERC20Token(cUsdTokenAddress).transfer(
                investments[_index].investor,
                investments[_index].amount+investments[_index].duration * 15/100
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
}