const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp()
// const db = admin.firestore();
require('dotenv').config();


const pushMessageToDb = (response) => {

  db.collection("messages").add({
      text: message,
      created_at: Firebase.Firestore.Timestamp.fromDate(new Date()),
      is_ai: true,
      user_id:profile.id,
  })
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
  
  //useridでチャットfirestoreに追加

  // const answerUser = query(usersData, where("", "==", ));
  // console.log(answerUser);
}


exports.post_openai = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  
  const response = await openai.createCompletion({
      model: "text-davinci-002",
      // prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nQ: Hello, who are you??\nA: I am an AI created by OpenAI. How can I help you today?\n\nQ: ${req.body.message} \nA:`,
      prompt: `私は男女間のコミュニケーションについて専門的な知識を有している会話型AIです。困ったことがあればなんでも聞いてください。あなたの友人のような友好的な態度で150字以内で回答します。\n\nQ:夫婦の会話が少ないことに悩んでいます。何か良いコミュニケーション方法があったら教えて欲しいです。\nA:お互いに相手に直して欲しいことを話し合うことはあまり知られていませんが効果的な会話です。\n\nQ: ${req.body.message} \nA:`,
      temperature: 1,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
  });
  //後で消す↓
  const ALLOWED_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
];

const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5002'
];
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(','));
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Accept,X-Custom-Header');
  //後で消す↑
  res.status(200).json({ result: response.data.choices[0].text });
  // res.status(200).json({ result: response.data });

});