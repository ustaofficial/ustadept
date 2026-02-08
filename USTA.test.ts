import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("USTA (fixed supply)", function () {
  const MAX_SUPPLY = 100_000_000_000n * 10n ** 18n;

  it("mints MAX_SUPPLY once to the initial recipient", async function () {
    const [deployer] = await ethers.getSigners();
    const recipient = deployer.address;

    const token = await ethers.deployContract("USTA", [recipient]);
    await token.waitForDeployment();

    expect(await token.name()).to.equal("USTA");
    expect(await token.symbol()).to.equal("USTA");
    expect(await token.decimals()).to.equal(18n);

    expect(await token.totalSupply()).to.equal(MAX_SUPPLY);
    expect(await token.balanceOf(recipient)).to.equal(MAX_SUPPLY);
  });

  it("reverts when initial recipient is the zero address", async function () {
    // Custom error decoding için bir instance interface’i kullanıyoruz
    const [deployer] = await ethers.getSigners();
    const ok = await ethers.deployContract("USTA", [deployer.address]);
    await ok.waitForDeployment();

    await expect(ethers.deployContract("USTA", [ethers.ZeroAddress]))
      .to.be.revertedWithCustomError(ok, "ZeroAddress");
  });
});
