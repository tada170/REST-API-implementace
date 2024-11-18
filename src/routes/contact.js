function defineAPIContactEndpoints(app,connection) {
    app.get('/api/firms/:id/contact', async (req, res) => {
        const firmId = req.params.id;
        const fields = req.query.fields ? req.query.fields.split(',') : [];
        const sortBy = req.query.fields || 'id';
        const sortOrder = req.query.sortOrder || 'DESC';

        try {
            const [results] = await connection.query(`
                SELECT *
                FROM firm_contacts
                WHERE firm_id = ?
                ORDER BY ${sortBy} ${sortOrder}
            `, [firmId]);

            if (results.length === 0) {
                return res.status(404).json({msg: 'Firma nenalezena'});
            }

            const vcardData = results.map(item => {
                return item;
            });

            res.json(vcardData);
        } catch (error) {
            console.error('Error fetching firm:', error);
            res.status(500).json({msg: 'Chyba při načítání firemních dat'});
        }
    });
    app.get('/api/contact/fields', async (req, res) => {
        try {
            // Získáme seznam sloupců tabulky
            const [columns] = await connection.query(`
            SHOW COLUMNS FROM firm_contacts
        `);

            // Převedeme výsledky na seznam objektů s názvem a typem sloupce
            const fields = columns.map(col => ({
                name: col.Field,
                type: col.Type.includes('int') ? 'number' : 'text'  // Přizpůsobíme typ podle toho, zda je to číslo
            }));

            // Odpověď obsahuje pole objektů (název, typ)
            res.json({ fields });
        } catch (error) {
            console.error('Chyba při načítání polí:', error);
            res.status(500).json({ msg: 'Chyba při načítání polí' });
        }
    });
    app.post('/api/contact/add', async (req, res) => {
        try {
            const contact = req.body;

            // Před odstraněním ID sloupce (pokud existuje) můžeme také upravit další logiku, pokud je to potřeba.
            delete contact.id; // Ujistíme se, že 'firm_id' není součástí odesílaných dat

            // Seznam sloupců bez ID
            const fields = Object.keys(contact).join(', ');
            const values = Object.values(contact).map(value => `"${value}"`).join(', ');

            // Přidání kontaktu do databáze, bez 'firm_id' pole
            const query = `INSERT INTO firm_contacts (${fields}) VALUES (${values})`;

            await connection.query(query);

            res.status(200).json({ msg: 'Kontakt úspěšně přidán.' });
        } catch (error) {
            console.error('Chyba při přidávání kontaktu:', error);
            res.status(500).json({ msg: 'Chyba při přidávání kontaktu' });
        }
    });


}
module.exports = defineAPIContactEndpoints;