var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

// @TODO get the data using urlParams
// check if token is equal to the token saved
// if it is update the page
// if not replace the url

let userName;
let email;

let verifyAndGetData = () => {
    firebase.database().ref('logins/'+urlParams.id).once('value')
    .then((data) => {
        data = data.val()
        if (data.token == urlParams.token) {
            document.getElementById('name').innerText = data.name;
            userName = data.name;
            email = data.email;
        } else {
            document.getElementById('name').innerText = "Unable to get your data.";
            location.replace('./index.html')
        }
    }).catch(err => {
        console.log(err)
    }) 
}

verifyAndGetData()

let messageForm = document.getElementById('messageSend');
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
})

let sendMessage = () => {

    if (document.getElementById('message').value != '') {
        firebase.database().ref('messages').push().set({
            sender: userName,
            senderEmail: email,
            message: document.getElementById('message').value
        }).then(data => {
            document.getElementById('message').value = "";
            console.log(data);
        }).catch(err => {
            console.log(err)
})
    }

    return false;
}
// Listen for Incoming Request
firebase.database().ref('messages').on('child_added', (snapshot) => {
    //
    let messageList = document.getElementById("messagesList");
    let li = document.createElement('li');
    let mainDiv = document.createElement('div');
    let messageSpan = document.createElement('span');
    let senderSpan = document.createElement('span');
    mainDiv.classList.add('mesCont');
    messageSpan.classList.add('message');
    messageSpan.setAttribute('id','message-'+snapshot.key)
    let messText = document.createTextNode(snapshot.val().message);
    messageSpan.appendChild(messText);
    senderSpan.classList.add('senderName');
    let senderName = document.createTextNode(snapshot.val().sender);
    senderSpan.appendChild(senderName);
    mainDiv.appendChild(messageSpan);
    mainDiv.appendChild(senderSpan)
    li.appendChild(mainDiv);
    li.classList.add('mes')
    if (snapshot.val().senderEmail == email) {
        li.classList.add('sent')
        let button = document.createElement('button');
        let buttonText = document.createTextNode('Delete');
        button.appendChild(buttonText);
        button.classList.add('deleteButton');
        button.setAttribute('onclick','deleteMessage(this)')
        button.setAttribute('data-id', snapshot.key)
        senderSpan.appendChild(button);
    }
    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight;
})

firebase.database().ref('messages').on('child_removed', snapshot => {
    document.getElementById('message-'+snapshot.key).innerHTML = "This message has been removed.";
})

let deleteMessage = self => {
    let messageId = self.getAttribute('data-id');
    firebase.database().ref('messages/'+messageId).remove()
    self.classList.add('hidden');
}