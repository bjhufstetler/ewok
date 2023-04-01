/*
   USER INPUT REQUIRED!
   TYPE YOUR NETWORK IP
   ADDRESS ON LINE 7
*/

const ipAddress = [ '192.168.0.53', '192.168.1.82', '10.11.87.119'];

var express = require("express");
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { 
        //origin: 'https://bjhufstetler.github.io'
        origin: ['http://localhost:3000', `http://${ipAddress[0]}:3000`, `http://${ipAddress[1]}:3000`, `http://${ipAddress[2]}:3000`]
    }
});

const knex = require('knex')(require('./knexfile.js')['development']);

const port = process.env.PORT || 8080;

const cors = require('cors');
app.use(cors());
app.use(express.json())

http.listen(port, () => console.log(`API listening on port ${port}.`));


io.on('connection', (socket) => {
    const Patch = (table, update) => {
        if(table == 'equipment') {
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
    };

    const Delete = (table, update) => {
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
    };

    const Post = (table, update) => {
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
    };

    socket.on('ScenarioClock', (props) => {
        console.log(props.message);
        io.sockets.emit('ScenarioClockAPI',props);
        console.log("API: Emitted the message back out.")
    })

    socket.on('JOIN', (server, team) => {
        socket.join(server)
        socket.join(`${server}_${team}`)
    });

    socket.on('CHAT', (props) => {
        const room = props.server;
        io.sockets.emit('CHAT_API', props);
    });

    socket.on('POST', (table, update) => {
        Post(table, update)
    });

    socket.on('PATCH', (table, update) => {
        Patch(table, update)
    });

    socket.on('DELETE', (table, update) => {
        Delete(table, update);
    });

    socket.on('RESET', (server) => {
        // Delete all student signals from environment
        knex('satenv')
            .select('*')
            .where('server', server)
            .andWhereNot('team', 'Instructor')
            .then(res => {
                res.forEach(signal => Delete('satEnv', signal));
            });

        // Reset all TX modems
        knex('equipment')
            .select('*')
            .where('server', server)
            .andWhereNot('team', 'Instructor')
            .andWhere('unit_type', 'TX')
            .then(res => {
                res.forEach(modem => {
                    const tmpModem = {
                        ...modem,
                        cf: 1000,
                        dr: 1,
                        mod: 1,
                        fec: 1,
                        power: -87,
                        sat: 'ASH',
                        active: false
                    };
                    Patch('equipment', tmpModem);
                });
            });
        
        // Reset all RX modems
        knex('equipment')
            .select('*')
            .where('server', server)
            .andWhereNot('team', 'Instructor')
            .andWhere('unit_type', 'RX')
            .then(res => {
                res.forEach(modem => {
                    const tmpModem = {
                        ...modem,
                        cf: 1000,
                        mod: 1,
                        fec: 1,
                    };
                    Patch('equipment', tmpModem);
                });
            });
        
        // Reset all Antennas
        knex('equipment')
            .select('*')
            .where('server', server)
            .andWhere('unit_type', 'Antenna')
            .then(res => {
                res.forEach(antenna => {
                    const tmpAntenna = {
                        ...antenna,
                        unit_name: 'C',
                        cf: 0,
                        bw: 0,
                        mod: 0,
                        fec: 0,
                        power: 1,
                        sat: 'ASH',
                        feed: '0',
                        active: false
                    };
                    Patch('equipment', tmpAntenna);
                });
            });
    });

    socket.on('ACTIVATE', (server) => {
        // Delete instructor signals from satEnv
        knex('satenv')
            .select('*')
            .where('server', server)
            .andWhere('team', 'Instructor')
            .then(res => {
                res.forEach(signal => {
                    Delete('satEnv', signal)}
                );
            })
            .then(() => {
                // Post all signals to satEnv
                knex('equipment')
                    .select('*')
                    .where('server', server)
                    .where('team', 'Instructor')
                    .then(res => {
                        res.forEach(signal => {
                            const tmpSignal = {
                                ...signal,
                                active: true
                            };
                            const tmpEnvSignal = {
                                id: signal.id,
                                server: signal.server,
                                conn: signal.conn,
                                team: signal.team,
                                cf: Number(signal.cf),
                                dr: Number(signal.dr),
                                fec: Number(signal.fec),
                                mod: Number(signal.mod),
                                power: signal.power,
                                band: signal.sat === 'ASH' ? 'C' : signal.sat === 'DRSC' ? 'Ku' : 'Ka',
                                sat: signal.sat,
                                feed: signal.feed,
                                stage: "ULIF",
                                active: true
                            };
                            Patch('equipment', tmpSignal);
                            Post('satEnv', tmpEnvSignal);
                        });
                    })
            });
    });

    socket.on('DEACTIVATE', (server) => {
        // Delete instructor signals from satEnv
        knex('satenv')
            .select('*')
            .where('server', server)
            .andWhere('team', 'Instructor')
            .then(res => {
                res.forEach(signal => {
                    Delete('satEnv', signal)
                });
            })
            .then(() => {
                // Post all signals to satEnv
                knex('equipment')
                    .select('*')
                    .where('server', server)
                    .where('team', 'Instructor')
                    .then(res => {
                        res.forEach(signal => {
                            const tmpSignal = {
                                ...signal,
                                active: false
                            };
                            Patch('equipment', tmpSignal);
                        });
                    })
            });
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
