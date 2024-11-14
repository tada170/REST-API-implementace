function defineAPIEndpoints(app, connection) {
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
            res.json(results[0] || {});
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
    // API pro získání všech sloupců tabulky 'firms'
    app.get('/api/firms/:id/vcard', async (req, res) => {
        const firmId = req.params.id;
        const fields = req.query.fields ? req.query.fields.split(',') : []; // Extract fields from the query parameter

        try {
            const [results] = await connection.query('SELECT * FROM firm_contacts WHERE firm_id = ?', [firmId]);

            if (results.length === 0) {
                return res.status(404).json({ msg: 'Firma nenalezena' });
            }

            const firm = results[0]; // Assuming the query returns an array with a single object

            const vcardData = {};

            if (fields.length > 0) {
                fields.forEach(field => {
                    if (firm.hasOwnProperty(field)) {
                        vcardData[field] = firm[field];
                    }
                });
            } else {
                Object.assign(vcardData, firm);
            }

            const vcardResponse = formatVCard(firm, vcardData);

            res.json(vcardResponse);
        } catch (error) {
            console.error('Error fetching firm:', error);
            res.status(500).json({ msg: 'Chyba při načítání firemních dat' });
        }
    });
    app.post('/api/firm', (req, res) => {
        const firmData = req.body; // Přijatá data formuláře
        const fields = Object.keys(firmData);
        const values = Object.values(firmData);

        // Dynamicky vytvoříme SQL dotaz pro vložení dat
        const query = `INSERT INTO firm (${fields.join(', ')})
                       VALUES (${fields.map(() => '?').join(', ')})`;

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Chyba při vkládání firmy:', err);
                res.status(500).json({msg: 'Chyba při vkládání firmy'});
            } else {
                res.status(200).json({msg: 'Firma byla úspěšně přidána!'});
            }
        });
    });
        // API pro získání všech sloupců tabulky 'firms' a jejich dynamické vytvoření formuláře
        app.get('/api/firm/fields', async (req, res) => {
            try {
                // Použití async/await pro získání popisu tabulky 'firms'
                const [result] = await connection.query('DESCRIBE firms');
                const fields = result.map(field => field.Field); // Seznam sloupců
                res.json({fields});
            } catch (error) {
                console.error('Chyba při získávání popisu tabulky:', error);
                res.status(500).json({msg: 'Chyba při získávání popisu tabulky.'});
            }
        });

// API pro uložení nové firmy (post request)
    app.post('/api/firm', async (req, res) => {
        console.log('Přijatá data:', req.body); // Zkontroluj přijatá data

        const firmData = req.body;
        const fields = Object.keys(firmData);
        const values = Object.values(firmData);

        try {
            const query = `
                INSERT INTO firms (${fields.join(', ')})
                VALUES (${fields.map(() => '?').join(', ')})
            `;
            const [result] = await connection.query(query, values);

            res.status(200).json({ msg: 'Firma byla úspěšně přidána!', id: result.insertId });
        } catch (error) {
            console.error('Chyba při vkládání firmy:', error);
            res.status(500).json({ msg: 'Chyba při vkládání firmy' });
        }
    });



}
module.exports = defineAPIEndpoints;
