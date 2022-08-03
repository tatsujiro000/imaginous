import { collection, addDoc } from "firebase/firestore";

const FirestoreAPI = async (db) => { 
// Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "health_scores"), {
    condition_score: "11",
    id:"2",
    sleep_score:"12",
    user_id:"2"
  });
  console.log("Document written with ID: ", docRef.id);

  return (
    <p>aaaaa</p>
  )
}

export default FirestoreAPI;
