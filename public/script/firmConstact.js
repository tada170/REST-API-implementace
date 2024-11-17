document.getElementById('fetchVCard').addEventListener('click', fetchVCardData);

async function fetchVCardData() {
    const firmId = document.getElementById('firmId').value;
    const fields = document.getElementById('fields').value;

    if (!firmId) {
        alert('Zadejte prosím ID firmy.');
        return;
    }

    let url = `/api/firms/${firmId}/contact`;
    if (fields) {
        url += `?fields=${fields}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Odpověď z API:', data); // Zde vypíšeme odpověď z API do konzole

        if (response.ok) {
            displayVCardData(data);
        } else {
            alert(data.msg || 'Chyba při načítání dat');
        }
    } catch (error) {
        console.error('Chyba při načítání dat:', error);
        alert('Chyba při načítání dat');
    }
}

function displayVCardData(data) {
    const table = document.getElementById('vCardTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length > 0) {
        // Získáme názvy všech klíčů z prvního objektu pro hlavičku tabulky
        const headers = Object.keys(data[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Pro každý objekt v poli `data` vytvoříme nový řádek
        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header] !== null ? item[header] : 'N/A';
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
    } else {
        // Pokud není žádná data, přidáme informaci
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 100; // Určíme, že řádek bude mít 100 sloupců, což je víc než počet ve sloupcích
        td.textContent = 'Žádná data k zobrazení';
        row.appendChild(td);
        tbody.appendChild(row);
    }
}
