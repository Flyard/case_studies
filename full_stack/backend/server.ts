// @ts-ignore
import express from 'express'
import cors from 'cors';
import {taxonomyRouter} from "./taxonomy/taxonomy.controller";
import exp = require("constants");
const app = express();
app.use(cors());
app.use(express.json())
app.use('/tree',taxonomyRouter)

app.get('/', (req: express.Request, res:express.Response) => {
    res.status(200).send('hello world')
})

function run() {
    app.listen(3001, () => {
        console.log('Server running');
    })
}

run()

