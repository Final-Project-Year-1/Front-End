document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submitButton').addEventListener('click', function() {
        const userInput = document.getElementById('userInput').value;
        const postImageInput = document.getElementById('postImageInput');
        const file = postImageInput.files[0];
  
        if (userInput) {
            if (file) {
                uploadPostWithImage(userInput, file);
            } else {
                postToFacebook(userInput);
            }
        } else {
            document.getElementById('response').innerText = 'Please enter some text.';
        }
    });
  
    document.getElementById('checkVisitorsButton').addEventListener('click', function() {
      checkVisitorsCount();
    });
  
    document.getElementById('checkFollowersButton').addEventListener('click', function() {
      checkFollowersCount();
    });
  
    document.getElementById('totalPostsButton').addEventListener('click', function() {
      checkTotalPosts();
    });
  
    document.getElementById('newMessagesButton').addEventListener('click', function() {
      checkNewMessages();
    });
  
    document.getElementById('uploadProfilePictureButton').addEventListener('click', function() {
      uploadProfilePicture();
    });
  
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', function() {
          this.classList.toggle('active');
      });
    });
  
    const accessToken = 'EAAZAbZCZAgww4UBOzSqZAlNzGV7XtXRxaXkRISQJcZA5pr67cMcceJEo82ceiql7ZAZAq1O94ZAVBY9CdWlSi8gtrsZC57SNIeIiT4ayEHcaV5BiZA4eF8aEGd5GNNnalydCazhIsu9TUTyqkR2yc0PRYDMZAqTZCzqSJHekxjWOfRWYlnp6GGkeS1GMjLZBINI5JxsVxlFLvLWBVzxx02I1IBrJEVDaloZAuyW0AONwZDZD'; // Your Page Access Token
    const page_id = '403609402826152'; 
  
    function postToFacebook(message) {
        fetch(`https://graph.facebook.com/v20.0/${page_id}/feed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                access_token: accessToken
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('response').innerText = 'Error: ' + data.error.message;
            } else {
                document.getElementById('response').innerText = 'Post was successful!';
            }
        })
        .catch(error => {
            document.getElementById('response').innerText = 'Error: ' + error;
        });
    }
  
    function uploadPostWithImage(message, file) {
        const formData = new FormData();
        formData.append('source', file);
        formData.append('message', message);
        formData.append('access_token', accessToken);
  
        fetch(`https://graph.facebook.com/v20.0/${page_id}/photos`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('response').innerText = 'Error: ' + data.error.message;
            } else {
                document.getElementById('response').innerText = 'Post with image was successful!';
            }
        })
        .catch(error => {
            document.getElementById('response').innerText = 'Error: ' + error;
        });
    }
  
    function checkVisitorsCount() {
        fetch(`https://graph.facebook.com/v20.0/${page_id}?fields=fan_count&access_token=${accessToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('visitorsCount').innerText = 'Error: ' + data.error.message;
            } else {
                document.getElementById('visitorsCount').innerText = `${data.fan_count}`;
            }
        })
        .catch(error => {
            document.getElementById('visitorsCount').innerText = 'Error: ' + error;
        });
    }
  
    function checkFollowersCount() {
        fetch(`https://graph.facebook.com/v20.0/${page_id}?fields=followers_count&access_token=${accessToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('followersCount').innerText = 'Error: ' + data.error.message;
            } else {
                document.getElementById('followersCount').innerText = `${data.followers_count}`;
            }
        })
        .catch(error => {
            document.getElementById('followersCount').innerText = 'Error: ' + error;
        });
    }
  
    function checkTotalPosts() {
        fetch(`https://graph.facebook.com/v20.0/${page_id}/posts?access_token=${accessToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('totalPostsCount').innerText = 'Error: ' + data.error.message;
            } else {
                document.getElementById('totalPostsCount').innerText = `${data.data.length}`;
            }
        })
        .catch(error => {
            document.getElementById('totalPostsCount').innerText = 'Error: ' + error;
        });
    }
  
    function checkNewMessages() {
        fetch(`https://graph.facebook.com/v20.0/${page_id}/conversations?access_token=${accessToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('newMessagesCount').innerText = 'Error: ' + data.error.message;
            } else {
                const unreadMessages = data.data.filter(conversation => conversation.unread_count > 0);
                document.getElementById('newMessagesCount').innerText = `${unreadMessages.length}`;
            }
        })
        .catch(error => {
            document.getElementById('newMessagesCount').innerText = 'Error: ' + error;
        });
    }
  
    function uploadProfilePicture() {
        const profilePictureInput = document.getElementById('profilePictureInput');
        const file = profilePictureInput.files[0];
  
        if (!file) {
            document.getElementById('uploadResponse').innerText = 'Please select a file.';
            return;
        }
  
        const formData = new FormData();
        formData.append('source', file);
        formData.append('access_token', accessToken);
  
        fetch(`https://graph.facebook.com/v20.0/${page_id}/picture`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('uploadResponse').innerText = 'Error: ' + data.error.message;
            } else {
                document.getElementById('uploadResponse').innerText = 'Profile picture updated successfully!';
            }
        })
        .catch(error => {
            document.getElementById('uploadResponse').innerText = 'Error: ' + error;
        });
    }
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const page_id = '403609402826152'; 
    const accessToken = 'EAAZAbZCZAgww4UBOzSqZAlNzGV7XtXRxaXkRISQJcZA5pr67cMcceJEo82ceiql7ZAZAq1O94ZAVBY9CdWlSi8gtrsZC57SNIeIiT4ayEHcaV5BiZA4eF8aEGd5GNNnalydCazhIsu9TUTyqkR2yc0PRYDMZAqTZCzqSJHekxjWOfRWYlnp6GGkeS1GMjLZBINI5JxsVxlFLvLWBVzxx02I1IBrJEVDaloZAuyW0AONwZDZD'; // Your Page Access Token

    // קריאה לפונקציה לקבלת כל הפוסטים
    fetchAllPosts(page_id, accessToken);

    document.getElementById('searchButton').addEventListener('click', function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        if (query) {
            searchPosts(query);
        } else {
            document.getElementById('searchResults').innerText = 'Please enter a search term.';
        }
    });
});

function fetchAllPosts(page_id, accessToken) {
    fetch(`https://graph.facebook.com/v20.0/${page_id}/posts?fields=message,attachments&access_token=${accessToken}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error: ' + data.error.message);
        } else {
            // שמירת הפוסטים במשתנה גלובלי
            window.allPosts = data.data;
            console.log('Fetched posts:', window.allPosts); // Log for debugging
        }
    })
    .catch(error => {
        console.error('Error: ' + error);
    });
}

function searchPosts(query) {
    const results = window.allPosts.filter(post => post.message && post.message.toLowerCase().includes(query));
    console.log('Search results:', results); // Log for debugging
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = ''; // ניקוי תוצאות חיפוש קודמות

    if (results.length === 0) {
        searchResultsContainer.innerText = 'No posts found.';
        return;
    }

    results.forEach(result => {
        const postElement = document.createElement('div');
        postElement.className = 'post-result';
        
        const messageElement = document.createElement('p');
        messageElement.innerText = result.message;
        postElement.appendChild(messageElement);

        if (result.attachments) {
            result.attachments.data.forEach(attachment => {
                if (attachment.type === 'photo') {
                    const imgElement = document.createElement('img');
                    imgElement.src = attachment.media.image.src;
                    imgElement.className = 'post-image';
                    postElement.appendChild(imgElement);
                }
            });
        }

        searchResultsContainer.appendChild(postElement);
    });
}