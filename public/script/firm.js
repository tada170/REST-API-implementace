const table = document.getElementById('dataTable');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

async function fetchAllFirms() {
    try {
        const response = await fetch('/api/firm');
        const data = await response.json();
        createTable(data);
    } catch (error) {
        console.error('Chyba při načítání všech firem:', error);
    }
}

async function fetchFirmById(id) {
    try {
        const response = await fetch(`/api/firm/${id}`);
        const data = await response.json();

        console.log("Odpověď z API:", data);

        if (data && data.id) {
            createTable([data]);
            console.log("Tabulka byla vytvořena pro data:", data);
        } else {
            console.log("Data pro firmu nejsou k dispozici.");
        }
    } catch (error) {
        console.error('Chyba při načítání firmy podle ID:', error);
    }
}

async function deleteFirmById(id) {
    try {
        const response = await fetch(`/api/firm/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Firma byla úspěšně smazána!');
            fetchAllFirms();  // Znovu načíst seznam firem
        } else {
            alert('Chyba při mazání firmy.');
        }
    } catch (error) {
        console.error('Chyba při mazání firmy:', error);
        alert('Chyba při mazání firmy.');
    }
}

function createTable(data) {
    console.log("Vytvářím tabulku pro data:", data);

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length) {
        const headers = Object.keys(data[0]);
        console.log("Sloupce (hlavičky) tabulky:", headers);

        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header === 'subject_id' ? 'Subject Name' : header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach((item, index) => {
            console.log(`Přidávám řádek pro firmu číslo ${index + 1}:`, item);
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = item[header] !== null ? item[header] : 'N/A';
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    } else {
        console.log("Data nejsou k dispozici nebo jsou prázdná.");
    }
}

document.getElementById('showAllFirms').addEventListener('click', fetchAllFirms);
document.getElementById('showFirmById').addEventListener('click', () => {
    const firmId = document.getElementById('firmId').value;
    if (firmId) {
        fetchFirmById(firmId);
    } else {
        alert('Zadejte prosím ID firmy.');
    }
});

document.getElementById('deleteFirmById').addEventListener('click', () => {
    const firmIdToDelete = document.getElementById('firmIdToDelete').value;
    if (firmIdToDelete) {
        deleteFirmById(firmIdToDelete);
    } else {
        alert('Zadejte prosím ID firmy k odstranění.');
    }
});

fetchAllFirms();
