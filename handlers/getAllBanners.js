const {DynamoDBClient, ScanCommand} = require('@aws-sdk/client-dynamodb');

const dynamoDBClient = new DynamoDBClient({region: 'us-east-1'});

exports.getAllBanners = async (event) => {
    try {
        const tableName = process.env.DYNAMODB_TABLE;
        const scanCommand = new ScanCommand({ TableName: tableName });
        const {Items} = await dynamoDBClient.send(scanCommand);
        if(!Items || Items.length === 0){
            return {
                statusCode: 404,
                body: JSON.stringify({error: 'No banners found'}),
            }
        }
        const banners = Items.map(item => item.imageUrl.S);
        return {
            statusCode: 200,
            body: JSON.stringify({banners}),
        }
    }catch(error){
        console.error('Error fetching banners:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: error.message}),
        }
    }
}