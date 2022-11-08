const express = require('express');
const app = express();
const cors = require('cors');
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173']
    }
})
io.on('connection', socket => {
    console.log(socket.id)
    socket.on('JOIN', (server) => {
        socket.join(server)
    })
    socket.on('PATCH', (table, update) => {
        const room = update.server;
        if(table == 'equipment') {
            const index = equipment.map(x => x.id).indexOf(update.id)
            equipment[index] = update;
            socket.emit('equipment_patch', update)
        } else if(table == 'satEnv') {
            const index = satEnv.map(x => x.id).indexOf(update.id)
            satEnv[index] = update;
            socket.emit('satEnv_patch', update)
        };
    });
    socket.on('POST', (table, update) => {
        const room = update.server;
        if(table == 'equipment') {
            equipment.push(update);
            socket.emit('equipment_post', update)
        } else if(table == 'satEnv') {
            satEnv.push(update);
            socket.emit('satEnv_post', update)
        };
    });
    socket.on('DELETE', (table, update) => {
        const room = update.server;
        if(table == 'equipment') {
            const index = equipment.map(x => x.id).indexOf(update.id)
            equipment.splice(index,1);
            socket.emit('equipment_delete', update)
        } else if(table == 'satEnv') {
            const index = satEnv.map(x => x.id).indexOf(update.id)
            satEnv.splice(index,1)
            socket.emit('satEnv_delete', update)
        };
    });
})


const port = 8080;
app.use(cors());
app.use(express.json())

