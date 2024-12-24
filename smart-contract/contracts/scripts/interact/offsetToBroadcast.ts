import { ethers } from "hardhat";
import address1 from "../deploy/Address_CERToken.json";

async function main() {
    const amount = ethers.parseUnits("0.01",18)
    const broadcastId = "0x3030303030303030363730323434653433316263353337343233626338393433"
    console.log(ethers.keccak256(broadcastId)
  )
    const sender = '0x60D75D12D44352f15cA40f054e4c7EfC63AD7608'
    const cerContract = await ethers.getContractAt(
        "CERToken",
        address1.cerTokenContract
    )  

    const tx = await cerContract.offset(amount,broadcastId);

    await tx.wait();

    console.log("Successfully : ",tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  