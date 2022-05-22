const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


const params = {
    TableName : 'CelebrityImagesWithS3Links'
}

exports.handler = async (event) => {
    let nameAndLink = [];
    let jsonData = [];
    let name = [];
    let link = [];

    const data = await docClient.scan(params).promise();
    const item = data.Items;
    await data.Items.forEach(function(image){

        let celebName = image.CelebrityName;
        let pictureUrl = image.PictureUrl;

        // jsonData.push("name -" + JSON.stringify(celebName) + " url - " + JSON.stringify(pictureUrl));
        jsonData.push(pictureUrl);

    });



    const response = {
        statusCode: 200,
        body: JSON.stringify(jsonData)
    };

    return response;

};
