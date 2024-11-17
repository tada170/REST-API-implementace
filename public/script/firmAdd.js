async function fetchFormFields() {
    try {
        const response = await fetch('/api/firm/fields');
        const data = await response.json();
        console.log('Data z API (polí formuláře):', data);  // Vypíše data, která přijdou z API
        createForm(data); // Vytvoření formuláře na základě polí
    } catch (error) {
        console.error('Chyba při načítání polí formuláře:', error);
    }
}

function createForm(fields) {
    const form = document.getElementById('form');
    form.innerHTML = ''; // Vymažeme případný existující obsah formuláře

    console.log('Vytvářím formulář pro tato pole:', fields); // Vypíše data, podle kterých bude formulář tvořen

    // Iterujeme přes všechny pole a vytváříme pro ně textová pole
    Object.keys(fields).forEach((field, index) => {
        console.log('Zpracovávám pole:', field);  // Vypíše, jaké pole právě zpracováváme
        // Smažeme první a poslední sloupec
        if (index === 0 || index === Object.keys(fields).length - 1) return;

        const label = document.createElement('label');
        label.textContent = field;

        const input = document.createElement('input');
        input.type = 'text';
        input.name = field;
        input.id = field;
        input.value = fields[field] !== null ? fields[field] : ''; // Pokud je hodnota null, nastavíme prázdné pole

        const div = document.createElement('div');
        div.classList.add('form-group'); // Přidáme CSS třídu
        div.appendChild(label);
        div.appendChild(input);

        form.appendChild(div);
    });

    // Přidáme tlačítko pro odeslání formuláře
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Uložit firmu';
    submitButton.classList.add('submit-btn'); // Přidáme CSS třídu pro tlačítko
    form.appendChild(submitButton);

    // Přidáme event listener pro odeslání formuláře
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Zamezíme standardnímu odeslání formuláře

        const formData = new FormData(form);
        const dataToSend = {};

        formData.forEach((value, key) => {
            // Odesíláme pouze pole, která nejsou prázdná
            if (value.trim() !== '') {
                dataToSend[key] = value;  // Odeslat pouze vyplněná pole
            }
        });

        console.log('Odesílám následující data:', dataToSend);  // Vypíše data, která budou odeslána

        try {
            const response = await fetch('/api/firm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend), // Odesíláme pouze pole, která nejsou prázdná
            });

            const result = await response.json();
            console.log('Odpověď z backendu:', result);  // Vypíše odpověď, kterou dostaneme zpět od serveru
            if (response.ok) {
                alert('Firma byla úspěšně přidána!');
            } else {
                alert('Chyba při přidávání firmy');
            }
        } catch (error) {
            console.error('Chyba při odesílání dat:', error);
            alert('Chyba při odesílání dat');
        }
    });
}

// Volání funkce pro získání polí a vytvoření formuláře
fetchFormFields();
