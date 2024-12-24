import Abi from "../address/Abi.json";
import address from "../address/contractAddress.json";
import { ethers } from "ethers";
import Web3 from "web3";

let ethereum, tx;

if (typeof window !== "undefined") ethereum = window.ethereum;

// const getEthereumContracts = async () => {
//   const accounts = await ethereum?.request?.({ method: "eth_accounts" });

//   if (accounts?.length > 0) {
//     const provider = new ethers.BrowserProvider(ethereum);
//     const signer = await provider.getSigner();
//     console.log("s1",signer.address)
//     const contracts = new ethers.Contract(
//       address.foodContract,
//       Abi.abi,
//       signer
//     );

//     return contracts;
//   } else {
//     const provider = new ethers.JsonRpcProvider(
//       "https://arb-sepolia.g.alchemy.com/v2/U303U4yuPw2Yz6c9HN16CTeEAtAhp24t"
//     );
//     const wallet = ethers.Wallet.createRandom();
//     const signer = wallet.connect(provider);
//     console.log("s2",signer.address)
//     const contracts = new ethers.Contract(
//       address.foodContract,
//       Abi.abi,
//       signer
//     );

//     return contracts;
//   }
// };

const getEthereumContracts = async () => {
  if (!ethereum) {
    throw new Error("Please install MetaMask");
  }

  try {
    await ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const contracts = new ethers.Contract(
      address.foodContract,
      Abi.abi,
      signer
    );

    return contracts;
  } catch (error) {
    console.error("Error getting contracts:", error);
    throw new Error("Please connect your wallet");
  }
};
// get
const getCategory = async (id) => {
  const contract = await getEthereumContracts();
  const category = await contract.getCategory(id);
  return category;
};

const getActiveCategories = async (id) => {
  const contract = await getEthereumContracts();
  const categories = await contract.getActiveCategories();
  return categories;
};

// set
const addCategory = async (name, description, imageUrl) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getEthereumContracts();

    // Kiểm tra input
    if (!name || !description || !imageUrl) {
      throw new Error("Name, description and image are required");
    }

    console.log("Adding category with:", { name, description, imageUrl });

    // Gọi smart contract
    const tx = await contract.addCategory(name, description, imageUrl, {
      gasLimit: 3000000,
      maxFeePerGas: ethers.parseUnits("5000", "gwei"), // Tăng lên 200 gwei
      maxPriorityFeePerGas: ethers.parseUnits("50", "gwei"), // Tăng lên 2 gwei
    });

    // Đợi transaction được mine
    const receipt = await tx.wait();

    // Log thông tin transaction
    console.log("Transaction receipt:", receipt);

    return receipt;
  } catch (error) {
    console.error("Add category error details:", error);

    if (error.code === 4001) {
      throw new Error("Transaction rejected by user");
    }

    if (error.code === -32603) {
      throw new Error(
        "Internal JSON-RPC error. Please check your wallet connection"
      );
    }

    throw new Error(error.message || "Failed to add category");
  }
};

const addFood = async (name, description, price, imageUrl, categoryId) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getEthereumContracts();

    const priceInWei = ethers.parseEther(price.toString());

    console.log("Adding food with:", {
      name,
      description,
      priceInWei,
      imageUrl,
      categoryId,
    });

    // Kiểm tra input
    if (
      !name ||
      !description ||
      !price ||
      !imageUrl ||
      categoryId === undefined ||
      categoryId === null
    ) {
      throw new Error(
        "Name, description , image , price , categoryId are required"
      );
    }

    // Gọi smart contract
    const tx = await contract.addFood(
      name,
      description,
      priceInWei,
      imageUrl,
      categoryId + 1,
      {
        gasLimit: 3000000,
        maxFeePerGas: ethers.parseUnits("5000", "gwei"), // Tăng lên 200 gwei
        maxPriorityFeePerGas: ethers.parseUnits("50", "gwei"), // Tăng lên 2 gwei
      }
    );

    // Đợi transaction được mine
    const receipt = await tx.wait();

    // Log thông tin transaction
    console.log("Transaction receipt:", receipt);

    return receipt;
  } catch (error) {
    console.error("Add category error details:", error);

    if (error.code === 4001) {
      throw new Error("Transaction rejected by user");
    }

    if (error.code === -32603) {
      throw new Error(
        "Internal JSON-RPC error. Please check your wallet connection"
      );
    }

    throw new Error(error.message || "Failed to add food");
  }
};

// const createOrder = async (foodIds, quantities) => {
//   try {
//     const contract = await getEthereumContracts();

//     let totalAmount = 0n;
//     for (let i = 0; i < foodIds.length; i++) {
//       const food = await contract.foods(foodIds[i]);
//       totalAmount += food.price * BigInt(quantities[i]);
//     }

//     const platformFee = (totalAmount * 5n) / 100n;
//     const finalAmount = totalAmount + platformFee;

//     const tx = await contract.createOrder(foodIds, quantities, {
//       value: finalAmount,
//       gasLimit: 3000000,
//     });

//     return await tx.wait();
//   } catch (error) {
//     console.error("Add category error details:", error);

//     if (error.code === 4001) {
//       throw new Error("Transaction rejected by user");
//     }
//     ß;

//     if (error.code === -32603) {
//       throw new Error(
//         "Internal JSON-RPC error. Please check your wallet connection"
//       );
//     }

//     throw new Error(error.message || "Failed to add food");
//   }
// };

const createOrder = async (foodIds, quantities) => {
  try {
    const contract = await getEthereumContracts();

    // Convert arrays to BigNumber arrays
    const foodIdsBN = foodIds.map((id) => BigInt(id));
    const quantitiesBN = quantities.map((qty) => BigInt(qty));

    let totalAmount = 0n;
    for (let i = 0; i < foodIds.length; i++) {
      const food = await contract.foods(foodIds[i]);
      totalAmount += food.price * BigInt(quantities[i]);
    }

    const tx = await contract.createOrder(foodIdsBN, quantitiesBN, {
      value: totalAmount + (totalAmount * 5n) / 100n, // Add platformFee 5%
      gasLimit: 3000000,
      maxFeePerGas: ethers.parseUnits("10000", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("100", "gwei"),
    });

    return await tx.wait();
  } catch (error) {
    throw error;
  }
};

const getPendingOrders = async (id) => {
  const contract = await getEthereumContracts();
  const orders = await contract.getPendingOrders();
  return orders;
};

export {
  addCategory,
  addFood,
  createOrder,
  getCategory,
  getActiveCategories,
  getPendingOrders,
};
