import { ethers } from "hardhat";
import address from "../deploy/Address_CERToken.json";

async function main() {
    const amount = ethers.parseUnits("0.1",6)
    const sender = '0x60D75D12D44352f15cA40f054e4c7EfC63AD7608'
    const cerTokenContract = await ethers.getContractAt(
        "CERToken",
        address.cerTokenContract
    )
    const usdcContract = await ethers.getContractAt(
        'IERC20',
        "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    )
    const allowance = await usdcContract.allowance(
        sender,
        address.cerTokenContract
    )

    if (allowance < amount) {
        const approveTx = await usdcContract.approve(
            address.cerTokenContract,
            amount
        )

        console.log("Tx :",approveTx.hash);
        await approveTx.wait()
    }

    const tx = await cerTokenContract.swapUSDCForCER(100000);

    await tx.wait();

    console.log("Successfully : ",tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });