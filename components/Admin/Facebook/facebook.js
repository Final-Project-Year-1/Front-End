const page_id = '403609402826152';
let accessToken;

async function initializeFacebook() {
    try {
        const response = await fetch('http://localhost:3000/api/api-key/facebook');
        accessToken = await response.json();
        // After initializing Facebook and setting the access token, call fetchAllPosts
        await fetchAllPosts(page_id, accessToken);
    } catch (error) {
        console.error('Error initializing Facebook:', error);
    }
}

initializeFacebook();


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



document.getElementById('checkVisitorsButton').addEventListener('click', checkVisitorsCount);
document.getElementById('checkFollowersButton').addEventListener('click', checkFollowersCount);
document.getElementById('totalPostsButton').addEventListener('click', checkTotalPosts);
document.getElementById('newMessagesButton').addEventListener('click', checkNewMessages);
document.getElementById('uploadProfilePictureButton').addEventListener('click', uploadProfilePicture);
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (query) {
        searchPosts(query);
    } else {
        document.getElementById('searchResults').innerText = 'Please enter a search term.';
    }
});

document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('searchInput').value.toLowerCase().trim();
        if (query) {
            searchPosts(query);
        } else {
            document.getElementById('searchResults').innerText = 'Please enter a search term.';
        }
    }
});

async function fetchAllPosts(page_id, accessToken) {
    document.getElementById('loadingSpinner').style.display = 'block'; // הצגת הספינר

    try {
        const response = await fetch(`https://graph.facebook.com/v20.0/${page_id}/posts?fields=message,attachments,likes.summary(true)&access_token=${accessToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.error) {
            console.error('Error: ' + data.error.message);
            return;
        }

        const posts = data.data;
        for (let post of posts) {
            await fetchComments(post, accessToken);
        }
        window.allPosts = posts;
        console.log('Fetched posts with comments:', window.allPosts);
        displaySearchResults(posts); // Initial display
    } catch (error) {
        console.error('Error: ' + error);
    } finally {
        document.getElementById('loadingSpinner').style.display = 'none'; // הסתרת הספינר לאחר הטעינה
    }
}

async function fetchComments(post, accessToken) {
    try {
        const response = await fetch(`https://graph.facebook.com/v20.0/${post.id}/comments?fields=from,message&access_token=${accessToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.error) {
            console.error(`Error fetching comments for post ${post.id}: ` + data.error.message);
        } else {
            post.comments = data.data;
        }
    } catch (error) {
        console.error('Error fetching comments: ' + error);
    }
}

function searchPosts(query) {
    const results = window.allPosts.filter(post => post.message && post.message.toLowerCase().includes(query));
    console.log('Search results:', results);
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';

    if (results.length === 0) {
        searchResultsContainer.innerText = 'No posts found.';
        return;
    }

    results.forEach(result => {
        const postElement = document.createElement('div');
        postElement.className = 'post-result';

        const messageElement = document.createElement('p');
        messageElement.innerText = result.message || 'No message available';
        postElement.appendChild(messageElement);

        if (result.attachments && result.attachments.data) {
            result.attachments.data.forEach(attachment => {
                if (attachment.type === 'photo') {
                    const imgElement = document.createElement('img');
                    imgElement.src = attachment.media.image.src;
                    imgElement.className = 'post-image';
                    postElement.appendChild(imgElement);
                }
            });
        }

        const likesElement = document.createElement('p');
        likesElement.className = 'likes-count';
        likesElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1vw" height="1vw" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
            <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
        </svg> ${result.likes && result.likes.summary ? result.likes.summary.total_count : 0}`;
        postElement.appendChild(likesElement);

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => enableEdit(postElement, result.id, result.message));
        postElement.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deletePost(result.id));
        postElement.appendChild(deleteButton);

        if (result.comments && result.comments.length > 0) {
            const commentsElement = document.createElement('div');
            commentsElement.className = 'comments';
            const commentsTitle = document.createElement('h4');
            commentsTitle.innerText = 'Comments:';
            commentsElement.appendChild(commentsTitle);

            result.comments.forEach(comment => {
                if (comment.from && comment.from.name) {
                    const commentElement = document.createElement('p');
                    commentElement.innerHTML = `<strong>${comment.from.name}:</strong> ${comment.message}`;
                    commentsElement.appendChild(commentElement);
                } else {
                    const commentElement = document.createElement('p');
                    commentElement.innerText = 'Anonymous: ' + comment.message;
                    commentsElement.appendChild(commentElement);
                    console.warn('Comment without name:', comment);
                }
            });

            postElement.appendChild(commentsElement);
        }

        searchResultsContainer.appendChild(postElement);
    });
}

function enableEdit(postElement, postId, message) {
    const messageElement = postElement.querySelector('p');
    const textarea = document.createElement('textarea');
    textarea.value = message;
    postElement.insertBefore(textarea, messageElement);
    postElement.removeChild(messageElement);

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', () => updatePost(postId, textarea.value));
    postElement.appendChild(saveButton);
}

function updatePost(postId, updatedMessage) {
    fetch(`https://graph.facebook.com/v20.0/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: updatedMessage,
            access_token: accessToken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error.message);
        } else {
            alert('Post updated successfully!');
            fetchAllPosts(page_id, accessToken); // Refresh posts
        }
    })
    .catch(error => {
        alert('Error: ' + error);
    });
}

function deletePost(postId) {
    fetch(`https://graph.facebook.com/v20.0/${postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            access_token: accessToken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error.message);
        } else {
            alert('Post deleted successfully!');
            fetchAllPosts(page_id, accessToken); // Refresh posts
        }
    })
    .catch(error => {
        alert('Error: ' + error);
    });
}

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
            fetchAllPosts(page_id, accessToken); // Refresh posts
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
            fetchAllPosts(page_id, accessToken); // Refresh posts
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
    fetch(`https://graph.facebook.com/v20.0/${page_id}/conversations?fields=unread_count&access_token=${accessToken}`, {
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
            const unreadMessagesCount = data.data.reduce((sum, conversation) => sum + (conversation.unread_count || 0), 0);
            document.getElementById('newMessagesCount').innerText = `${unreadMessagesCount}`;
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

// Initial fetch of posts



const getUserFromToken = () => {
    let user = null;
    const token = localStorage.getItem("token");

    if (token) {
        const encodedObject = jwt_decode(token);
        user = encodedObject.user;
    }

    return {
        user: user,
        token: token
    };
}

if (localStorage.getItem('token') !== '') {
  const userObj = getUserFromToken();
  document.querySelector('.top-button-logged-in').style.display = 'block';
  document.querySelector('.top-button').style.display = 'none';
  document.getElementById('hello-user').textContent = `Hello ${userObj.user.firstName} ${userObj.user.lastName}`;

  if (userObj.token) {
      const decodedToken = jwt_decode(userObj.token);
      // Extract role from the decoded token if present
      const userRole = decodedToken.role || userObj.user.role;

      // Check if the user role is admin
      if (userRole && userRole === 'admin') {
          document.getElementById('admin-section').style.display = 'block';
      }
  }
}
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () =>{
    localStorage.setItem("token", "");
    window.location.href = "../../Auth/Login/login.html";
});
