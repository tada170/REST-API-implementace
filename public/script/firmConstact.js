document.getElementById('fetchVCard').addEventListener('click', fetchVCardData);

const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const saveChanges = document.getElementById('saveChanges');
const editForm = document.getElementById('editForm');

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

        if (response.ok) {
            displayVCardData(data, firmId);
        } else {
            alert(data.msg || 'Chyba při načítání dat');
        }
    } catch (error) {
        console.error('Chyba při načítání dat:', error);
        alert('Chyba při načítání dat');
    }
}

function displayVCardData(data, firmId) {
    const table = document.getElementById('vCardTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        const actionHeader = document.createElement('th');
        actionHeader.textContent = 'Akce';
        headerRow.appendChild(actionHeader);

        thead.appendChild(headerRow);

        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header] !== null ? item[header] : 'N/A';
                row.appendChild(td);
            });

            const actionTd = document.createElement('td');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Smazat';
            deleteButton.addEventListener('click', () => deleteContact(item.id, firmId));
            actionTd.appendChild(deleteButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editovat';
            editButton.addEventListener('click', () => openEditModal(item, firmId));
            actionTd.appendChild(editButton);

            row.appendChild(actionTd);
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 100;
        td.textContent = 'Žádná data k zobrazení';
        row.appendChild(td);
        tbody.appendChild(row);
    }
}

function openEditModal(item, firmId) {
    editForm.innerHTML = '';

    Object.keys(item).forEach(key => {
        if (key === 'id' || key === 'firm_id') return;

        const div = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = key.charAt(0).toUpperCase() + key.slice(1);

        const input = document.createElement('input');
        input.name = key;
        input.value = item[key] !== null ? item[key] : '';

        div.appendChild(label);
        div.appendChild(input);
        editForm.appendChild(div);
    });

    saveChanges.onclick = () => saveContactChanges(item.id, firmId);
    editModal.style.display = 'block';
}

async function saveContactChanges(contactId, firmId) {
    const formData = new FormData(editForm);
    const updatedData = {};
    formData.forEach((value, key) => {
        updatedData[key] = value;
    });

    try {
        const response = await fetch(`/api/firms/${firmId}/contacts/${contactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('Kontakt byl úspěšně upraven.');
            editModal.style.display = 'none';
            fetchVCardData();
        } else {
            const result = await response.json();
            alert('Chyba: ' + result.msg);
        }
    } catch (error) {
        console.error('Chyba při ukládání změn:', error);
        alert('Došlo k chybě při ukládání změn.');
    }
}

closeModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});
async function deleteContact(contactId, firmId) {
    if (!confirm('Opravdu chcete tento kontakt smazat?')) {
        return;
    }

    try {
        const response = await fetch(`/api/firms/${firmId}/contacts/${contactId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Kontakt byl úspěšně smazán.');
            fetchVCardData(); // Aktualizujeme tabulku
        } else {
            const result = await response.json();
            alert('Chyba: ' + result.msg);
        }
    } catch (error) {
        console.error('Chyba při mazání kontaktu:', error);
        alert('Došlo k chybě při mazání kontaktu.');
    }
}
