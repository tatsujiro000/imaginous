const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const db = admin.firestore();


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




//test用のfunctionです↓
// exports.fetchScore = functions.https.onRequest(async (request, response) => {

//   let accessToken = "";
//   let userId = "";

//   // oura ring API
//   const Client = require('oura-cloud-api');

//   const GetConditionScore = async () => {
    
//     try {
//       const client = new Client(accessToken);

//       const userInfo  = await client.getUserInfo();
//       console.log("apiの通信自体はOK", userInfo);

                    
//       const readiness  = await client.getReadinessSummaries({ start: yesterday, end: yesterday });
//       const sleeps  = await client.getSleepSummaries({ start: yesterday, end: yesterday });

//       let todayReady = "";
//       let todaySleep = "";
//       for(const ready of readiness){
//           todayReady = ready.score;
//       }
//       for(const sleep of sleeps){
//         todaySleep = sleep.score;
//       }
//       let todayScore = {
//         readyScore: todayReady,
//         sleepScore: todaySleep
//       };
//       console.info("score取得全体がOK");
//       return todayScore;
    
//     } catch (error) {
//         console.log(`Oh-no, error occured: ${error}`);
//     }
//   }


//   db.collection("users").get().then((querySnapshot) => {

//       querySnapshot.forEach(userSnapshot => {
//           const user = userSnapshot.data()
//           if (user.ourakey) {
//             accessToken = user.ourakey;
//             console.log("accessToken", accessToken);
//             userId = user.id;
//             console.log("userId", userId);
//           }

//           GetConditionScore()
//             .then((todayScore) => {
//               db.collection("health_scores").add({
//                 condition_score: todayScore.readyScore,
//                 // created_at: context.timestamp,
//                 day:yesterday,
//                 // id:context.eventId,
//                 sleep_score: todayScore.sleepScore,
//                 user_id: userId,
//               })
//             })
//             .then(
//               console.info("全部うまくいったよ〜")
//             );
//           return;
//       })

//   });
// });


//ScoreのCREATE
exports.scheduledFuncScore = functions.region('asia-northeast1').pubsub
    .schedule('0 4 * * *') 
    .timeZone('Asia/Tokyo')
    .onRun(async (context) => {

        let accessToken = "";
        let userId = "";

        // oura ring API
        const Client = require('oura-cloud-api');

        const GetConditionScore = async () => {
          
          try {
            const client = new Client(accessToken);

            const userInfo  = await client.getUserInfo();
            console.log("apiの通信自体はOK", userInfo);

                          
            const readiness  = await client.getReadinessSummaries({ start: yesterday, end: yesterday });
            const sleeps  = await client.getSleepSummaries({ start: yesterday, end: yesterday });

            let todayReady = "";
            let todaySleep = "";
            for(const ready of readiness){
                todayReady = ready.score;
            }
            for(const sleep of sleeps){
              todaySleep = sleep.score;
            }
            let todayScore = {
              readyScore: todayReady,
              sleepScore: todaySleep
            };
            console.info("score取得全体がOK");
            return todayScore;
          
          } catch (error) {
              console.log(`Oh-no, error occured: ${error}`);
          }
        }


        db.collection("users").get().then((querySnapshot) => {

            querySnapshot.forEach(userSnapshot => {
                const user = userSnapshot.data()
                if (user.ourakey) {
                  accessToken = user.ourakey;
                  console.log("accessToken", accessToken);
                  userId = user.id;
                  console.log("userId", userId);
                }

                GetConditionScore()
                  .then((todayScore) => {
                    db.collection("health_scores").add({
                      condition_score: todayScore.readyScore,
                      created_at: context.timestamp,
                      day: yesterday,
                      id: context.eventId,
                      sleep_score: todayScore.sleepScore,
                      user_id: userId,
                    })
                  })
                  .then(
                    console.info("ほぼ全部うまくいったよ〜")
                  );
                return;
            })

        });


    });



//EventのCREATE
exports.scheduledFuncEvent = functions.region('asia-northeast1').pubsub
    .schedule('0 4 * * *')
    .timeZone('Asia/Tokyo')
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