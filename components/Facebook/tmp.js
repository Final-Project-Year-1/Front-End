document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submitButton').addEventListener('click', function() {
      const userInput = document.getElementById('userInput').value;
      if (userInput) {
          postToFacebook(userInput);
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
const accessToken = 'EAAZAbZCZAgww4UBOxCHevJ1HYMlxw9DtZBHA47ZBpTeqHL13fH3WcZA7VVndiJZCprRtzWgCPCYMQKc6NLomB9HEJ4ecC7XUBN0T7YYuDJXPFnqnnbHtQTkiYzwzIQdsTdluna0zaCeFrmraQGtuTPqbNgxW5xvaYdW97UHHGrdnPPrEcEQZBjGZBs1R15fchrejLX3LM9lqhDfvPsM2lkEdx3mZA1MTVoZAGlc'; // Your Page Access Token
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

