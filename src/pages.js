const path = require('path');

function defineAPIHtmlEndpoints(app) {

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../html', 'firm.html'));
    });
    app.get('/add', (req, res) => {
        res.sendFile(path.join(__dirname, '../html', 'firmAdd.html'));
    });
    app.get("/contact", (req, res) => {
        res.sendFile(path.join(__dirname, '../html', 'contacts.html'));
    })
    app.get("/contact_add", (req, res) => {
        res.sendFile(path.join(__dirname, '../html', 'contactAdd.html'));
    })
}

module.exports = defineAPIHtmlEndpoints;
