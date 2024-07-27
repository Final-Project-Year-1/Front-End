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

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});
const accessToken = 'EAAZAbZCZAgww4UBO8RRRK3EY5OiF6cnXtXan2ZA1uNcctD1k34V8Dittt5ZBaWXTmoakLLdNXw0gdMptE4QVL0DoiBNZAfZBpLwjkIT3ZA9tbzCvlIUeaPboCU77MaNZBLnPEZCm7MZBJlbIolxeFkeq7M5ddPzX9d6ZAPOvPUsAfdnhpTp8b4C8MPnm47LBBZC2ZCuEq2B8ZAkPHbZAVuwCb6aKNp6QZB0HTnAEhN2zA'; // Your Page Access Token


  function postToFacebook(message) {
      const page_id = '403609402826152'; // Your Page ID

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
      const page_id = '403609402826152'; // Your Page ID

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
      const page_id = '403609402826152'; // Your Page ID

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
    const page_id = '403609402826152'; // Your Page ID

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
  const page_id = '403609402826152'; // Your Page ID

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


});

