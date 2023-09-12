// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';

contract Ethtent is AccessControl,ReentrancyGuard,EIP712 {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

    bytes32 public constant INTENT_HASH = keccak256("intent(address intender,string destinationChain,\
string recipient,string tokenOutSymbol,address tokenIn,address tokenOut,uint256 amount,\
uint256 num,uint256 feeRate,uint256 expiration,uint256 taskId)");

    struct Intent {
        address intender;         //The initiator of the intention, combined with internal verification for rights.
        string  destinationChain; //The destinationChain of the target chain.       
        string  recipient;        //The user's address on the target chain where assets are received.
        string  tokenOutSymbol;   //tokenOut symbol 
        address tokenIn;          //The address of the token to be sold in the scheduled investment (source chain address, such as DAI on Polygon).
        address tokenOut;         //The address of the token to be purchased in the scheduled investment (source chain address, such as WETH on Polygon).
        uint256 amount;           //The maximum amount for each scheduled investment.
        uint256 num;              //The total number of scheduled investment times.
        uint256 feeRate;          //The upper limit of the fee rate, e.g., 30/10000 = 0.3%.
        uint256 expiration;       //The expiration time, e.g., 1 hour for a 1-hour scheduled investment (the signature will expire after 1 hour).
        uint256 taskId;           //The task ID, a unique ID for this intention.
        bytes   signature;        //The signature.
    }
    
    uint256 public fee;
    address public feeWallet;

    IUniswapV2Router02 public uniswapRouter;
    IAxelarGateway public axelarGateway;

    mapping(uint256 => bool) public taskStatus;
    mapping(uint256 => uint256) public taskProgress;

    event IntentTask(
        address indexed intender,
        uint256 indexed taskId,
        uint256 schedule
    );

    event IntentStatus(
        address indexed intender,
        uint256 indexed taskId,
        bool status
    );

    constructor(
        address _routerAddress,
        uint256 _fee,
        address _axelarGateway
    ) EIP712("Ethtent", "1.0") {
        require(_fee < 10000,"_fee < 100000");
        fee = _fee;
        feeWallet = msg.sender;
        uniswapRouter = IUniswapV2Router02(_routerAddress);
        axelarGateway = IAxelarGateway(_axelarGateway);
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

    function setFee(uint256 _fee) public onlyAdmin {
        fee = _fee;
    }

    function setFeeWallet(address _feeWallet) public onlyAdmin {
        feeWallet = _feeWallet;
    }

    /**
     * @notice Execute scheduled investment
     * @dev This function is used to perform scheduled investments across different chains,
     * including signature validation, permission confirmation, and handling transfers.
     * @param intent the Intent struct
     */
    function executed( Intent memory intent) public onlyAdminOrModerator nonReentrant {
        _executed(intent);
    }

    function executedBatch( Intent[] memory intents) public onlyAdminOrModerator nonReentrant {
        for (uint256 i = 0; i < intents.length; i++) {
            _executed(intents[i]);
        }
    }

    function _executed( Intent memory intent) internal {
        // todo checkSignAndIntender
        // require( recoverV4(intent) == intent.intender,"check sig error");
        require( !taskStatus[intent.taskId], "task has been completed ");
        require( taskProgress[intent.taskId] != intent.num, "The number of tasks has been used");
        require(
            IERC20(intent.tokenIn).allowance(intent.intender, address(this)) >= intent.amount,
             "Not enough allowance"
        );
        require( block.timestamp < intent.expiration, "has timed out");
        require(intent.feeRate >= fee , "The handling fee does not meet user requirements");

        taskProgress[intent.taskId] += 1; 
        if (taskProgress[intent.taskId] == intent.num){ 
            taskStatus[intent.taskId] = true;
            emit IntentStatus(intent.intender,intent.taskId,true);
        }

        transferTokensToContract(intent.tokenIn,intent.amount,intent.intender);
        uint256 amountSwaped = swapTokens(intent.tokenIn,intent.tokenOut,intent.amount,0);

        // bridge
        IERC20(intent.tokenOut).approve(address(axelarGateway),amountSwaped);
        axelarGateway.sendToken(
            intent.destinationChain,
            intent.recipient,
            intent.tokenOutSymbol,
            amountSwaped
        );
        emit IntentTask(intent.intender,intent.taskId,taskProgress[intent.taskId]);
    }

    function swapTokens(
        address _tokenIn,
        address _tokenOut,
        uint256 amount,
        uint256 minAmountOut
    ) internal returns(uint256){
        uint256 amountFee = amount * fee / 10000;
        uint256 amountIn = amount - amountFee;
        IERC20(_tokenIn).approve(address(uniswapRouter), amountIn);
        
        uniswapRouter.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            getPathForTokenSwap(_tokenIn,_tokenOut),
            address(this),
            block.timestamp
        ); 
        IERC20(_tokenIn).transfer(feeWallet,amountFee);
        return IERC20(_tokenOut).balanceOf(address(this));
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

    function recoverV4(
        Intent memory intent
    ) public view returns (address) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
           INTENT_HASH,
           intent.intender,
           intent.destinationChain,
           intent.recipient,
           intent.tokenOutSymbol,
           intent.tokenIn,
           intent.tokenOut,
           intent.amount,
           intent.num,
           intent.feeRate,
           intent.expiration,
           intent.taskId
        )));
        return ECDSA.recover(digest, intent.signature);
    }
}
