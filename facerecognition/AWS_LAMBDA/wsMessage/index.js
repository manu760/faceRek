//Import external library with websocket functions
let ws = require('websocket');
const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

//Hard coded domain name and stage - use when pushing messages from server to client
let domainName = "9ekmfzaz8b.execute-api.us-east-1.amazonaws.com";
let stage = "prod";

exports.handler = async (event) => {

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));



    try{

        let msgString = {
            data: key.slice(36)
        };

        let msg = JSON.stringify(msgString);
        console.log(msg);




        //Get promises to send messages to connected clients
        let sendMsgPromises = await ws.getSendMessagePromises(msg, domainName, stage);

        //Execute promises
        await Promise.all(sendMsgPromises);
    }
    catch(err){
        return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
};
