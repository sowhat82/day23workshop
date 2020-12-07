// load the libs
const express = require('express')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser');

// SQL
const SQL_SELECT_ALL_FROM_ORDERS = 'select * from orders;'
const SQL_ADD_NEW_ORDER = 'insert into orders (employee_id, customer_id, shipper_id, ship_zip_postal_code, tax_status_id, status_id, ship_name) values (?, ?, ?, ?, ?, ?, ?);'


const startApp = async (app, pool) => {
	const conn = await pool.getConnection()
	try {
		console.info('Pinging database...')
		await conn.ping()
		app.listen(PORT, () => {
			console.info(`Application started on port ${PORT} at ${new Date()}`)
		})
	} catch(e) {
		console.error('Cannot ping database', e)
	} finally {
		conn.release()
	}
}

// configure port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

// create connection pool
const pool = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT) || 3306,
	database: 'northwind',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectionLimit: 4
})

// create an instance of the application
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/orders', async (req, resp) => {

	const conn = await pool.getConnection()
	try {
		// const [ result, _ ] = await conn.query(SQL_BOOK_LETTER, [ `${letter}%`, LIMIT, offset ])
		const [ result, _ ] = await conn.query(SQL_SELECT_ALL_FROM_ORDERS)

		resp.status(200)
		resp.type('application/json')
        resp.json(result)
        
	} catch(e) {
		console.error('ERROR: ', e)
		resp.status(500)
		resp.end()
	} finally {
		conn.release()
	}
})

app.post('/order', async (req, resp) => {
    const employee_id = req.body.employee_id;
    const customer_id = req.body.customer_id;
    const shipper_id = req.body.shipper_id;
    const ship_zip_postal_code = req.body.ship_zip_postal_code;
    const tax_status_id = req.body.tax_status_id;
    const status_id = req.body.status_id;
    const ship_name = req.body.ship_name;
    	
	const conn = await pool.getConnection()
	try {
        const [ result, _ ] = await conn.query(
            SQL_ADD_NEW_ORDER, 
            [employee_id, customer_id, shipper_id, ship_zip_postal_code, tax_status_id, status_id, ship_name]
        )

		resp.status(200)
		resp.format({
			html: () => { resp.send('Thank you'); },
			json: () => { resp.json({status: 'ok'});}
		})
			
	} catch(e) {
//		console.error('ERROR: ', e)
		resp.status(500).send(e)
		resp.end()
	} finally {
		conn.release()
	}
	

});

// start the app
startApp(app, pool)