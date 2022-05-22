let AWS = require('aws-sdk'); // import aws-sdk
let s3 = new AWS.S3(); //import s3
let rekognition = new AWS.Rekognition(); //import aws rekognition
let uuid = require("uuid"); //import uuid for unique names of files
const docClient = new AWS.DynamoDB.DocumentClient(); //import documentClient for dynamodb

exports.handler = async (event, context) => {
    const bucketname = event.Records[0].s3.bucket.name; //get the name of triggered bucket
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')); //data in bucket

    //get images from celebrities bucket(target images)
    const data = await s3.listObjectsV2({
        Bucket: "cst3990-2021-22-celeberityimages"
    }).promise();

    //for loop to get all images in the source bucket
    const celebsImages = data.Contents;
    for (let item = 0; item < celebsImages.length; item++) {
        const imagesCelebs = celebsImages[item].Key;


        //parameters to call face comparison
        const paramsRekognition = {
            SourceImage: {
                S3Object: {
                    Bucket: "cst3990-2021-22-uploadpictures",
                    Name: key
                },
            },
            TargetImage: {
                S3Object: {
                    Bucket: "cst3990-2021-22-celeberityimages",
                    Name: imagesCelebs
                },
            },
            SimilarityThreshold: 90
        };
        let comparison = await getComparison(paramsRekognition); //call getcomaprison method to get the results

    }


};

//method to get the comparison of images from different buckets
async function getComparison(paramsRekognition) {
    //call comparefaces to compare faces
    let response = await rekognition.compareFaces(paramsRekognition).promise(); //, function(err, response) {
    //if response then compare the images
    if (response) {
        const match = response.FaceMatches; // array of matched faces in query
        match.forEach(async data => {
            let similarity = data.Similarity; //get similarity
            console.log(`The face matches with ${similarity} % similarity`); //testing purposes

            const key = uuid.v4() + paramsRekognition.TargetImage.S3Object.Name; //create a unique name to save the multiple images
            const bucketName = "cst3990-2021-22-savematchedpictures";

            //parameters to save  the image into s3
            let params = {
                Bucket: bucketName,
                CopySource: 'cst3990-2021-22-celeberityimages' + '/' + paramsRekognition.TargetImage.S3Object.Name ,
                Key: key,



            };
            //if similarity between images is more than threshold then upload the picture to another bucket in s3
            if (similarity > paramsRekognition.SimilarityThreshold) {
                //upload image to s3
                s3.copyObject(params, function(error, data) {
                    if (data) {
                        console.log("IMAGE UPLOADED SUCCESSFULLY");
                    }
                    else {
                        console.log("ERROR WITH UPLOADING THE IMAGE" + error);
                    }
                }).promise(); //return promise


                let count = 0;
                let username = "User" + (count++);
                //save the higher similarity picture's link to dynamodb

                let dynamoDBparams = {
                    TableName: "CelebrityImagesWithS3Links",
                    Item: {
                        Id: uuid.v1(),
                        CelebrityName :convert(paramsRekognition.TargetImage.S3Object.Name),
                        PictureUrl: `https://${params.Bucket}.s3.us-east-1.amazonaws.com/${key}`
                    }
                };

                await docClient.put(dynamoDBparams, function(error, data) {
                    if (error) {
                        console.log("Error" + error);
                    }
                    else {
                        console.log("Successfully uploaded pictures url tp dynamoDB" + data);
                    }
                }).promise();

            }
            // else {
            //     //if its not a match remove the picture (do not save it to s3)
            //     let delRes = await s3.deleteObject(params).promise(); //return promise
            // }
        }); // for response.faceDetails
    }




}

function convert(imageName){
    let image =  imageName.split(".")[0];
    return image;
}
