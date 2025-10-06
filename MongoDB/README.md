# MongoDB `mongosh` Full Example

This file contains **ready-to-run Mongo shell (`mongosh`) commands** including sample data, logical operations, aggregation pipelines, and expected outputs. Copy and paste directly into `mongosh`.

```javascript
// Switch to test database
use test;

// Clean previous collection if exists
db.products.drop();

// Insert sample data
db.products.insertMany([
  { "_id": 1, "name": "Laptop", "category": "Electronics", "price": 1200, "stock": 50 },
  { "_id": 2, "name": "Headphones", "category": "Electronics", "price": 100, "stock": 200 },
  { "_id": 3, "name": "Coffee Maker", "category": "Home Appliances", "price": 80, "stock": 30 },
  { "_id": 4, "name": "Sofa", "category": "Furniture", "price": 500, "stock": 10 },
  { "_id": 5, "name": "Desk Lamp", "category": "Furniture", "price": 40, "stock": 100 }
]);

// Logical Queries
db.products.find({ $and: [ { price: { $gte: 100 } }, { stock: { $gte: 50 } } ] }).pretty();
// Output:
// { "_id" : 1, "name" : "Laptop", "category" : "Electronics", "price" : 1200, "stock" : 50 }
// { "_id" : 2, "name" : "Headphones", "category" : "Electronics", "price" : 100, "stock" : 200 }

db.products.find({ $or: [ { category: "Furniture" }, { price: { $lte: 100 } } ] }).pretty();
// Output:
// { "_id" : 2, "name" : "Headphones", "category" : "Electronics", "price" : 100, "stock" : 200 }
// { "_id" : 3, "name" : "Coffee Maker", "category" : "Home Appliances", "price" : 80, "stock" : 30 }
// { "_id" : 4, "name" : "Sofa", "category" : "Furniture", "price" : 500, "stock" : 10 }
// { "_id" : 5, "name" : "Desk Lamp", "category" : "Furniture", "price" : 40, "stock" : 100 }

db.products.find({ stock: { $not: { $gte: 50 } } }).pretty();
// Output:
// { "_id" : 3, "name" : "Coffee Maker", "category" : "Home Appliances", "price" : 80, "stock" : 30 }
// { "_id" : 4, "name" : "Sofa", "category" : "Furniture", "price" : 500, "stock" : 10 }

db.products.find({ $nor: [ { category: "Electronics" }, { price: { $lt: 50 } } ] }).pretty();
// Output:
// { "_id" : 3, "name" : "Coffee Maker", "category" : "Home Appliances", "price" : 80, "stock" : 30 }
// { "_id" : 4, "name" : "Sofa", "category" : "Furniture", "price" : 500, "stock" : 10 }

// Aggregation Pipelines
db.products.aggregate([
  { $group: { _id: "$category", totalStock: { $sum: "$stock" }, averagePrice: { $avg: "$price" } } }
]);
// Output:
// { "_id" : "Electronics", "totalStock" : 250, "averagePrice" : 650 }
// { "_id" : "Home Appliances", "totalStock" : 30, "averagePrice" : 80 }
// { "_id" : "Furniture", "totalStock" : 110, "averagePrice" : 270 }

db.products.aggregate([
  { $match: { price: { $gte: 100 } } },
  { $group: { _id: "$category", expensiveCount: { $sum: 1 } } }
]);
// Output:
// { "_id" : "Electronics", "expensiveCount" : 2 }
// { "_id" : "Furniture", "expensiveCount" : 1 }

db.products.aggregate([
  { $project: { name: 1, category: 1, stock: 1, price: 1, value: { $multiply: ["$price", "$stock"] } } }
]);
// Output:
// { "_id" : 1, "name" : "Laptop", "category" : "Electronics", "stock" : 50, "price" : 1200, "value" : 60000 }
// { "_id" : 2, "name" : "Headphones", "category" : "Electronics", "stock" : 200, "price" : 100, "value" : 20000 }
// { "_id" : 3, "name" : "Coffee Maker", "category" : "Home Appliances", "stock" : 30, "price" : 80, "value" : 2400 }
// { "_id" : 4, "name" : "Sofa", "category" : "Furniture", "stock" : 10, "price" : 500, "value" : 5000 }
// { "_id" : 5, "name" : "Desk Lamp", "category" : "Furniture", "stock" : 100, "price" : 40, "value" : 4000 }

db.products.aggregate([
  { $project: { name: 1, value: { $multiply: ["$price", "$stock"] } } },
  { $sort: { value: -1 } },
  { $limit: 3 }
]);
// Output:
// { "_id" : 1, "name" : "Laptop", "value" : 60000 }
// { "_id" : 2, "name" : "Headphones", "value" : 20000 }
// { "_id" : 4, "name" : "Sofa", "value" : 5000 }
