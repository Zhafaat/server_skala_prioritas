const express = require('express')
const app = express()
const cors = require('cors')
const pg = require('pg')
const Pool = pg.Pool
app.use(cors())

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'priority',
  password: 'motorr155577',
  port: 5432,
  connectionTimeoutMillis: 2000,
  max: 100
})

const port = 4000
app.use(express.urlencoded({extended:true}))
app.json

app.get('/deadline', async(req, res) => {
  try {
    const query = `SELECT "ID", title, deadlines, "priorityScale", notes, status 
    FROM public.task where status = false order by deadlines, "priorityScale" desc;`
    const data = await pool.query(query)
    // console.log(data)
    res.status(200).json(data.rows)
  } catch (error) {
    res.status(404).json({message: "Not Found"})
  }
})

app.get('/done', async(req,res) => {
  try {
    const query = `SELECT "ID", title, deadlines, "priorityScale", notes, status
    FROM public.task where status = true ;`
    const data = await pool.query(query)
    res.status(200).json(data.rows)
  } catch (error) {
    res.status(404).json({message: "Not Found"})
  }
})

app.get('/PM', async(req, res) => {
  try {
    const query = `SELECT "ID", title, deadlines, "priorityScale", notes, status
    FROM public.task where "priorityScale" = 4 and status = false order by deadlines;`
    const data = await pool.query(query)
    res.status(200).json(data.rows)
  } catch (error) {
    res.status(404).json({message: "Not Found"})
  }
})

app.get('/PtM', async(req, res) => {
  try {
    const query = `SELECT "ID", title, deadlines, "priorityScale", notes, status
    FROM public.task where "priorityScale" = 3 and status = false order by deadlines;`
    const data = await pool.query(query)
    res.status(200).json(data.rows)
  } catch (error) {
    res.status(404).json({message: "Not Found"})
  }
})

app.get('/tPM', async(req, res) => {
  try {
    const query = `SELECT "ID", title, deadlines, "priorityScale", notes, status
    FROM public.task where "priorityScale" = 2 and status = false order by deadlines;`
    const data = await pool.query(query)
    res.status(200).json(data.rows)
  } catch (error) {
    res.status(404).json({message: "Not Found"})
  }
})

app.get('/tPtM', async(req, res) => {
  try {
    const query = `SELECT "ID", title, deadlines, "priorityScale", notes, status
    FROM public.task where "priorityScale" = 1 and status = false order by deadlines;`
    const data = await pool.query(query)
    res.status(200).json(data.rows)
  } catch (error) {
    res.status(404).json({message: "Not Found"})
  }
})

app.get('/activity', async(req, res) => {
  try {
    const query = `SELECT "ID", title, deadlines, "priorityScale", notes, "Creat_at", "Updated_at"
    FROM public.task;
    `
    const data = await pool.query(query)
    console.log(data);
    res.status(200).json(data.rows)
  } catch (error) {
    res.status(404).json({message: `Not Found`})
  }
})

app.put('/list/:id', async(req, res) => {
  try {
      const id = req.params.id
      const status = req.body.status
      const query = `UPDATE public.task
      SET status=${status} 
      WHERE "ID"='${id}';`
      const data = await pool.query(query)
      if (data.rowCount === 1){
          res.status(200).json({message: "Success Update"})
      }
  } catch (error) {
      res.status(400).json({message: "Bad Request"})
  }
})

app.post('/activity', async(req, res) => {
  try {
    const body = req.body
    const _key = []
    const _val = []
    for (let key in body){
      _key.push(`"${key}"`)
      _val.push(`'${ body[key]}'`)
    }
    console.log(_key)
    console.log(_val)
    const query = `INSERT INTO public.task
    ("ID", "Creat_at", "Updated_at", ${_key})
    VALUES(gen_random_uuid(), now(), now(), ${_val});`
    console.log(query)
    const data = await pool.query(query)
    if (data.rowCount === 1){
      res.status(200).json({message: "Success Insert"})
    }
    //   res.status(200).json({message: "Success Insert"})
  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Bad Request"})
  }
})

app.delete('/delete/:id', async (req,res) => {
  try {
    const ID = req.params.id
    const query = `DELETE FROM public.task
    WHERE "ID"='${ID}';`
    const data = await pool.query(query)
    if (data.rowCount === 1){
      res.status(200).json({message: "Success Delete"})
    } else if (data.rowCount === 0){
      res.status(404).json({message: "Not Found"})
    }
  } catch (error) {
    res.status(400).json({message: "Bad Request"})
  }
})


app.get('/data', async (req, res) => {
    try {
        console.log(req.body)
        res.status(200).json(req.body)
    } catch (error) {
        res.status(400).json({message: "error"})
    }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})