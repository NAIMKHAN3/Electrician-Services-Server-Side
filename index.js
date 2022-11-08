const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ujhfrio.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const services = client.db('assignment-11').collection('services');
        const reviews = client.db('assignment-11').collection('reviews');
        app.get('/service', async (req, res) => {

            try {
                const service = await services.find({}).limit(3).toArray();
                res.send({ status: true, data: service })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })
        app.get('/services', async (req, res) => {

            try {
                const service = await services.find({}).toArray();
                res.send({ status: true, data: service })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })
        app.get('/services/:id', async (req, res) => {

            try {
                const id = req.params.id;
                const serviceOne = await services.findOne({ _id: ObjectId(id) });
                res.send({ status: true, data: serviceOne })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })
        app.get('/addreview/:id', async (req, res) => {

            try {
                const id = req.params.id;
                const serviceOne = await services.findOne({ _id: ObjectId(id) });
                res.send({ status: true, data: serviceOne })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })




    }
    catch {


    }
}
run().catch(e => console.log(e))


app.listen(port, () => {
    console.log('server is running', port)
})