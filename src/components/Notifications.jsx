
import { useEffect, useState } from "react";

import {
collection,
query,
where,
orderBy,
onSnapshot,
} from "firebase/firestore";

import { db, auth } from "../firebase";

function Notifications() {

const [notifications,
setNotifications] =
useState([]);

useEffect(() => {

const user =
auth.currentUser;

if (!user) return;

const q = query(
collection(
db,
"notifications"
),
where(
"targetUserId",
"==",
user.uid
),
orderBy(
"createdAt",
"desc"
)
);

const unsubscribe =
onSnapshot(q, (snapshot) => {

const items =
snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

setNotifications(items);

});

return () =>
unsubscribe();

}, []);

return (

<div
style={{
background: "#0f172a",
padding: "24px",
borderRadius: "24px",
border: "1px solid #1e293b",
}}
>

<h2
style={{
marginBottom: "20px",
}}
>
🔔 Notifications
</h2>

<div
style={{
display: "flex",
flexDirection: "column",
gap: "14px",
}}
>

{notifications.length === 0 ? (

<div
style={{
color: "#94a3b8",
}}
>
No notifications yet.
</div>

) : (

notifications.map((item) => (

<div
key={item.id}
style={{
background: "#1e293b",
padding: "16px",
borderRadius: "16px",
}}
>

<p
style={{
margin: 0,
lineHeight: "1.6",
}}
>
{item.message}
</p>

</div>

))

)}

</div>

</div>

);

}

export default Notifications;
