// Assuming you have elements with these classes in your HTML
const likeButtons = document.querySelectorAll('.like-button');

// Attach event listeners to like buttons
likeButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const postId = this.dataset.postId; 
    const likeCountElement = document.querySelector(`.likes-count[data-post-id="${postId}"]`);

    fetch(`/api/user/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ like: !this.classList.contains('liked') }) // Send whether the user is liking or unliking the post
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (this.classList.contains('liked')) {
          this.classList.remove('liked');
          // Decrease likes count
          likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
        }
        else {
          this.classList.add('liked');
          // Increase likes count
          likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
        }
      }
    })
    .catch(error => console.error('Error:', error));
  });
});

const commentButtons = document.querySelectorAll('.comment-button');
const commentInputs = document.querySelectorAll('.comment-input');
const commentSubmitButtons = document.querySelectorAll('.comment-input .btn');

commentButtons.forEach(button => {
  button.addEventListener('click', function(e) {
      e.preventDefault();
      const postId = this.dataset.postId;

      // Find the comment input field and toggle its visibility
      const commentInput = Array.from(commentInputs).find(input => input.dataset.postId === postId);
      commentInput.classList.toggle('show-input');  // Toggle the visibility using a class

      // toggle its visibility
      const commentsSection = document.querySelector(`#comments-${postId}`);
      commentsSection.classList.toggle('show-comments');
  });
});






commentSubmitButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();

    // Find the closest parent 
    const commentInputField = this.closest('.comment-input');

    const postId = commentInputField.dataset.postId;
    const comment = commentInputField.querySelector('input').value;

    if (comment) {
      fetch(`api/user/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // If successful, create a new comment element
          const commentElement = document.createElement('div'); 
          console.log(data, 'data in feed.js');

          // Create the username element
          const usernameElement = document.createElement('strong');
          usernameElement.textContent = data.comment.username;

          // Create the text node for the colon and the comment content
          const textNode = document.createTextNode(`: ${data.comment.content}`);

          // Append the username element and the text node to the comment element
          commentElement.appendChild(usernameElement);
          commentElement.appendChild(textNode);

          // Append the new comment to the comments section
          document.querySelector('#comments-' + postId).appendChild(commentElement); 
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });
});

