require('dotenv').config();
const Client = require('oura-cloud-api');

const GetConditionScore = async () => {
    
    
    const accessToken = process.env.OURA_KEY;
    
    try {
        const client = new Client(accessToken);
        
        const userInfo  = await client.getUserInfo();        
        const sleeps  = await client.getReadinessSummaries({ start: '2022-07-23', end: '2022-07-25' });

        const conditionScore = sleeps.map((sleep) => {

            return JSON.stringify(sleep.score);
        
        });
        return conditionScore;
       
    } catch (error) {
        console.log(`Oh-no, error occured: ${error}`);
    }


};

export default GetConditionScore;


