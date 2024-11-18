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

// Funkce pro editování firmy
async function editFirmById(id) {
    try {
        const response = await fetch(`/api/firm/${id}`);
        const data = await response.json();

        if (data && data.id) {
            // Zobrazíme modal a vyplníme formulář daty firmy
            showModalWithForm(data);
        } else {
            alert('Firma nenalezena!');
        }
    } catch (error) {
        console.error('Chyba při načítání dat pro editaci firmy:', error);
    }
}

async function showModalWithForm(data) {
    const modal = document.getElementById('editModal');
    const form = modal.querySelector('form');
    const fields = await fetchFormFields();  // Načíst pole formuláře



    // Vyplnění formuláře s daty firmy
    Object.keys(fields).forEach((field, index) => {
        if (index === 0 || index === Object.keys(fields).length - 1) return;

        const input = form.querySelector(`#${field}`);
        if (input) {
            input.value = data[field] || '';  // Naplnění hodnoty vstupu
        }
    });

    modal.style.display = 'block';  // Zobrazení modalu

    // Event listener pro odeslání formuláře
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const dataToSend = {};

        formData.forEach((value, key) => {
            if (value.trim() !== '') {
                dataToSend[key] = value;
            }
        });

        try {
            const response = await fetch(`/api/firm/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                alert('Firma byla úspěšně aktualizována!');
                fetchAllFirms();  // Načíst seznam firem
            } else {
                alert('Chyba při aktualizaci firmy');
            }
        } catch (error) {
            console.error('Chyba při odesílání dat pro editaci:', error);
        }

        modal.style.display = 'none';  // Zavření modalu po odeslání
    });
}

// Načítání polí pro formulář
async function fetchFormFields() {
    try {
        const response = await fetch('/api/firm/fields');
        const data = await response.json();
        console.log('Data z API (polí formuláře):', data);
        return data.fields;  // Vracení polí formuláře
    } catch (error) {
        console.error('Chyba při načítání polí formuláře:', error);
        return {};
    }
}

function createTable(data) {
    console.log("Vytvářím tabulku pro data:", data);

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length) {
        const headers = Object.keys(data[0]);

        const headerRow = document.createElement('tr');
        headers.slice(0, -1).forEach(header => {
            const th = document.createElement('th');
            if (header === 'subject_id') {
                th.textContent = 'Subject Name';
            } else {
                th.textContent = header;
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach((item) => {
            const row = document.createElement('tr');
            headers.slice(0, -1).forEach(header => {
                const cell = document.createElement('td');
                if (header === 'subject_id') {
                    cell.textContent = item['subject_name'] !== null ? item['subject_name'] : 'N/A';
                } else {
                    cell.textContent = item[header] !== null ? item[header] : 'N/A';
                }
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
    const firmIdToDelete = document.getElementById('firmId').value;
    if (firmIdToDelete) {
        deleteFirmById(firmIdToDelete);
    } else {
        alert('Zadejte prosím ID firmy k odstranění.');
    }
});

document.getElementById('editFirmById').addEventListener('click', () => {
    const firmId = document.getElementById('firmId').value;
    if (firmId) {
        editFirmById(firmId);
    } else {
        alert('Zadejte prosím ID firmy pro editaci.');
    }
});

fetchAllFirms();
