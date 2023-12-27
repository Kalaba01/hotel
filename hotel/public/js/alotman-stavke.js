function noviRed() {
    const tableBody = document.querySelector('tbody');
    const newRow = document.createElement('tr');
    const columns = ['stavke_id', 'tip_sobe', 'broj_soba', 'zaglavlje_id'];

    columns.forEach(column => {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.name = `${column}[]`;
        cell.appendChild(input);
        newRow.appendChild(cell);
    });

    tableBody.appendChild(newRow);
}

function sacuvajJSON() {
    const data = {
        stavke_id: [],
        tip_sobe: [],
        broj_soba: [],
        zaglavlje_id: [],
    };

    const inputs = document.querySelectorAll('thead input, tbody input');

    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
    });

    if (!isValid) {
        window.location.reload();
        return;
    }

    inputs.forEach((input, index) => {
        const columnName = input.name.replace('[]', '');
        data[columnName].push(input.value);
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/alotman/sacuvaj-stavke', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Podaci su uspešno sačuvani u bazi.');
            window.location = "http://localhost:5000/alotman/poruka";
        } else {
            console.error('Došlo je do greške pri čuvanju podataka u bazi.');
        }
    };

    xhr.send(JSON.stringify(data));
}