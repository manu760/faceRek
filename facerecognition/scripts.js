//Open connection
//let connection = new WebSocket("wss://9ekmfzaz8b.execute-api.us-east-1.amazonaws.com/prod");
let api_url = "https://pdyqa3ex25.execute-api.us-east-1.amazonaws.com/prod/image";


window.onload = init();


function init() {
   getImage().then(data => {
       console.log(data);
   });

//Log connected response
//     connection.onopen = function (event) {
//         console.log("Connected: " + JSON.stringify(event));
//         sendMessage();
//     };

}
//'https://api.allorigins.win/raw?url=' +
async function getImage() {
    try {
        let response = await fetch(api_url);
        //
        //     method: 'GET',
        //     mode: 'cors',
        //
        //     headers: {
        //         'Access-Control-Allow-Methods': 'GET,OPTIONS',
        //         'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        //         'Access-Control-Allow-Origin': '*'
        //     }
        // });

        let data = await response.json();
        let imageStr = "";
        console.log(data);
        console.log("IMAGE " + data);
        imageStr = "<img src='" + data[0] + "' height='600' width='600' alt='Celebrity images'/>";

        let name = data[1];
        document.getElementById("images").innerHTML += imageStr;
        document.getElementById("celebrityName").innerHTML = name;
    } catch (err) {
        // Handle errors here
        console.log(err);

    }
}


//Output messages from the server
connection.onmessage = function (msg) {
    let message = msg.data;
    let array = JSON.parse(message);
    console.log(array);
   // document.getElementById("celebrityName").innerHTML =  "Katty-Perry";
    // console.log(JSON.stringify(message));
    console.log("Message received.");

}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error));
}

//Send message to server
function sendMessage() {

    //Create message to be sent to server
    let msgObject = {
        action: "sendMessage",//Used for routing in API Gateway
        data: ""
    };

    //Send message
    connection.send(JSON.stringify(msgObject));

    //Log result
    console.log("Message sent: " + JSON.stringify(msgObject));
}


