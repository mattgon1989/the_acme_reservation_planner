const express = require('express');
const app = express();
app.use(express.json());

//will be destructoring it will be able to require more things on 1 line
const {client, createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, createReservation, fetchReservation, destroyReservation } = require('./db');


// get customers
app.get('/api/customers', async (req, res, next) => {
    try{
     res.send(await fetchCustomers());
 } catch(err) {
    next(err);
    }
});

// get restaurants
app.get('/api/restaurants', async (req, res, next) => {
    try {
     res.send(await fetchRestaurants());
} catch(err){
    next(err);
    }
});

//get reservations
app.get('/api/reservations', async (req, res, next) => {
    try {
    res.send(await fetchReservations());
} catch(err) {
    next(err);
    }
});

//create reservation

app.post('/api/customers/:id/reservations', async (req, res, next) => {
    try {
    res.send(await createReservation(req.body.date, req.body.customer_id, req.body.restaurant_id, req.body.party_count));
} catch(err) {
    next(err);
    }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
    try {
    await destroyReservation(req.params.id);
    res.sendStatus(204);
} catch {
    next(err);
    }
   });

async function init() {
    try {
        await client.connect();
        await createTables();
  
// were gabbing id's
    const[isaac, adam, casey, ohgane, tonys, momos, outbackSteaks]= await Promise.all([
        createCustomer('Isaac'),
        createCustomer('adam'),
        createCustomer('casey'),
        createRestaurant('outback steakhouse'),
        createRestaurant('tonys'),
        createRestaurant('momos'),
        createRestaurant('ohgane')
        ]);
        // test
      //  console.log(await fetchCustomers());
      //  console.log(await fetchRestaurants());
        
        //make it a variable
        const [res1,res2, res3] = await Promise.all([
            await createReservation('2012-4-8', isaac.id, tonys.id, 4),
        
            await createReservation('2012-4-6', casey.id, outbackSteaks.id, 7),
            await createReservation('2012-4-23',  adam.id, momos.id, 3)
            
        ]);
        

        //how to destroy/delete vacation
       // await destroyReservation(res1.id);
        
        //test fetch
        console.log(await fetchReservation());
        console.log('connected to database');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`server is listening on port ${PORT}!`);
        });
    } catch(err) {
        console.error(err);
    }
}

init();