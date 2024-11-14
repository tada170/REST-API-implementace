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
        const headers = Object.keys(data[0]);

        // Vytvoření záhlaví tabulky
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Vytvoření řádků tabulky
        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = item[header] !== null ? item[header] : 'N/A';
                row.appendChild(cell);
            });
            tbody.appendChild(row);
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
