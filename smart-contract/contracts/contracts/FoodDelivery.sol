// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract RestaurantManagement is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Biến fee và owner address
    uint256 public platformFee = 5; // 5% fee
    address payable public owner;

    struct Category {
        string name;
        string description;
        string imageUrl;
        bool isActive;
    }

    struct Food {
        string name;
        string description;
        uint256 price;
        bool isAvailable;
        string imageUrl;
        uint256 categoryId;
    }

    struct Order {
        uint256 orderId;
        address customer;
        uint256[] foodIds; // Danh sách món ăn
        string[] foodNames;
        uint256[] quantities; // Số lượng tương ứng
        uint256 totalAmount; // Tổng tiền
        uint256 timestamp;
        OrderStatus status;
    }

    enum OrderStatus {
        Pending, // Đơn hàng mới đặt
        Confirmed, // Đã xác nhận
        Completed, // Hoàn thành
        Cancelled // Đã hủy
    }

    // Mappings
    mapping(uint256 => Category) public categories;
    mapping(uint256 => Food) public foods;
    mapping(uint256 => uint256[]) public categoryFoods;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public customerOrders;

    // Counters
    uint256 public categoryCounter;
    uint256 public foodCounter;
    uint256 public orderCounter;

    // Events
    event CategoryAdded(
        uint256 indexed categoryId,
        string name,
        string imageUrl
    );
    event CategoryUpdated(
        uint256 indexed categoryId,
        string name,
        string imageUrl,
        bool isActive
    );
    event FoodAdded(
        uint256 indexed foodId,
        string name,
        uint256 categoryId,
        uint256 price
    );
    event FoodUpdated(
        uint256 indexed foodId,
        string name,
        uint256 price,
        bool isAvailable
    );
    event PriceUpdated(uint256 indexed foodId, uint256 newPrice);
    event OrderCreated(
        uint256 indexed orderId,
        address indexed customer,
        uint256 totalAmount
    );
    event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);
    event PlatformFeeUpdated(uint256 newFee);
    event PaymentReceived(
        address indexed customer,
        uint256 amount,
        uint256 fee
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        owner = payable(msg.sender);
    }

    // Category Management Functions
    function addCategory(
        string memory _name,
        string memory _description,
        string memory _imageUrl
    ) external onlyRole(ADMIN_ROLE) {
        categoryCounter++;
        categories[categoryCounter] = Category({
            name: _name,
            description: _description,
            imageUrl: _imageUrl,
            isActive: true
        });

        emit CategoryAdded(categoryCounter, _name, _imageUrl);
    }

    function updateCategory(
        uint256 _categoryId,
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        bool _isActive
    ) external onlyRole(ADMIN_ROLE) {
        require(_categoryId <= categoryCounter, "Category does not exist");

        Category storage category = categories[_categoryId];
        category.name = _name;
        category.description = _description;
        category.imageUrl = _imageUrl;
        category.isActive = _isActive;

        emit CategoryUpdated(_categoryId, _name, _imageUrl, _isActive);
    }

    // Food Management Functions
    function addFood(
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _imageUrl,
        uint256 _categoryId
    ) external onlyRole(ADMIN_ROLE) {
        require(_categoryId <= categoryCounter, "Category does not exist");
        require(categories[_categoryId].isActive, "Category is not active");

        foodCounter++;
        foods[foodCounter] = Food({
            name: _name,
            description: _description,
            price: _price,
            isAvailable: true,
            imageUrl: _imageUrl,
            categoryId: _categoryId
        });

        categoryFoods[_categoryId].push(foodCounter);

        emit FoodAdded(foodCounter, _name, _categoryId, _price);
    }

    function updateFood(
        uint256 _foodId,
        string memory _name,
        string memory _description,
        uint256 _price,
        bool _isAvailable,
        string memory _imageUrl
    ) external onlyRole(ADMIN_ROLE) {
        require(_foodId <= foodCounter, "Food does not exist");

        Food storage food = foods[_foodId];
        food.name = _name;
        food.description = _description;
        food.price = _price;
        food.isAvailable = _isAvailable;
        food.imageUrl = _imageUrl;

        emit FoodUpdated(_foodId, _name, _price, _isAvailable);
    }

    function updateFoodPrice(
        uint256 _foodId,
        uint256 _newPrice
    ) external onlyRole(ADMIN_ROLE) {
        require(_foodId <= foodCounter, "Food does not exist");

        foods[_foodId].price = _newPrice;
        emit PriceUpdated(_foodId, _newPrice);
    }

    function toggleFoodAvailability(
        uint256 _foodId
    ) external onlyRole(ADMIN_ROLE) {
        require(_foodId <= foodCounter, "Food does not exist");

        foods[_foodId].isAvailable = !foods[_foodId].isAvailable;
        emit FoodUpdated(
            _foodId,
            foods[_foodId].name,
            foods[_foodId].price,
            foods[_foodId].isAvailable
        );
    }

    // Order Functions
    function createOrder(
        uint256[] memory _foodIds,
        uint256[] memory _quantities
    ) external payable nonReentrant {
        require(_foodIds.length > 0, "No items in order");
        require(
            _foodIds.length == _quantities.length,
            "Arrays length mismatch"
        );

        uint256 totalAmount = 0;
        string[] memory foodNames = new string[](_foodIds.length);

        // Calculate total and get food names
        for (uint256 i = 0; i < _foodIds.length; i++) {
            require(_foodIds[i] <= foodCounter, "Food does not exist");
            Food storage food = foods[_foodIds[i]];
            require(food.isAvailable, "Food not available");

            totalAmount += food.price * _quantities[i];
            foodNames[i] = food.name;
        }

        uint256 feeAmount = (totalAmount * platformFee) / 100;
        uint256 finalAmount = totalAmount + feeAmount;

        require(msg.value >= finalAmount, "Insufficient payment");

        orderCounter++;
        orders[orderCounter] = Order({
            orderId: orderCounter,
            customer: msg.sender,
            foodIds: _foodIds,
            foodNames: foodNames,
            quantities: _quantities,
            totalAmount: totalAmount,
            timestamp: block.timestamp,
            status: OrderStatus.Pending
        });

        customerOrders[msg.sender].push(orderCounter);
        emit OrderCreated(orderCounter, msg.sender, totalAmount);
    }

    function confirmOrder(uint256 _orderId) external onlyRole(ADMIN_ROLE) {
        require(_orderId <= orderCounter, "Order does not exist");
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Pending, "Invalid order status");

        owner.transfer(order.totalAmount);
        // Fee (feeAmount) vẫn nằm trong contract và có thể rút sau bằng withdrawFees()

        order.status = OrderStatus.Confirmed;
        emit OrderStatusUpdated(_orderId, OrderStatus.Confirmed);
        emit PaymentReceived(
            order.customer,
            order.totalAmount,
            (order.totalAmount * platformFee) / 100
        );
    }

    function completeOrder(uint256 _orderId) external onlyRole(ADMIN_ROLE) {
        require(_orderId <= orderCounter, "Order does not exist");
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Confirmed, "Order not confirmed");

        order.status = OrderStatus.Completed;
        emit OrderStatusUpdated(_orderId, OrderStatus.Completed);
    }

    function cancelOrder(uint256 _orderId) external {
        require(_orderId <= orderCounter, "Order does not exist");
        Order storage order = orders[_orderId];

        require(
            order.status == OrderStatus.Pending &&
                (order.customer == msg.sender ||
                    hasRole(ADMIN_ROLE, msg.sender)),
            "Cannot cancel order"
        );

        // Hoàn toàn bộ số tiền (bao gồm cả fee) cho khách
        uint256 refundAmount = order.totalAmount +
            (order.totalAmount * platformFee) /
            100;
        payable(order.customer).transfer(refundAmount);

        order.status = OrderStatus.Cancelled;
        emit OrderStatusUpdated(_orderId, OrderStatus.Cancelled);
    }

    // Admin Functions
    function setPlatformFee(uint256 _newFee) external onlyRole(ADMIN_ROLE) {
        require(_newFee <= 20, "Fee too high"); // Max 20%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    function withdrawFees() external onlyRole(ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        owner.transfer(balance);
    }

    // View Functions
    function getAllCategories() external view returns (Category[] memory) {
        Category[] memory allCategories = new Category[](categoryCounter);

        for (uint256 i = 1; i <= categoryCounter; i++) {
            allCategories[i - 1] = categories[i];
        }

        return allCategories;
    }

    function getActiveCategories() external view returns (Category[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= categoryCounter; i++) {
            if (categories[i].isActive) {
                activeCount++;
            }
        }

        Category[] memory activeCategories = new Category[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= categoryCounter; i++) {
            if (categories[i].isActive) {
                activeCategories[currentIndex] = categories[i];
                currentIndex++;
            }
        }

        return activeCategories;
    }

    function getCategory(
        uint256 _categoryId
    ) external view returns (Category memory) {
        require(_categoryId <= categoryCounter, "Category does not exist");
        return categories[_categoryId];
    }

    function getFood(uint256 _foodId) external view returns (Food memory) {
        require(_foodId <= foodCounter, "Food does not exist");
        return foods[_foodId];
    }

    function getFoodsByCategory(
        uint256 _categoryId
    ) external view returns (Food[] memory) {
        require(_categoryId <= categoryCounter, "Category does not exist");

        uint256[] memory foodIds = categoryFoods[_categoryId];
        Food[] memory categoryFoodsList = new Food[](foodIds.length);

        for (uint256 i = 0; i < foodIds.length; i++) {
            categoryFoodsList[i] = foods[foodIds[i]];
        }

        return categoryFoodsList;
    }

    function getCategoryFoodCount(
        uint256 _categoryId
    ) external view returns (uint256) {
        require(_categoryId <= categoryCounter, "Category does not exist");
        return categoryFoods[_categoryId].length;
    }

    function getOrder(uint256 _orderId) external view returns (Order memory) {
        require(_orderId <= orderCounter, "Order does not exist");
        return orders[_orderId];
    }

    function getCustomerOrders(
        address _customer
    ) external view returns (Order[] memory) {
        uint256[] memory orderIds = customerOrders[_customer];
        Order[] memory customerOrdersList = new Order[](orderIds.length);

        for (uint256 i = 0; i < orderIds.length; i++) {
            customerOrdersList[i] = orders[orderIds[i]];
        }

        return customerOrdersList;
    }

    function getPendingOrders() external view returns (Order[] memory) {
        uint256 pendingCount = 0;
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (orders[i].status == OrderStatus.Pending) {
                pendingCount++;
            }
        }

        Order[] memory pendingOrders = new Order[](pendingCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= orderCounter; i++) {
            if (orders[i].status == OrderStatus.Pending) {
                pendingOrders[currentIndex] = orders[i];
                currentIndex++;
            }
        }

        return pendingOrders;
    }
}
