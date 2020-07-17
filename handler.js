const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const axios = require("axios");

module.exports.getPocket = async (event) => {
  try {
    const getS3KeyParams = {
      Bucket: "pocket-key",
      Key: "pocketKey.json",
    };

    let key = await s3.getObject(getS3KeyParams).promise();
    let apiKey = JSON.parse(key.Body.toString("utf-8")).key;

    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: `${apiKey}&tag=dev`,
      url: "https://getpocket.com/v3/get",
    };
    let {
      data: { list },
    } = await axios(options);

    const putS3ObjectParams = {
      Bucket: "pocket-list",
      Key: "articles.json",
      Body: JSON.stringify(list),
    };
    return await s3.putObject(putS3ObjectParams).promise();
  } catch (error) {
    console.log(error);
    return;
  }
};
