const table = document.getElementById('dataTable');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

// Funkce pro načtení všech firem a vytvoření tabulky
async function fetchAllFirms() {
    try {
        const response = await fetch('/api/firm');
        const data = await response.json();
        createTable(data);
    } catch (error) {
        console.error('Chyba při načítání všech firem:', error);
    }
}

// Funkce pro načtení firmy podle ID a vytvoření tabulky
async function fetchFirmById(id) {
    try {
        const response = await fetch(`/api/firm/${id}`);
        const data = await response.json();
        createTable(data);
    } catch (error) {
        console.error('Chyba při načítání firmy podle ID:', error);
    }
}

// Funkce pro vytvoření tabulky s daty
function createTable(data) {
    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length) {
        // Získání klíčů
        const headers = Object.keys(data[0]);

        // Vytvoření záhlaví tabulky
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            if (header === 'subject_id') {
                th.textContent = 'Subject Name';
            } else {
                th.textContent = header;
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Vytvoření řádků tabulky
        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                if (header === 'subject_id') {
                    cell.textContent = item['subject_name'] !== null ? item['subject_name'] : 'N/A'; // Zobrazíme subject_name
                } else {
                    cell.textContent = item[header] !== null ? item[header] : 'N/A';
                }
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });

        // Remove the last column in the header
        const lastHeaderCell = thead.querySelector('tr th:last-child');
        if (lastHeaderCell) {
            lastHeaderCell.remove();
        }

        // Remove the last column in each row
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const lastCell = row.querySelector('td:last-child');
            if (lastCell) {
                lastCell.remove();
            }
        });
    }
}


// Přidání událostí pro tlačítka
document.getElementById('showAllFirms').addEventListener('click', fetchAllFirms);
document.getElementById('showFirmById').addEventListener('click', () => {
    const firmId = document.getElementById('firmId').value;
    if (firmId) {
        fetchFirmById(firmId);
    } else {
        alert('Zadejte prosím ID firmy.');
    }
});

fetchAllFirms();
