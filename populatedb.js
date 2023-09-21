#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database. Specified database as argument -'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Categories = require("./models/categories");
const Item = require("./models/items");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoriesCreate(index, name, description) {
  const category= new Categories({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemsCreate(index, name, description, category, price, stock) {
  const itemdetail = { name: name, description: description, category: category, price: price, stock: stock };
  
  const item = new Item(itemdetail);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoriesCreate(0, "Electronics"),
    categoriesCreate(1, "Toys"),
    categoriesCreate(2, "Video Game"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemsCreate(0, "iPad Mini", "Apple iPad Min | 7.9-inch Retina", categories[0], 399, 5),
    itemsCreate(1, "Apple Watch SE", "1st Gen | GPS + Cellular | 44mm", categories[0], 159, 4),
    itemsCreate(2, "Beats Solo 2 Wired", "On-Ear Headphone | Wired", categories[0], 69.95, 10),
    itemsCreate(3, "Monopoly Chance Game", "Fast-Paced Monopoly Boardgame",categories[1], 19.82, 15),
    itemsCreate(4, "Classic Jenga Game", "Genuine Hardwood Blocks", categories[1], 15.98, 11),
    itemsCreate(5, "Squishmallows Take4: Grow Your Squad", "Now there's even more to Squish with Squishmallows: Take4, the action-packed family game.", categories[1], 14.82, 9),
    itemsCreate(6, "Nba 2k24 Kobe Bryant Edition", "Video Game for Xbox X | PS5", categories[2], 69, 7),
    itemsCreate(7, "Star Wars Jedi: Survivor", "Video Game for Xbox X | PS5", categories[2], 69, 15),
    itemsCreate(8, "The Legend of Zelda: Tears of the Kingdom", "Video Game for Nintendo Switch", categories[2], 69, 12),
  ]);
}

