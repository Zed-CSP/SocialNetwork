document.querySelector('form').addEventListener('submit', function(event) {
    
    event.preventDefault();

    // Gather the form data
    let formData = new FormData(event.target);

    console.log(formData, 'formData');

    // Convert FormData to an object
    let post = Object.fromEntries(formData.entries());


    fetch('/api/user/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        return window.location.replace('/dashboard');
    })
    .catch(error => {
        console.error('There was an error:', error);
    });
});
