function defineAPIFirmEndpoints(app, connection) {
    app.get('/api/firm', async (req, res) => {
        try {
            const [results] = await connection.query(`
                SELECT firm.*, subject.name AS subject_name
                FROM firm
                LEFT JOIN subject ON firm.subject_id = subject.id
            `);
            res.json(results);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });

    app.get('/api/firm/:id', async (req, res) => {
        const firmId = req.params.id;
        try {
            const [results] = await connection.query(`
                SELECT firm.*, subject.name AS subject_name
                FROM firm
                         LEFT JOIN subject ON firm.subject_id = subject.id
                WHERE firm.id = ?
            `, [firmId]);

            console.log(results);

            res.json(results[0] || {});
        } catch (error) {
            console.error('Error fetching firm:', error);
            res.status(500).json({ msg: error.message });
        }
    });
    app.get('/api/firm/fields', async (req, res) => {
        try {
            const [results] = await connection.query('DESCRIBE firm');
            console.log('Výstup z DESCRIBE firm:', results);

            const fields = results.map(field => ({
                Field: field.Field,
                Type: field.Type,
                Null: field.Null,
                Key: field.Key,
                Default: field.Default,
                Extra: field.Extra
            }));

            res.json({ fields });
        } catch (error) {
            console.error('Chyba při získávání popisu tabulky:', error);
            res.status(500).json({ msg: 'Chyba při získávání popisu tabulky.' });
        }
    });



    app.post('/api/firm', async (req, res) => {
        console.log('Přijatá data:', req.body);

        const firmData = req.body;
        const fields = Object.keys(firmData);
        const values = Object.values(firmData);

        try {
            const query = `
                INSERT INTO firm (${fields.join(', ')})
                VALUES (${fields.map(() => '?').join(', ')})
            `;
            const [result] = await connection.query(query, values);

            res.status(200).json({ msg: 'Firma byla úspěšně přidána!', id: result.insertId });
        } catch (error) {
            console.error('Chyba při vkládání firmy:', error);
            res.status(500).json({ msg: 'Chyba při vkládání firmy' });
        }
    });
    app.delete('/api/firm/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await connection.query('DELETE FROM firm WHERE id = ?', [id]);
            if (result.affectedRows > 0) {
                res.status(200).json({ msg: 'Firma byla úspěšně smazána.' });
            } else {
                res.status(404).json({ msg: 'Firma nebyla nalezena.' });
            }
        } catch (error) {
            console.error('Chyba při mazání firmy:', error);
            res.status(500).json({ msg: 'Chyba při mazání firmy.' });
        }
    });
    // Endpoint pro aktualizaci firemních dat podle ID
    app.put('/api/firm/:id', async (req, res) => {
        const { id } = req.params;
        const { name, address, contact } = req.body; // Předpokládáme, že tělo požadavku obsahuje nová data

        try {
            if (!name) {
                return res.status(400).json({ message: 'Název firmy je povinný' });
            }

            const result = await db.query(
                'UPDATE firms SET name = ?, address = ?, contact = ? WHERE id = ?',
                [name, address, contact, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Firma nenalezena' });
            }

            res.json({ message: 'Firma byla úspěšně aktualizována' });
        } catch (error) {
            console.error('Chyba při aktualizaci firmy:', error);
            res.status(500).json({ message: 'Chyba při aktualizaci firmy' });
        }
    });


}
module.exports = defineAPIFirmEndpoints;
