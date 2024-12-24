import { ethers } from "hardhat";
import address from "../deploy/Address_CERToken.json";

async function main() {
    const cerTokenContract = await ethers.getContractAt(
        "RestaurantManagement",
        address.foodContract
    )

    const tx = await cerTokenContract.addCategory('kem','kem ngon lam');

    await tx.wait();

    console.log("Successfully : ",tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });