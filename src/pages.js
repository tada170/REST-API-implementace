const path = require('path');

function defineAPIHtmlEndpoints(app) {

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../html', 'firm.html'));
    });
    app.get('/add', (req, res) => {
        res.sendFile(path.join(__dirname, '../html', 'firmAdd.html'));
    });
}

module.exports = defineAPIHtmlEndpoints;
