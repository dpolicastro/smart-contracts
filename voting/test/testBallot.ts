import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

async function makeContract(): Promise<Contract> {
  const Ballot: ContractFactory = await ethers.getContractFactory("Ballot");

  const proposals = [
    ethers.utils.formatBytes32String("Subject One"),
    ethers.utils.formatBytes32String("Subject Two")
  ]
  const contract = await Ballot.deploy(proposals);
  return contract.deployed();
}

async function makeERC20Contract(): Promise<Contract> {
  const ERC20Mintable: ContractFactory = await ethers.getContractFactory("ERC20Mintable");

  const TOKEN_SYMBOL = "VT";
  const TOKEN_NAME = "Voting";

  const contract = await ERC20Mintable.deploy(TOKEN_SYMBOL, TOKEN_NAME);
  return contract.deployed();
}

async function makeConnectedContract(account: Signer): Promise<Contract> {
  const contract = await makeContract()
  return contract.connect(account)
}

describe("Ballot", function () {
  let accounts: Signer[];
  let contract: Contract;
  let ownerAddress: String;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    ownerAddress = await accounts[0].getAddress();
    contract = await makeContract()
  });

  describe("Deployment", () => {

    it("Should deploy and set Proposals correctly", async function () {
      const proposals = [
        ethers.utils.formatBytes32String("Subject One"),
        ethers.utils.formatBytes32String("Subject Two")
      ]
      const contractProposal = await contract.proposals(0)

      expect(contractProposal.name).to.equal(proposals[0]);
    });

    it("Should set contract deployer as chairperson", async function () {
      const chairperson = await contract.chairperson()
      const deployer = await accounts[0].getAddress()

      expect(chairperson).to.equal(deployer);
    });

    it("Should set contract owner as chairperson", async function () {
      const chairperson = await contract.chairperson()
      const owner = await accounts[0].getAddress()

      expect(chairperson).to.equal(owner);
    });

    it("Should give chairperson a vote", async function () {
      const ownerAddress = await accounts[0].getAddress()
      const voter = await contract.voters(ownerAddress)

      expect(voter.weight).to.equal(1);
    });

    it("Should mint 3 tokens for owner on deploy", async function () {
      const ownerAddress = await accounts[0].getAddress()
      const balance = await contract.balanceOf(ownerAddress)

      expect(balance).to.equal(3);
    });
  })

  describe("giveRightToVote", () => {
    it("Should allow chairperson to give right to vote", async function () {
      const contract = await makeConnectedContract(accounts[0])
      const targetAddress = await accounts[1].getAddress()

      const result = await contract.giveRightToVote(targetAddress)
      const balance = await contract.balanceOf(targetAddress)

      expect(balance).to.equal(1);
    });

    it("Shouldn't allow chairperson to give right to vote if voter has a vote", async function () {
      const contract = await makeConnectedContract(accounts[0])
      const targetAddress = await accounts[1].getAddress()

      let result = await contract.giveRightToVote(targetAddress)
      result = contract.giveRightToVote(targetAddress)

      await expect(result).to.be.revertedWith("Voter didn't vote yet.");
    });
  })

});
