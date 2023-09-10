// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "hardhat/console.sol";

contract vault is Ownable,AccessControl,ReentrancyGuard {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    uint256 public fee;
    address public feeWallet ;
    IUniswapV2Router02 public uniswapRouter;

    mapping(uint256 => bool) public taskStatus;
    mapping(uint256 => uint256) public taskProgress;

    constructor(
        address _routerAddress,
        uint256 _fee
    ){
        require(_fee < 10000,"_fee < 100000");
        fee = _fee;
        feeWallet = msg.sender;
        uniswapRouter = IUniswapV2Router02(_routerAddress);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyAdminOrModerator() {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(MODERATOR_ROLE, msg.sender),
            "Caller is not an admin or moderator"
        );
        _;
    }

    function addAdmin(address account) public onlyAdmin {
        grantRole(ADMIN_ROLE, account);
    }

    function addModerator(address account) public onlyAdmin {
        grantRole(MODERATOR_ROLE, account);
    }

    function removeAdmin(address account) public onlyAdmin {
        revokeRole(ADMIN_ROLE, account);
    }

    function removeModerator(address account) public onlyAdmin {
        revokeRole(MODERATOR_ROLE, account);
    }

    /**
     * @notice Execute scheduled investment
     * @dev This function is used to perform scheduled investments across different chains,
     * including signature validation, permission confirmation, and handling transfers.
     * @param intender The initiator of the intention, combined with internal verification for rights.
     * @param toChainId The chainId of the target chain.
     * @param recipient The user's address on the target chain where assets are received.
     * @param tokenIn The address of the token to be sold in the scheduled investment (source chain address, such as DAI on Polygon).
     * @param tokenOut The address of the token to be purchased in the scheduled investment (source chain address, such as WETH on Polygon).
     * @param amount The maximum amount for each scheduled investment.
     * @param num The total number of scheduled investment times.
     * @param feeRate The upper limit of the fee rate, e.g., 30/10000 = 0.3%.
     * @param expiration The expiration time, e.g., 1 hour for a 1-hour scheduled investment (the signature will expire after 1 hour).
     * @param taskId The task ID, a unique ID for this intention.
     * @param signatureHash The signature.
     */
    function executed(
        address intender,         
		uint256 toChainId,         
		address recipient,        
        address tokenIn,           
	    address tokenOut,         
		uint256 amount,           
		uint256 num,             
		uint256 feeRate,          
		uint256 expiration,        
        uint256 taskId,           
		bytes memory signatureHash 
    ) public onlyAdminOrModerator nonReentrant {

        // step 0 todo
        // checkSignAndIntender
        
        require( !taskStatus[taskId], "task has been completed ");
        require( taskProgress[taskId] == num, "The number of tasks has been used");
        require(
            IERC20(tokenIn).allowance(intender, address(this)) >= amount,
             "Not enough allowance"
        );
        require( block.timestamp < expiration, "has timed out");
        require(feeRate > fee , "The handling fee does not meet user requirements");

        taskProgress[taskId] += 1; 
        if (taskProgress[taskId] == num){ 
            taskStatus[taskId] = true;
        }

        transferTokensToContract(tokenIn,amount,intender);

        uint256 amountFee = amount * fee / 10000;
        uint256 amountEnd = amount - amountFee;

        swapTokens(tokenIn,tokenOut,amountEnd,0);

        IERC20(tokenIn).transfer(feeWallet,amountFee);
        
        // bridge
    }

    function swapTokens(
        address _tokenIn,
        address _tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) internal {
        IERC20 tokenIn = IERC20(_tokenIn);
        IERC20 tokenOut = IERC20(_tokenOut);
        tokenIn.approve(address(uniswapRouter), amountIn);
        
        uniswapRouter.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            getPathForTokenSwap(address(tokenIn),address(tokenOut)),
            address(this),
            block.timestamp
        ); 
    }

    function transferTokensToContract(address token,uint256 amount,address intender) internal {
        require(
            IERC20(token).transferFrom(intender, address(this), amount),
            "token transfer Error"
        );
    }

    function getPathForTokenSwap(address tokenIn, address tokenOut) internal pure returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        return path;
    }
}