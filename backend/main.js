// load the libs
const express = require('express')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser');
const secureEnv = require('secure-env')
global.env = secureEnv({secret:'mySecretPassword'})


// SQL
const SQL_SELECT_ALL_FROM_ORDERS = 'select * from orders order by id desc;'
const SQL_SELECT_ALL_FROM_ORDER_DETAILS = 'select * from order_details order by id desc;'

const SQL_ADD_NEW_ORDER = 'insert into orders (employee_id, customer_id, shipper_id, ship_zip_postal_code, tax_status_id, status_id, ship_name) values (?, ?, ?, ?, ?, ?, ?);'
const SQL_ADD_NEW_ORDER_DETAILS='insert into order_details (order_id, product_id, status_id, purchase_order_id, inventory_id) values (LAST_INSERT_ID(), ?,?,?,?);'

const SQL_DELETE_ID_FROM_ORDERS = 'delete from orders where id = ?;'
const SQL_DELETE_ID_FROM_ORDER_DETAILS = 'delete from order_details where order_id = ?;'

const SQL_SELECT_ALL_EMPLOYEE_IDS = 'select id from employees;'
const SQL_SELECT_ALL_CUSTOMER_IDS = 'select id from customers;'


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
	user: global.env.DB_USER || process.env.DB_USER,
	password: global.env.DB_PASSWORD || process.env.DB_PASSWORD,
	connectionLimit: 4
})

// create an instance of the application
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/orders', async (req, resp) => {

	const conn = await pool.getConnection()
	try {
		const [ result, _ ] = await conn.query(SQL_SELECT_ALL_FROM_ORDERS)

		resp.status(200)
		resp.type('text/html').send(result)
        
	} catch(e) {
		console.error('ERROR: ', e)
		resp.status(500)
		resp.end()
	} finally {
		conn.release()
	}
})

app.get('/order-details', async (req, resp) => {

	const conn = await pool.getConnection()
	try {
		const [ result, _ ] = await conn.query(SQL_SELECT_ALL_FROM_ORDER_DETAILS)

		resp.status(200)
		resp.type('text/html').send(result)
        
	} catch(e) {
		console.error('ERROR: ', e)
		resp.status(500)
		resp.end()
	} finally {
		conn.release()
	}
})

app.get('/employees', async (req, resp) => {
	const conn = await pool.getConnection()
	try {
		const [ result, _ ] = await conn.query(SQL_SELECT_ALL_EMPLOYEE_IDS)
		resp.status(200)
		resp.type('text/html').send(result)
	} catch(e) {
		console.error('ERROR: ', e)
		resp.status(500)
		resp.end()
	} finally {
		conn.release()
	}
})

app.get('/customers', async (req, resp) => {
	const conn = await pool.getConnection()
	try {
		const [ result, _ ] = await conn.query(SQL_SELECT_ALL_CUSTOMER_IDS)
		resp.status(200)
		resp.type('text/html').send(result)
	} catch(e) {
		console.error('ERROR: ', e)
		resp.status(500)
		resp.end()
	} finally {
		conn.release()
	}
})

app.post('/order', async (req, resp) => {

	// for orders table
    const employee_id = req.body.employee_id;
    const customer_id = req.body.customer_id;
    const shipper_id = req.body.shipper_id;
    const ship_zip_postal_code = req.body.ship_zip_postal_code;
    const tax_status_id = req.body.tax_status_id;
    const order_status_id = req.body.order_status_id;
    const ship_name = req.body.ship_name;
 
	// for order details table
    const product_id = req.body.product_id;
    const orderDetails_status_id = req.body.orderDetails_status_id;
    const purchase_order_id = req.body.purchase_order_id;
    const inventory_id = req.body.inventory_id;


	const conn = await pool.getConnection()
	try {
        const [ result, _ ] = await conn.query(
            SQL_ADD_NEW_ORDER, 
            [employee_id, customer_id, shipper_id, ship_zip_postal_code, tax_status_id, order_status_id, ship_name],
		)

        const [ result2, _2 ] = await conn.query(
            SQL_ADD_NEW_ORDER_DETAILS, 
            [product_id, orderDetails_status_id, purchase_order_id, inventory_id],
		)


		resp.status(200)
		resp.format({
			html: () => { resp.send('Thank you'); },
			json: () => { resp.json({status: 'ok'});}
		})
			
	} catch(e) {
		resp.status(500).send(e)
		resp.end()
	} finally {
		conn.release()
	}
});

app.post('/delete', async (req, resp) => {

	const id = req.body.id;

	console.info(id)

	const conn = await pool.getConnection()
	try {

		const [ result2, _2 ] = await conn.query(SQL_DELETE_ID_FROM_ORDER_DETAILS, [id])

		const [ result, _ ] = await conn.query(SQL_DELETE_ID_FROM_ORDERS, [id])

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

// start the app
startApp(app, pool)