let createRandomString = (strLen) => {
    strLen = typeof(strLen) == 'number' && strLen > 0 ? strLen : false;
    if (strLen) {
        // Define all the characters that can go into the string 
        let possibleChars = 'abcdefghijklmnoqrstuvwxyz0123456789';

        // Start the final string
        let str = '';
        for(let i=1; i <= strLen; i++) {
            // get a random character from the possible characters string.
            let randomCharacter = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
            // Append this character to the final string.
            str += randomCharacter;
        }
        return str;

    } else {
        return false;
    }
}

let form = document.getElementById('form');
form.addEventListener('submit', e => {
    e.preventDefault()
})

let login = () => {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    
    .then((data) => {
        console.log(data.user.email)        
    })
    
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        let errShow = document.getElementById('error');
        errShow.classList.remove('hidden');
        errShow.innerHTML = errorMessage;
    // ...
    });

}

let fbAuth = () => {
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider)
    .then((data) => {
        let randomString = createRandomString(20)
        let saveData = {
            'name':data.user.displayName,
            'email':data.user.email,
            'token':randomString
        }
        let firebaseSave = new Promise((res, rej) => {
            let savedData = firebase.database().ref('logins/'+data.user.uid).set(saveData);
            if (savedData) {
                res(savedData)
            } else {
                let errShow = document.getElementById('error');
                errShow.classList.remove('hidden');
                errShow.innerHTML = "Unable to update your Token.";
                rej("Error Saving Data.")
            }
        })

        firebaseSave.then((returnData) => {
            location.assign('./chat.html?id='+data.user.uid+'&'+'token='+randomString)
        }).catch(err => {
            console.log(err)
        }) 
        
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        let errShow = document.getElementById('error');
        errShow.classList.remove('hidden');
        errShow.innerHTML = errorMessage;
        // ...
      });
}

let googleAuth = () => {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((data) => {
        let randomString = createRandomString(20)
        let saveData = {
            'name':data.user.displayName,
            'email':data.user.email,
            'token':randomString
        }
        let firebaseSave = new Promise((res, rej) => {
            let savedData = firebase.database().ref('logins/'+data.user.uid).set(saveData);
            if (savedData) {
                res(savedData)
            } else {
                let errShow = document.getElementById('error');
                errShow.classList.remove('hidden');
                errShow.innerHTML = "Unable to update your Token.";
                rej("Error Saving Data.")
            }
        })

        firebaseSave.then((returnData) => {
            location.assign('./chat.html?id='+data.user.uid+'&'+'token='+randomString)
        }).catch(err => {
            console.log(err)
        }) 
        
    })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        let errShow = document.getElementById('error');
        errShow.classList.remove('hidden');
        errShow.innerHTML = errorMessage;
        // ...
    });
}