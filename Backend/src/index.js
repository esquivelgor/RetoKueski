const express = require("express");
const cors = require('cors');
const app = express();
const mysql = require('mysql2/promise');

app.use(express.json());
app.use(cors());

import { PORT, MYSQLDATABASE, MYSQLHOST, MYSQLPASSWORD, MYSQLUSER} from './config.js'

//BD
const pool = mysql.createPool({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE
})

//puerto localhost
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

//actividad de clase
app.get("/test", (req, res) => {
    res.json({ message: "Hello from server side!" });
});

//endpoints DASHBOARD
app.get("/dashboard/pending", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("CALL sp_get_pending_petitions() ");
        connection.release();
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.get("/dashboard/notPending", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("CALL sp_get_not_pending_petitions() ");
        connection.release();
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

//endpoints USER
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL get_client_info(?)', [id]);
        connection.release();
        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.put('/user/:id/opposition', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.execute('CALL approve_opposition(?)', [id]);
        connection.release();
        res.json({ message: `Client ${id} has been set as in opposition` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

//endpoints PETITION
app.get('/petition/:id/', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL get_arco_petition_info(?)', [id]);
        connection.release();
        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.get('/petition/:id/comment', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL get_arco_comment(?)', [id]);
        connection.release();
        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.put('/petition/:id/approve', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.execute('CALL approve_arco_petition(?)', [id]);
        connection.release();
        res.json({ message: `ARCO Petition ${id} has been approved` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

app.put('/petition/:id/reject', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.execute('CALL reject_arco_petition(?)', [id]);
        connection.release();
        res.json({ message: `ARCO Petition ${id} has been rejected` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

