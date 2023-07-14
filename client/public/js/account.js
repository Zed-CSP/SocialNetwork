document.addEventListener("DOMContentLoaded", function () {
    const profilePic = document.querySelector("#profile-pic");
    const updatePictureButton = document.querySelector("#update-picture");
    const fileInput = document.querySelector("#upload-picture");
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'spinner-border';
    loadingSpinner.role = 'status';

    function handleUpload(event) {
        event.preventDefault();
        
        const file = fileInput.files[0];
        
        if (!file) {
            alert('No file selected');
            return;
        }

        let formData = new FormData();
        formData.append('upload-picture', file);

        updatePictureButton.disabled = true;
        updatePictureButton.appendChild(loadingSpinner);

        fetch('/api/user/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            return fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ location: data.fileUrl })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            profilePic.src = data.newPictureUrl;
            alert('Profile picture updated successfully!');
        })
        .catch(error => {
            alert(`An error occurred: ${error.message}`);
        })
        .finally(() => {
            updatePictureButton.removeChild(loadingSpinner);
            updatePictureButton.disabled = false;
        });
    }

    updatePictureButton.addEventListener("click", handleUpload);
});
