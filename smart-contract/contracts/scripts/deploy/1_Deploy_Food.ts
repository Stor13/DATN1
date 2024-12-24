import fs from "fs";
import { ethers } from "hardhat";

async function deployContract() {
  let foodContract: any;
  // const usdc = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

  try {
    foodContract = await ethers.deployContract("RestaurantManagement");
    await foodContract.waitForDeployment();

    console.log("Contracts deployed successfully.");

    return foodContract;
  } catch (error) {
    console.error("Error deploying contracts:", error);

    throw error;
  }
}

async function saveContractAddress(foodContract: any) {
  try {
    const address = JSON.stringify(
      {
        foodContract: foodContract.target,
      },
      null,
      4
    );

    fs.writeFile(
      "./scripts/deploy/Address_CERToken.json",
      address,
      "utf8",
      (error) => {
        if (error) {
          console.error("Error saving contract address:", error);
        } else {
          console.log("Deployed contract address:", address);
        }
      }
    );
  } catch (error) {
    console.error("Error saving contract address:", error);

    throw error;
  }
}

async function main() {
  let contract;

  try {
    contract = await deployContract();

    await saveContractAddress(contract);

    console.log("Contract deployment completed successfully.");
  } catch (error) {
    console.error("Unhandled error:", error);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exitCode = 1;
});
