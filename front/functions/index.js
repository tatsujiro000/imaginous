const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

// const GetConditionScore = require("./ouraAPI");
// import GetConditionScore from "../src/components/score/ouraAPI";

function formatDate(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth()+1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + '-' + m + '-' + d);
}
//N日前を求める
function getBeforeNdays(n){
  var dt = new Date();
  dt.setDate(dt.getDate()-n);
  return formatDate(dt);
}
const yesterday = getBeforeNdays(1);


// exports.fetchScore = functions.https.onRequest(async (request, response) => {
//     // try {
//     //     const db = admin.firestore()
//     //     const doc = await db.collection('health_scores').doc('fY04wBpKsSmd7mfP2KrD').get()
        
//     //     const healthScore = doc.data()
//     //     response.send(healthScore)
//     // } catch (e) {
//     //     console.error(e);
//     //     response.status(500).send(e)
//     // }

//       require('dotenv').config();
//       const Client = require('oura-cloud-api');

//       const GetConditionScore = async () => {
        
        
//         const accessToken = process.env.OURA_KEY;
        
//         try {
//             const client = new Client(accessToken);
            
//             const userInfo  = await client.getUserInfo();
//             // console.log(JSON.stringify(userInfo));
            
//             const readiness  = await client.getReadinessSummaries({ start: yesterday, end: yesterday });
//             const sleeps  = await client.getSleepSummaries({ start: yesterday, end: yesterday });
//             console.log(JSON.stringify(sleeps))

//             let todayReady = "";
//             let todaySleep = "";
//             for(const ready of readiness){
//                 todayReady = ready.score;
//             }
//             for(const sleep of sleeps){
//               todaySleep = sleep.score;
//             }
//             // let todayReady = readiness.map((readiness) => {
//             //   return JSON.stringify(readiness.score);
//             // });
//           // let todaySleep = sleeps.map((sleep) => {
//           //   return JSON.stringify(sleep.score);
//           // });
//             let todayScore = {
//               readyScore:todayReady,
//               sleepScore:todaySleep
//             };
//             // todayScore = todayScore.readyScore.concat(todayReady);
//             // todayScore = todayScore.sleepScore.concat(todaySleep);
//             return todayScore;
          
//         } catch (error) {
//             console.log(`Oh-no, error occured: ${error}`);
//         }


//     };

//     try{
//         GetConditionScore().then(todayScore => {
//           console.log("todayScore",todayScore)
//           console.log(todayScore.readyScore)
//           console.log("yesterday",getBeforeNdays(1));
          
//         response.send(todayScore)
//       })
//     }catch{
//         console.error(e);
//         response.status(500).send(e)
//     }
// });


//ScoreのCREATE
exports.scheduledFuncScore = functions.region('asia-northeast1').pubsub
    .schedule('0 4 * * *') 
    .onRun(async (context) => {

        require('dotenv').config();
        const Client = require('oura-cloud-api');

        const GetConditionScore = async () => {
          
            const accessToken = process.env.OURA_KEY;
            
            try {
              const client = new Client(accessToken);
              
              const userInfo  = await client.getUserInfo();
              // console.log(JSON.stringify(userInfo));
              
              const readiness  = await client.getReadinessSummaries({ start: yesterday, end: yesterday });//日付を動的にする
              const sleeps  = await client.getSleepSummaries({ start: yesterday, end: yesterday });
              console.log(JSON.stringify(sleeps))
  
              let todayReady = "";
              let todaySleep = "";
              for(const ready of readiness){
                  todayReady = ready.score;
              }
              for(const sleep of sleeps){
                todaySleep = sleep.score;
              }
              let todayScore = {
                readyScore:todayReady,
                sleepScore:todaySleep
              };
              return todayScore;
            
          } catch (error) {
              console.log(`Oh-no, error occured: ${error}`);
          }
        }


        const db = admin.firestore()
        GetConditionScore().then((todayScore) => {
            db.collection("health_scores").add({
              condition_score: todayScore.readyScore,
              created_at: context.timestamp,
              day:yesterday,
              id:context.eventId,
              sleep_score: todayScore.sleepScore,
              user_id:""
            })
        });
        

        console.info("毎朝4時に実行中");
        return;
    });



//EventのCREATE
exports.scheduledFuncEvent = functions.region('asia-northeast1').pubsub
    .schedule('0 4 * * *') 
    .onRun(async (context) => {

        const db = admin.firestore()
            db.collection("events").add({
              day:"",
              id:context.eventId,
              title: "aaa",
              user_id:""
            })
        

        console.info("毎朝4時に実行中");
        return;
    });