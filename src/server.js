const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createConnection = require('./db_conn');
const defineAPIFirmEndpoints = require('./routes/firm');
const defineAPIContactEndpoints = require('./routes/contact');
const defineAPIHtmlEndpoints = require('./pages');
const path = require('path');

const app = express();
const port = process.env.SERVER_PORT;
const projectPath = path.join(__dirname, "..");

app.use(express.static(path.join(projectPath, "public")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function startServer() {
    try {
        const connection = await createConnection();
        defineAPIHtmlEndpoints(app);
        defineAPIFirmEndpoints(app, connection);
        defineAPIContactEndpoints(app, connection);

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();
