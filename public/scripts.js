document.addEventListener('DOMContentLoaded', () => {
    const youtubeLink = document.getElementById('youtubeLink');
    const uniqueKeyElement = document.getElementById('uniqueKey');
    const accessForm = document.getElementById('accessForm');
    const uploadFormContainer = document.getElementById('uploadFormContainer');
    const uploadForm = document.getElementById('uploadForm');

    // Generate a random unique key
    const uniqueKey = Math.floor(Math.random() * 1000000).toString();
    uniqueKeyElement.textContent = uniqueKey;

    // Set YouTube authentication link
    youtubeLink.href = `/api/auth/youtube?key=${uniqueKey}`;

    // Handle access form submission
    accessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accessKey = document.getElementById('accessKey').value;
        if (accessKey === uniqueKey) {
            uploadFormContainer.style.display = 'block';
            accessForm.style.display = 'none';
        } else {
            alert('Invalid access key');
        }
    });

    // Handle video upload form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        const response = await fetch('/api/videos/upload', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            alert('Video uploaded successfully');
        } else {
            alert('Error uploading video');
        }
    });
});
