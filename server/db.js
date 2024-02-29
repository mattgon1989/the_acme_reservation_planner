const pg = require('pg');
const uuid = require('uuid');
const client = new pg.Client(process.env.BASE_URL || 'postgres://localhost/the_acme_reservation_planner');

async function createTables(){
    const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;

    CREATE TABLE restaurants(
        id UUID PRIMARY KEY,
        name VARCHAR(30) NOT NULL
    );
    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(30) NOT NULL
    );

    CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
    );

    `;
    await client.query(SQL);
}
async function createCustomer(name) {
    const SQL = `
    INSERT INTO customers(id, name)
    VALUES($1, $2)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}


// create restaurant
async function createRestaurant(name){
    const SQL = `
    INSERT INTO restaurants(id, name)
    VALUES($1, $2)
    RETURNING *;
    `;

    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

// create a reservation
async function createReservation(date, customer_id, restaurant_id, party_count) {
    const SQL = `
    INSERT INTO reservations(id, date, customer_id, restaurant_id, party_count)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), date, customer_id, restaurant_id, party_count]);
    return response.rows;
}

// getting users function
async function fetchCustomers() {
 const SQL = `
    SELECT * FROM customers;
 `;
 const response = await client.query(SQL);
 return response.rows;
}
//getting restaurants
async function fetchRestaurants() {
    const SQL = `
    SELECT * FROM restaurants;
    `;
    const response = await client.query(SQL);
    return response.rows;
}
// getting vacations
async function fetchReservation() {
    const SQL = `
    SELECT * FROM reservations;
    `;
    const response = await client.query(SQL);
    return response.rows;
}

//delete vacation
async function destroyReservation(id) {
    const SQL = `
    DELETE FROM reservations
    WHERE id = $1
    `;
    await client.query(SQL, [id]);
}
// making it available to index file
module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservation,
    destroyReservation
}