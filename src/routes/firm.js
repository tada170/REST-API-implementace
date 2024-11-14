function defineAPIEndpoints(app, connection) {
    const firmTable = 'firm';

    app.get('/api/firm', async (req, res) => {
        try {
            const [results] = await connection.query(`SELECT * FROM ${firmTable}`);
            res.json(results);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
    app.get('/api/firm/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const [results] = await connection.query(`SELECT * FROM ${firmTable} WHERE id = ${id}`);
            res.json(results);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
}
module.exports = defineAPIEndpoints;
