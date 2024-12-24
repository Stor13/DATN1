// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICERToken is IERC20 {
    function mint(address to, uint256 amount, bytes32 proofHash) external;
    function burn(uint256 amount) external;
    function swapUSDCForCER(uint256 usdcAmount) external;
    function setPrice(uint256 newPrice) external;
    function pause() external;
    function unpause() external;
}