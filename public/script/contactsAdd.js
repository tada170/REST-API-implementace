async function fetchFields() {
    try {
        const response = await fetch('/api/contact/fields');

        if (!response.ok) {
            throw new Error('Nepodařilo se načíst pole formuláře.');
        }

        const fieldsData = await response.json();
        console.log('Políčka formuláře:', fieldsData);

        if (!Array.isArray(fieldsData.fields)) {
            throw new Error('Odpověď není pole.');
        }

        const form = document.getElementById('contactForm');

        fieldsData.fields.forEach(field => {
            if (field.name === 'id') return;

            const div = document.createElement('div');
            div.classList.add('form-group');

            const label = document.createElement('label');
            label.textContent = field.name.charAt(0).toUpperCase() + field.name.slice(1);

            const inputElement = document.createElement('input');
            inputElement.type = field.type;
            inputElement.name = field.name;

            // Přidáme atribut `required` pouze pro pole, která nemohou být NULL
            if (!field.nullable) {
                console.log(field.name + " canot be null");
                inputElement.required = true;
            }

            div.appendChild(label);
            div.appendChild(inputElement);
            form.appendChild(div);
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Přidat kontakt';
        form.appendChild(submitButton);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Ujistíme se, že `id` není odesíláno
            delete data.id;

            try {
                const response = await fetch('/api/contact/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Kontakt přidán');
                } else {
                    alert('Chyba: ' + result.msg);
                }
            } catch (error) {
                console.error('Chyba při odesílání dat:', error);
                alert('Došlo k chybě při přidávání kontaktu.');
            }
        });
    } catch (error) {
        console.error('Chyba při načítání polí formuláře:', error);
        alert('Došlo k chybě při načítání polí formuláře.');
    }
}

fetchFields();
