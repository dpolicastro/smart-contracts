// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ECR20 {
    string public symbol;
    string public name;

    address public owner;

    uint256 public _totalSupply;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(string memory _symbol, string memory _name) {
        symbol = _symbol;
        name = _name;
        owner = msg.sender;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address addr) public view returns (uint256 balance) {
        balance = _balances[addr];
    }

    function mint(address account, uint256 amount) public {
        require(account != address(0), "MeuToken: Invalid Address");
        require(msg.sender == owner, "MeuToken: Mensagem de erro");
        _balances[account] += amount;
        _totalSupply += amount;
    }

    function transfer(address recipient, uint256 amount)
        external
        returns (bool)
    {
        require(recipient != address(0), "MeuToken: Invalid Address");
        require(msg.sender != recipient, "MeuToken: Invalid Address");
        require(
            _balances[msg.sender] >= amount,
            "ERC20: transfer amount exceeds balance"
        );

        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        return true;
    }

    function allowance(address _owner, address spender)
        external
        view
        returns (uint256)
    {
        return _allowances[_owner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(msg.sender != address(0), "MeuToken: Invalid Address");
        require(spender != address(0), "MeuToken: Invalid Address");

        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 amount
    ) public returns (bool) {
        require(msg.sender != address(0), "ERC20: Invalid Address");
        require(_from != address(0), "ERC20: Invalid Address");

        uint256 currentAllowance = this.allowance(_from, msg.sender);
        require(amount <= currentAllowance, "ERC20: Amount not allowed.");

        _balances[_from] -= amount;
        _balances[_to] += amount;
        _allowances[_from][msg.sender] -= amount;

        return true;
    }
}