let equipment = [
    {id: 1, conn: 'asbkj', server: '0a2b', team: 'Instructor', unit_type: 'Group_X', unit_name: 'Signal_01', cf: 1550, bw: 10, dr: 5, mod: 2, fec: 1, power: -50, sat: 'ASH', feed: 'Feed 01', active: false},
    {id: 2, conn: 'sfsdk', server: '0a2b', team: 'Instructor', unit_type: 'Group_X', unit_name: 'Signal_02', cf: 1560, bw: .5, dr: 5, mod: 2, fec: 1, power: -90, sat: 'DRSC', feed: 'Feed 02', active: false},
    {id: 3, conn: '237sf', server: '0a2b', team: 'Instructor', unit_type: 'Group_X', unit_name: 'Signal_03', cf: 1565, bw: .5, dr: 5, mod: 2, fec: 1, power: -90, sat: 'ASH', feed: 'Feed 03', active: false},
    {id: 4, conn: '7sdfn', server: '0a2c', team: 'Instructor', unit_type: 'Group_2', unit_name: 'TheBigOne', cf: 1300, bw: 50, dr: 5, mod: 2, fec: 1, power: -87, sat: 'ASH', feed: 'Feed 04', active: false},
    {id: 5, conn: '23fsj', server: '0a2c', team: 'Instructor', unit_type: 'Group_2', unit_name: 'TheLittleOne', cf: 1565, bw: .5, power: -90, sat: 'Satellite C', feed: 'Feed 05', active: false},
    {id: 6, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
    {id: 14, conn: 'vic01', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '1', cf: 1100, dr: 1, mod: 2, fec: 1, power: -67, sat: 'ASH', feed: '', active: false},
    {id: 15, conn: 'vic02', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '2', cf: 1200, dr: 2, mod: 2, fec: 1, power: -66, sat: 'ASH', feed: '', active: false},
    {id: 16, conn: 'vic03', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '3', cf: 1300, dr: 3, mod: 2, fec: 1, power: -65, sat: 'ASH', feed: '', active: false},
    {id: 17, conn: 'vic04', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '4', cf: 1400, dr: 4, mod: 2, fec: 1, power: -64, sat: 'ASH', feed: '', active: false},
    {id: 18, conn: 'vic05', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '5', cf: 1500, dr: 5, mod: 2, fec: 1, power: -63, sat: 'ASH', feed: '', active: false},
    {id: 19, conn: 'vic06', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '6', cf: 1600, dr: 6, mod: 2, fec: 1, power: -62, sat: 'ASH', feed: '', active: false},
    {id: 20, conn: 'vic07', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '7', cf: 1700, dr: 7, mod: 2, fec: 1, power: -61, sat: 'ASH', feed: '', active: false},
    {id: 21, conn: 'vic08', server: '0a2b', team: 'Victor', unit_type: 'TX', unit_name: '8', cf: 1800, dr: 8, mod: 2, fec: 1, power: -60, sat: 'ASH', feed: '', active: false},
    {id: 22, conn: '', server: '0a2b', team: 'Victor', unit_type: 'Antenna', unit_name: 'C', cf: 15, bw: 0, power: 1, sat: 'ASH', feed: '1', active: false},
    {id: 24, conn: '', server: '0a2b', team: 'Victor', unit_type: 'SpecA', unit_name: '1', cf: 1500, bw: 1000, power: 0, sat: 'ULIF', feed: '', active: true},
    {id: 25, conn: '', server: '0a2b', team: 'Victor', unit_type: 'SpecA', unit_name: '2', cf: 6500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
    {id: 26, conn: '', server: '0a2b', team: 'Victor', unit_type: 'SpecA', unit_name: '3', cf: 1500, bw: 1000, power: 0, sat: 'DLIF', feed: '', active: true},
    {id: 27, conn: '', server: '0a2b', team: 'Victor', unit_type: 'SpecA', unit_name: '4', cf: 6500, bw: 1000, power: 0, sat: 'DLRF', feed: '', active: true},
];
let satEnv = [
    //{id: 0, server: '0a2b', conn: 'x1', team: 'Instructor', cf: 1250, dr: 5, mod: 2, fec: 1, power: -60, band: 'C', sat: "ASH", feed: 'Feed 01', stage: "ULIF", lb: false, active: true},
    {id: 0, server: '0a2b', conn: 'x2', team: 'Whiskey', cf: 1350, dr: 50, mod: 2, fec: 1, power: -60, band: 'C', sat: "ASH", feed: 'Feed 01', stage: "ULIF", lb: false, active: true},
    {id: 0, server: '0a2b', conn: 'x4', team: 'Yankee', cf: 1500, dr: 25, mod: 2, fec: 1, power: -60, band: 'Ku', sat: "DRSC", feed: 'Feed 01', stage: "ULIF", lb: false, active: true},
    //{id: 0, server: '0a2b', conn: 'x5', team: 'Instructor', cf: 1100, dr: 5, mod: 2, fec: 1, power: -60, band: 'C', sat: "ASH", feed: 'Feed 01', stage: "ULIF", lb: false, active: true},
    //{id: 0, server: '0a2b', conn: 'x6', team: 'Instructor', cf: 1650, dr: 100, mod: 2, fec: 1, power: -60, band: 'C', sat: "ASH", feed: 'Feed 01', stage: "ULIF", lb: false, active: true}
];
 
app.listen(port, () => console.log(`API listening on port ${port}`))

app.get('/server', (req, res) => {
    const serverList = new Set(equipment.map(x => x.server))
    res.status(200).send([...serverList])
});

app.get('/equipment?', (req, res) => {
    const { server, team } = req.query;
    const equipmentList = equipment.filter(x => x.server == server && x.team == team)
    res.status(200).send(equipmentList)
});

app.get('/satEnv?', (req, res) => {
    const { server } = req.query;
    const tmpSatEnv = satEnv.filter(x => x.server == server)
    res.status(200).send(tmpSatEnv)
});

app.post('/table?', (req, res) => {
    const { table } = req.query;
    if ( table == 'equipment' ) {
        equipment.push(req.body) // Temporary: handle this in db
        const tmpEquipment = [...equipment].filter(x => x.server == req.body.server && x.team == req.body.team)
        res.status(200).send(tmpEquipment)
    } else if (table == 'satEnv') {   
        satEnv.push(req.body) // Temporary: handle this in db
        const tmpSatEnv = [...satEnv].filter(x => x.server == req.body.server && x.team == req.body.team)
        res.status(200).send(tmpSatEnv)
    }
});

app.patch('/table?', (req, res) => {
    const {table} = req.query;
    if ( table == 'equipment' ) {
        const index = equipment.map(x => x.id).indexOf(req.body.id);
        equipment[index] = req.body
        const tmpEquipment = [...equipment].filter(x => x.server == req.body.server && x.team == req.body.team)
        res.status(200).send(tmpEquipment)
    } else if ( table == 'satEnv' ) {
        const index = satEnv.map(x => x.id).indexOf(req.body.id);
        satEnv[index] = req.body
        const tmpSatEnv = [...satEnv].filter(x => x.server == req.body.server && x.team == req.body.team)
        res.status(200).send(tmpSatEnv)
    }
});

app.delete('/table?', (req, res) => {
    const {table} = req.query;
    if ( table == 'equipment' ) {
        const index = equipment.map(x => x.id).indexOf(req.body.id);
        equipment.splice(index, 1)
        const tmpEquipment = [...equipment].filter(x => x.server == req.body.server && x.team == req.body.team)
        res.status(200).send(tmpEquipment)
    } else if ( table == 'satEnv' ) {
        const index = satEnv.map(x => x.id).indexOf(req.body.id);
        satEnv.splice(index, 1)
        const tmpSatEnv = [...satEnv].filter(x => x.server == req.body.server && x.team == req.body.team)
        res.status(200).send(tmpSatEnv)
    }
});

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).send('App root route running');
});
