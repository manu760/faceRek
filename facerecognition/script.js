//Open connection

let api_url = "https://pdyqa3ex25.execute-api.us-east-1.amazonaws.com/prod/images";


window.onload = init();


function init() {
    getImages().then(data => {
        console.log(data);
    });
}

async function getImages() {
    try {
        let response = await fetch(api_url);
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
        let array = [];
        let imagesArray = [];
        let namesArray = [];
        for (let index = 0; index < data.length; index++) {
            if (index % 2 === 0) {
                imagesArray.push(data[index]);
                for (let image of imagesArray) {
                    imageStr = "<img src='" + image + "' height='370' width='300' alt='Celebrity images'/>  ";
                }

                document.getElementById("celebrityImages").innerHTML += imageStr;
            }
            if (index % 2 !== 0) {
                namesArray.push(data[index]);
                array.push(namesArray)

            }


        }
       document.getElementById("celebrityNames").innerHTML += namesArray;
        document.getElementById("celebrityImages").style.padding += "5px";


    } catch (err) {
        // Handle errors here
        console.log(err);
    }
}






