const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const db = admin.firestore();

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



let accessToken = "";

const user = db.collection('users').doc('K8Uko5DUf5eHHM4OpFxM');
const getUserInfo = () => {
  user.get().then(function(doc) {
      if (doc.exists) {
        const userInfo = doc.data();
        const ourakey = userInfo.ourakey;
        accessToken = ourakey;
        console.log("accessToken", accessToken);
        return accessToken;
      } else {
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}





// exports.fetchScore = functions.https.onRequest(async (request, response) => {
    


//         const user = db.collection('users').doc('K8Uko5DUf5eHHM4OpFxM');
//         const getUserInfo = () => {
//           user.get().then(function(doc) {
//               if (doc.exists) {
//                 const userInfo = doc.data();
//                 const ourakey = userInfo.ourakey;
//                 accessToken = ourakey;
//                 console.log("accessToken", accessToken);
//                 return accessToken;
//               } else {
//                   console.log("No such document!");
//               }
//           }).catch(function(error) {
//               console.log("Error getting document:", error);
//           });
//         }
//         getUserInfo();
        


// });


//ScoreのCREATE
exports.scheduledFuncScore = functions.region('asia-northeast1').pubsub
    .schedule('0 4 * * *') 
    .onRun(async (context) => {

        require('dotenv').config();
        const Client = require('oura-cloud-api');//oura ring API

        const GetConditionScore = async () => {

            //firestoreからkeyを取得する
            const userKey = db.collection('users').doc('K8Uko5DUf5eHHM4OpFxM');

            // const accessToken = process.env.OURA_KEY;
            const accessToken = getUserInfo();
            
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
        

        console.info("毎朝4時に実行中 score");
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
        

        console.info("毎朝4時に実行 event");
        return;
    });