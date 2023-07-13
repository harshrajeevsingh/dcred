// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Dcred is ERC721URIStorage {
    address private owner;
    uint internal prodId = 0;
    uint[] private initialdata;
    uint[] private initialbought;
    uint[] private initCB;
    uint[] private initSM;
    mapping(address => uint[]) internal mylisted;
    mapping(address => uint[]) internal cashbackList;
    mapping(address => uint[]) internal spendList;
    mapping(address => uint[]) internal mybought;
    string private uri;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(address => uint) internal start;
    mapping(address => uint) internal end;

    constructor() ERC721("DCRED", "DCR") {
        owner = msg.sender;
    }

    struct Product {
        uint id;
        address ownerAddr;
        string pname;
        string desc;
        uint price;
    }

    Product[] internal products;

    function mint(address _customerAddr) external {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        start[msg.sender] = block.timestamp;
        end[msg.sender] = block.timestamp + 1 * 365 * 24 * 60 * 60;
        _safeMint(_customerAddr, tokenId);
        _setTokenURI(tokenId, uri);
    }

    modifier timeIsOver() {
        require(block.timestamp <= end[msg.sender], "Time is up");
        _;
    }

    function setUri(string memory _uri) external onlyOwner {
        uri = _uri;
    }

    function getURIs() external view returns (string memory) {
        return uri;
    }

    function addProduct(
        string memory _name,
        string memory _desc,
        uint _amt
    ) external returns (uint) {
        products.push(Product(prodId, msg.sender, _name, _desc, _amt));
        uint[] memory initial;

        initialdata = mylisted[msg.sender];

        initialdata.push(prodId);
        mylisted[msg.sender] = initialdata;
        initialdata = initial;
        prodId++;
        return prodId - 1;
    }

    function getMyListedProducts(
        address _myadd
    ) external view returns (uint[] memory) {
        return mylisted[_myadd];
    }

    function getAllProducts() external view returns (Product[] memory) {
        return products;
    }

    function buyProduct(uint _prodId) external payable timeIsOver {
        require(products[_prodId].price == msg.value, "Pay the right amount");

        uint remainingEarning = msg.value - ((msg.value * 10) / 100);
        (bool callSuccess, ) = payable(products[_prodId].ownerAddr).call{
            value: remainingEarning
        }("");
        require(callSuccess, "Transfer Failed");

        uint[] memory initialSM;
        initSM = spendList[msg.sender];
        initSM.push(msg.value);
        spendList[msg.sender] = initSM;
        initSM = initialSM;

        //added cashback

        uint cashback = (products[_prodId].price * 5) / 100;
        (bool callSuccess2, ) = payable(msg.sender).call{value: cashback}("");
        require(callSuccess2, "Transfer Failed");

        uint[] memory initialCB;
        initCB = cashbackList[msg.sender];
        initCB.push(cashback);
        cashbackList[msg.sender] = initCB;
        initCB = initialCB;

        uint[] memory initial;
        initialbought = mybought[msg.sender];
        initialbought.push(_prodId);
        mybought[msg.sender] = initialbought;
        initialbought = initial;
    }

    function getMyBoughtList(
        address _addr
    ) external view returns (uint[] memory) {
        return mybought[_addr];
    }

    function getCashbackList(
        address _addr
    ) external view returns (uint[] memory) {
        return cashbackList[_addr];
    }

    function getSpendList(address _addr) external view returns (uint[] memory) {
        return spendList[_addr];
    }

    function withdrawEarnings() external onlyOwner {
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can withdraw");
        _;
    }
}
