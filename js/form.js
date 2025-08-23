// /public/js/form.js
import { db, serverTimestamp } from "./firebaseConfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.querySelector("#bookingForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
    status: "new",
    createdAt: serverTimestamp()
  };
  await addDoc(collection(db, "submissions"), data);
  form.reset();
  alert("Thanks! We received your request.");
});
