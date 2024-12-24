import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

export async function completeFixture() {
  // wallet
  const wallets = await ethers.getSigners();
  // Cer
  const CERTokenContract = await ethers.getContractFactory("CERToken");
  const USDCContract = await ethers.getContractFactory("MockERC20");
  // usdc
  const usdcContract = await USDCContract.deploy();
  const cerTokenContract = await CERTokenContract.deploy(usdcContract.target);

  return {
    cerTokenContract,
    usdcContract,
    wallets,
  };
}
