document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const productName = document.getElementById('productName').value.trim();
    const productImage = document.getElementById('productImage').files[0];
    const messageDiv = document.getElementById('message');

    if (!productName || !productImage) {
        messageDiv.textContent = 'Por favor, completa todos los campos.';
        messageDiv.classList.add('text-red-500');
        return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productImage', productImage);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = `Imagen subida exitosamente: ${result.message}`;
            messageDiv.classList.remove('text-red-500');
            messageDiv.classList.add('text-green-500');
        } else {
            messageDiv.textContent = `Error: ${result.message}`;
            messageDiv.classList.add('text-red-500');
        }
    } catch (error) {
        messageDiv.textContent = 'Error al subir la imagen.';
        messageDiv.classList.add('text-red-500');
    }
});