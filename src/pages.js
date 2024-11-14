const path = require('path');

function defineAPIHtmlEndpoints(app) {

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../html', 'firm.html'));
    });
}

module.exports = defineAPIHtmlEndpoints;
