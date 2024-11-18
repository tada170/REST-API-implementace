function defineAPIContactEndpoints(app, connection) {
    // GET: Získání všech kontaktů pro konkrétní firmu
    app.get('/api/firms/:id/contact', async (req, res) => {
        const firmId = req.params.id;
        const sortBy = req.query.sortBy || 'id';
        const sortOrder = req.query.sortOrder || 'DESC';

        try {
            const [results] = await connection.query(`
                SELECT *
                FROM firm_contacts
                WHERE firm_id = ?
                ORDER BY ${sortBy} ${sortOrder}
            `, [firmId]);

            if (results.length === 0) {
                return res.status(404).json({ msg: 'Firma nemá žádné kontakty.' });
            }

            res.json(results);
        } catch (error) {
            console.error('Chyba při načítání kontaktů:', error);
            res.status(500).json({ msg: 'Chyba při načítání kontaktů.' });
        }
    });

    // GET: Získání seznamu polí tabulky
    app.get('/api/contact/fields', async (req, res) => {
        try {
            const [columns] = await connection.query(`
                SHOW COLUMNS FROM firm_contacts
            `);

            const fields = columns.map(col => ({
                name: col.Field,
                type: col.Type.includes('int') ? 'number' : 'text'
            }));

            res.json({ fields });
        } catch (error) {
            console.error('Chyba při načítání polí:', error);
            res.status(500).json({ msg: 'Chyba při načítání polí.' });
        }
    });

    // POST: Přidání nového kontaktu
    app.post('/api/contact/add', async (req, res) => {
        try {
            const contact = req.body;
            delete contact.id; // Odstraníme auto-increment sloupec

            const fields = Object.keys(contact).join(', ');
            const values = Object.values(contact).map(value => `"${value}"`).join(', ');

            const query = `INSERT INTO firm_contacts (${fields}) VALUES (${values})`;
            await connection.query(query);

            res.status(200).json({ msg: 'Kontakt úspěšně přidán.' });
        } catch (error) {
            console.error('Chyba při přidávání kontaktu:', error);
            res.status(500).json({ msg: 'Chyba při přidávání kontaktu.' });
        }
    });

    // PUT: Aktualizace konkrétního kontaktu
    app.put('/api/firms/:firm_id/contacts/:contact_id', async (req, res) => {
        const { firm_id, contact_id } = req.params;
        const updatedData = req.body;

        try {
            const [result] = await connection.query(`
                UPDATE firm_contacts
                SET ?
                WHERE firm_id = ? AND id = ?
            `, [updatedData, firm_id, contact_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Kontakt nenalezen.' });
            }

            res.json({ msg: 'Kontakt byl úspěšně aktualizován.' });
        } catch (error) {
            console.error('Chyba při aktualizaci kontaktu:', error);
            res.status(500).json({ msg: 'Chyba při aktualizaci kontaktu.' });
        }
    });

    // PATCH: Aktualizace specifických polí kontaktu
    app.patch('/api/firms/:firm_id/contacts/:contact_id', async (req, res) => {
        const { firm_id, contact_id } = req.params;
        const updatedData = req.body;

        try {
            const [result] = await connection.query(`
                UPDATE firm_contacts
                SET ?
                WHERE firm_id = ? AND id = ?
            `, [updatedData, firm_id, contact_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Kontakt nenalezen.' });
            }

            res.json({ msg: 'Kontakt byl úspěšně aktualizován.' });
        } catch (error) {
            console.error('Chyba při aktualizaci kontaktu:', error);
            res.status(500).json({ msg: 'Chyba při aktualizaci kontaktu.' });
        }
    });

    // DELETE: Smazání konkrétního kontaktu
    app.delete('/api/firms/:firm_id/contacts/:contact_id', async (req, res) => {
        const { firm_id, contact_id } = req.params;

        try {
            const [result] = await connection.query(`
                DELETE FROM firm_contacts
                WHERE firm_id = ? AND id = ?
            `, [firm_id, contact_id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Kontakt nenalezen.' });
            }

            res.json({ msg: 'Kontakt byl úspěšně smazán.' });
        } catch (error) {
            console.error('Chyba při mazání kontaktu:', error);
            res.status(500).json({ msg: 'Chyba při mazání kontaktu.' });
        }
    });
}

module.exports = defineAPIContactEndpoints;
