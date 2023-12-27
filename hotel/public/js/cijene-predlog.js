function checkFiles() {
    const fileInputCjenovnik = document.getElementById('cjenovnikFileInput');
    const fileInputStavke = document.getElementById('stavkeFileInput');

    if (fileInputCjenovnik.files.length > 0 && fileInputStavke.files.length > 0) {
        const formData = new FormData();
        formData.append('cjenovnik', fileInputCjenovnik.files[0], fileInputCjenovnik.files[0].name);
        formData.append('stavke', fileInputStavke.files[0], fileInputStavke.files[0].name);

        fetch('/cijene/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Server odgovor:', data);
                window.location = "/cijene/predlog/poruka";
            })
            .catch(error => {
                console.error('Greška pri slanju fajlova:', error);
            });
    }
}