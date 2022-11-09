const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({ success: true, message: 'server is running' })
})

async function verifyToken(req, res, next) {
    const authHeaders = req.headers?.authorization;
    if (!authHeaders) {
        return res.status(401).send({ success: false, message: 'unauthorized' })
    }
    const token = authHeaders.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(401).send({ success: false, message: 'unauthorized' })
        }
        req.decoded = decoded;
        next();
    })
}


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
                const service = await (await services.find({}).toArray()).reverse();
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

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN);
            res.send({ token })
        })


        app.post('/addreview', async (req, res) => {
            try {
                const review = req.body;
                const addReview = await reviews.insertOne(review);
                res.send({ status: true, data: addReview })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })
        app.post('/addservice', async (req, res) => {
            try {
                const service = req.body;
                const addService = await services.insertOne(service);
                res.send({ status: true, data: addService })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })


        app.get('/allreviews', async (req, res) => {
            try {
                const name = req.query.name;
                const review = await (await reviews.find({ serviceName: name }).toArray()).reverse();
                res.send({ status: true, data: review })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })


        app.get('/myreviews', verifyToken, async (req, res) => {
            try {
                const email = req.query.email;
                const decoded = req.decoded;
                if (decoded.email !== email) {
                    return res.status(403).send({ status: false, message: 'unathoraized' })
                }
                const review = await (await reviews.find({ userEmail: email }).toArray()).reverse();
                res.send({ status: true, data: review })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })


        app.get('/editreview/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const edit = await reviews.findOne({ _id: ObjectId(id) });
                res.send({ status: true, data: edit })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })

        app.patch('/editreview', async (req, res) => {
            const id = req.query.id;
            const review = req.body;
            try {
                const edit = await reviews.updateOne({ _id: ObjectId(id) }, { $set: review });
                res.send({ status: true, data: edit })
            }
            catch {
                res.send({ status: false, error: 'couldnt data' })
            }
        })


        app.delete('/deletereview/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const deleteReview = await reviews.deleteOne({ _id: ObjectId(id) });
                res.send({ status: true, data: deleteReview })
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