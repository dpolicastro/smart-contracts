import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

const TOKEN_SYMBOL = "DONES";
const TOKEN_NAME = "DONES";

async function makeContract(): Promise<Contract> {
  const TokenContract: ContractFactory = await ethers.getContractFactory(
    "ECR20"
  );
  let contract = await TokenContract.deploy(TOKEN_SYMBOL, TOKEN_NAME);
  return contract.deployed();
}

async function makeConnectedContract(account: Signer): Promise<Contract> {
  const contract = await makeContract()
  return contract.connect(account)
}

describe("Token", function () {
  let accounts: Signer[];
  let contract: Contract;
  let ownerAddress: String;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    ownerAddress = await accounts[0].getAddress();
    contract = await makeContract()
  });

  it("Should deploy and set Symbol and Name correctly", async function () {
    expect(await contract.symbol()).to.equal(TOKEN_SYMBOL);
    expect(await contract.name()).to.equal(TOKEN_NAME);
  });

  it("Should have zero balance for the owner when deployed", async function () {
    expect(await contract.balanceOf(ownerAddress)).to.equal(0);
  });

  it("Should deploy with zero TotalSupply", async function () {
    expect(await contract.totalSupply()).to.equal(0);
  });

  it("Should not allow anyone to mint tokens", async function () {
    const contract = await makeConnectedContract(accounts[1])
    await expect(contract.mint(ownerAddress, ethers.utils.parseEther("1"))).to.be.revertedWith("MeuToken: Mensagem de erro");
  });

  it("Should update balance when tokens are minted", async function () {
    await contract.mint(ownerAddress, ethers.utils.parseEther("1"));
    expect(await contract.balanceOf(ownerAddress)).to.equal(ethers.utils.parseEther("1"));
    await contract.mint(ownerAddress, ethers.utils.parseEther("1"));
    expect(await contract.balanceOf(ownerAddress)).to.equal(ethers.utils.parseEther("2"));
  });

  it("Should update TotalSupply when tokens are minted", async function () {
    const tokensToMint = ethers.utils.parseEther("1")
    await contract.mint(ownerAddress, tokensToMint);
    expect(await contract.totalSupply()).to.equal(tokensToMint);
  });

  it("Should not mint to address zero", async function () {
    const contract = await makeConnectedContract(accounts[0])
    await expect(contract.mint(ethers.constants.AddressZero, ethers.utils.parseEther("1"))).to.be.revertedWith("MeuToken: Invalid Address");
  });

  it("Should not allow transfering to address zero", async function () {
    const contract = await makeConnectedContract(accounts[0])
    await expect(contract.transfer(ethers.constants.AddressZero, ethers.utils.parseEther("1"))).to.be.revertedWith("MeuToken: Invalid Address");
  });

  it("Should transfer between different addresses", async function () {
    const contract = await makeConnectedContract(accounts[0])
    await contract.mint(await accounts[0].getAddress(), 50)
    let receiptStatus;
    try {
      const tx = await contract.transfer(await accounts[1].getAddress(), 25)
      const receipt = await tx.wait()
      receiptStatus = receipt.status

    } catch (err) {
      console.log(err)
    }
    expect(receiptStatus).to.equal(1);

  });

  it("Should update both balances after a transfer", async function () {
    const contract = await makeConnectedContract(accounts[0])
    await contract.mint(await accounts[0].getAddress(), 50)
    await contract.transfer(await accounts[1].getAddress(), 50)

    const senderBalance = await contract.balanceOf(accounts[0].getAddress())
    await expect(senderBalance).to.equal(0);
    const receiverBalance = await contract.balanceOf(accounts[1].getAddress())
    await expect(receiverBalance).to.equal(50);
  });

  it("Should not transfer more than balance", async function () {
    const contract = await makeConnectedContract(accounts[0])
    const senderBalance = await accounts[0].getBalance()

    await expect(contract.transfer(await accounts[1].getAddress(), senderBalance.add(1))).to.be.revertedWith("ERC20: transfer amount exceeds balance");

  });

  it("Should have zero allowance from the owner to any other address when deployed", async function () {
    const contract = await makeConnectedContract(accounts[0]);

    const result = await contract.allowance(await accounts[0].getAddress(), await accounts[1].getAddress())
    expect(result).to.equal(ethers.utils.parseEther("0"))

  });

  it("Should update allowance from owner to spender when value approved for spender", async function () {
    const contract = await makeConnectedContract(accounts[0]);
    const approvedAmount = ethers.utils.parseEther("25")

    await contract.approve(await accounts[1].getAddress(), approvedAmount)
    const result = await contract.allowance(await accounts[0].getAddress(), await accounts[1].getAddress())

    expect(result).to.equal(approvedAmount)
  });

  it("Should not allow spender to spend the owners tokens above allowed", async function () {
    const contractSender0 = await makeConnectedContract(accounts[0]);
    const contractSender1 = await makeConnectedContract(accounts[1]);
    const approvedAmount = ethers.utils.parseEther("25")
    const transferAmount = ethers.utils.parseEther("30")

    await contractSender0.approve(await accounts[1].getAddress(), approvedAmount)
    const result = contractSender1.transferFrom(await accounts[0].getAddress(), await accounts[1].getAddress(), transferAmount)

    await expect(result).to.be.revertedWith("ERC20: Amount not allowed.");
  });

  it("Should reduce allowance from the owner to the spender when tokens are spent", async function () {
    expect(false).to.equal(true);
  });
});
