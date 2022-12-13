/*
   USER INPUT REQUIRED!
   TYPE YOUR NETWORK IP
   ADDRESS ON LINE 7
*/


const ipAddress = [ '10.11.121.140', '192.168.1.82'];

var express = require("express");
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { 
        //origin: 'https://bjhufstetler.github.io'
        origin: ['http://localhost:3000', `http://${ipAddress[0]}:3000`, `http://${ipAddress[1]}:3000`]
    }
});

const knex = require('knex')(require('./knexfile.js')['development']);

const port = process.env.PORT || 8080;

const cors = require('cors');
app.use(cors());
app.use(express.json())

http.listen(port, () => console.log(`API listening on port ${port}.`));

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('JOIN', (server, team) => {
        socket.join(server)
        socket.join(`${server}_${team}`)
        console.log(server, team)
    });

    socket.on('PATCH', (table, update) => {
        if(table == 'equipment') {
            console.log(update)
            const id = update.id;
            delete update.id;
            const room = `${update.server}_${update.team}`;
            knex('equipment')
                .where('id', id)
                .update(update)
                .then(res => {
                    knex('equipment')
                        .select('*')
                        .where('team', update.team)
                        .andWhere('server', update.server)
                        .then(data => socket.to(room).emit('equipment_patch', data))
                });
        } else if(table == 'satEnv') {
            const conn = update.conn;
            delete update.id;
            const room = update.server;
            console.log(update)
            knex('satenv')
                .where('conn', conn)
                .update(update)
                .then(res => {
                    knex('satenv')
                        .select('*')
                        .where('server', update.server)
                        .then(data => socket.to(room).emit('satEnv_patch', data))
                });
        };
    });

    socket.on('POST', (table, update) => {
        if(table == 'equipment') {
            const room = `${update.server}_${update.team}`;
            delete update.id;
            knex('equipment')
                .insert(update)
                .then(res => {
                    knex('equipment')
                        .select('*')
                        .where('team', update.team)
                        .andWhere('server', update.server)
                        .then(data => socket.to(room).emit('equipment_patch', data))
                });
        } else if(table == 'satEnv') {
            const room = update.server;
            delete update.id;
            knex('satenv')
                .insert(update)
                .then(res => {
                    knex('satenv')
                        .select('*')
                        .where('server', update.server)
                        .then(data => socket.to(room).emit('satEnv_patch', data))
                });
        };
    });

    socket.on('DELETE', (table, update) => {
        if(table == 'equipment') {
            const id = update.id;
            const room = update.server;
            delete update.id;
            knex('equipment')
                .where('id', id)
                .delete()
                .then(res => {
                    knex('equipment')
                        .select('*')
                        .where('team', update.team)
                        .andWhere('server', update.server)
                        .then(data => socket.to(room).emit('equipment_patch', data))
                });
        } else if(table == 'satEnv') {
            const conn = update.conn;
            const room = update.server;
            delete update.id;
            knex('satenv')
                .where('conn', conn)
                .delete()
                .then(res => {
                    knex('satenv')
                        .select('*')
                        .where('server', update.server)
                        .then(data => socket.to(room).emit('satEnv_patch', data))
                });
        };
    });
});


app.get('/server', (req, res) => {
    knex
        .select('*')
        .from('equipment')
        .then(data => {
            const servers = data.map(x => x.server);
            res.status(200).json([...new Set(servers)]);
        });
    });

app.get('/equipment?', (req, res) => {
    const { server, team } = req.query;
    knex
        .select('*')
        .from('equipment')
        .where('server', server)
        .andWhere('team', team)
        .then(data => res.status(200).send(data));
});

app.get('/satEnv?', (req, res) => {
    const { server } = req.query;
    knex
        .select('*')
        .from('satenv')
        .where('server', server)
        .then(data => res.status(200).send(data));
});

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).send('App root route running');
});
