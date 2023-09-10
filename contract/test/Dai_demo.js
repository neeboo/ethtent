const { expect } = require("chai");
const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("Dai", function () {
    async function deployOneDai() {
        const [owner, otherAccount] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy();
        console.log("erc20Token addr:",myToken.target)
        return {myToken,owner}
    }
    describe("Deployment", function () {
    it("mint and balanceOf", async function () {
        const { myToken,owner } = await loadFixture(deployOneDai);
        await myToken.mint(1)
        console.log(await myToken.balanceOf(owner))
      });
    });
});