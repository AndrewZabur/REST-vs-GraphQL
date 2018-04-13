const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mc = require('./dbConnection.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
/* Starting our server with port 3000 */
app.listen(3000, function () {
    console.log('Connected to the server with port 3000!!!');
});

/* Default route with / url */
app.get('/', function (request, response) {
    return response.send({ message: 'Connected to the server with port 3000!!!' });
});

/* Get buses app */
app.get('/buses', function (request, response) {
    mc.query('SELECT * FROM bus;', function (error, results, fields) {
        if (error) throw error;
        return response.send({ Buses: results });
    });
});

app.get('/buses/:id', function(request, response){
    let id = request.params.id;
    if(!isFinite(id)) {
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    }
    mc.query('SELECT busId FROM bus WHERE busId = ?', [id], function(error, results, fields){
        if(Object.keys(results).length == 0){
            return response.sendStatus(404);
        }
        mc.query('SELECT * FROM bus WHERE busId = ?', [id] , function(error, results, fields){
            if(error) throw error;
            return response.send({ Bus: results});
        });
     });
});

/* Post bus app */
app.post('/buses', function(request, response){
    let newBus = request.body;
    if (Object.keys(newBus).length < 5) {
        return response.status(400).send({ error: true, message: 'Please provide information about bus in json format.' });
    }
    mc.query('INSERT INTO bus SET ? ', newBus , function (error, results, fields) {
        if (error) throw error;
        return response.sendStatus(200);
    });
});

/* Put bus app */
app.put('/buses/:id', function(request, response){
    let id = request.params.id;
    let updateBus = request.body; 
    if(!isFinite(id)){
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    }
    if(Object.keys(updateBus).length < 5){
        return response.status(400).send({ error: true, message: 'Please provide information about bus in json format.' });
    }
    mc.query('SELECT busId FROM bus WHERE busId = ?', [id], function(error, results, fields){
        if(Object.keys(results).length == 0){
            return response.status(404).send({error: 'Not Found', message: 'There is no bus with id = ' + id});
        }
        mc.query('UPDATE bus SET ? WHERE busId = ?', [updateBus, id] , function(error, results, fields){
            if(error) throw error;
            return response.sendStatus(200);
        });
    });      
});

/* Patch specific bus */
app.patch('/buses/:id', function(request, response){
    let id = request.params.id;
    let updateBus = request.body; 
    if(!isFinite(id)){
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    }
    if(Object.keys(updateBus).length < 1){
        return response.status(400).send({ error: true, message: 'Please provide information about bus in json format.' });
    }
    mc.query('SELECT busId FROM bus WHERE busId = ?', [id], function(error, results, fields){
        if(Object.keys(results).length == 0){
            return response.status(404).send({error: 'Not Found', message: 'There is no bus with id = ' + id});
        }
        mc.query('UPDATE bus SET ? WHERE busId = ?', [updateBus, id] , function(error, results, fields){
            if(error) throw error;
            return response.sendStatus(200);
        });
    });
});

app.patch('/buses', function(request, response){
    return response.sendStatus(400);
});

/* Delete bus app */
app.delete('/buses/:id', function(request, response){
    let id = request.params.id;   
    if(!isFinite(id)) {
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    } 
    mc.query('SELECT busId FROM bus WHERE busId = ?', [id], function(error, results, fields){
         if(Object.keys(results).length == 0){
             return response.sendStatus(404);
         }
         mc.query('DELETE FROM bus WHERE busId = ?', [id], function (error, results, fields) {
            if (error) throw error;
            return response.sendStatus(200);
        });
    });  
});

app.delete('/buses', function(request, response){
    return response.sendStatus(400);
});

/* Get garages app */
app.get('/garages', function (request, response) {
    mc.query('SELECT * FROM garage', function (error, results, fields) {
        if (error) throw error;
        return response.send({ Garages: results });
    });
});

app.get('/garages/:id', function(request, response){
    let id = request.params.id;
    if(!isFinite(id)){
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    }
    mc.query('SELECT garageId FROM garage WHERE garageId = ?', [id], function(error, results, fields){
        if(Object.keys(results).length == 0){
            return response.sendStatus(404);
        }
        mc.query('SELECT * FROM garage WHERE garageId = ?', [id] , function(error, results, fields){
            if(error) throw error;
            return response.send({ Garage: results});
        });
    });
});

/* Post garage */
app.post('/garages', function(request, response){
    let newGarage = request.body;
    if (Object.keys(newGarage).length < 2) {
        return response.status(400).send({ error: true, message: 'Please provide information about bus in json format.' });
    }
    mc.query('INSERT INTO garage SET ? ', newGarage , function (error, results, fields) {
        if (error) throw error;
        return response.sendStatus(200);
    });
});

/* Put garage */
app.put('/garages/:id', function(request, response){
    let id = request.params.id;
    let updateGarage = request.body; 
    if(!isFinite(id)){
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    }
    if(Object.keys(updateGarage).length < 2){
        return response.status(400).send({ error: true, message: 'Please provide information about garage in json format.' });
    }
    mc.query('SELECT garageId FROM garage WHERE garageId = ?', [id], function(error, results, fields){
        if(Object.keys(results).length == 0){
            return response.status(404).send({error: 'Not Found', message: 'There is no garage with id = ' + id});
        }
        mc.query('UPDATE garage SET ? WHERE garageId = ?', [updateGarage, id] , function(error, results, fields){
            if(error) throw error;
            return response.sendStatus(200);
        });
    });      
});

/* Patch garage */
app.patch('/garages/:id', function(request, response){
    let id = request.params.id;
    let updateGarage = request.body; 
    if(!isFinite(id)){
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    }
    if(Object.keys(updateGarage).length < 1){
        return response.status(400).send({ error: true, message: 'Please provide information about garage in json format.' });
    }
    mc.query('SELECT garageId FROM garage WHERE garageId = ?', [id], function(error, results, fields){
        if(Object.keys(results).length == 0){
            return response.status(404).send({error: 'Not Found', message: 'There is no garage with id = ' + id});
        }
        mc.query('UPDATE garage SET ? WHERE garageId = ?', [updateGarage, id] , function(error, results, fields){
            if(error) throw error;
            return response.sendStatus(200);
        });
    });
});

/* Delete garage app */
app.delete('/garages/:id', function(request, response){
    let id = request.params.id;   
    if(!isFinite(id)) {
        return response.status(400).send({ error: 'Incorrect id!', message: 'Id must contain only numbers!' });
    } 
    mc.query('SELECT garageId FROM garage WHERE garageId = ?', [id], function(error, results, fields){
         if(Object.keys(results).length == 0){
             return response.sendStatus(404);
         }
         mc.query('DELETE FROM garage WHERE garageId = ?', [id], function (error, results, fields) {
            if (error) throw error;
            return response.sendStatus(200);
        });
    });  
});

app.delete('/garages', function(request, response){
    return response.sendStatus(400);
});