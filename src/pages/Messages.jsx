
import { useState } from "react";

function Messages() {

const [selectedUser,
setSelectedUser] =
useState(null);

const users = [
{
id: 1,
name: "Sarah"
},
{
id: 2,
name: "John"
},
{
id: 3,
name: "David"
},
];

return (

<div
style={{
background: "#020617",
minHeight: "100vh",
display: "flex",
color: "white",
}}
>

<div
style={{
width: "300px",
borderRight:
"1px solid #1e293b",
padding: "20px",
}}
>

<h2>
💬 Messages
</h2>

{users.map((user) => (

<div
key={user.id}
onClick={() =>
setSelectedUser(user)
}
style={{
padding: "16px",
marginTop: "12px",
background: "#0f172a",
borderRadius: "14px",
cursor: "pointer",
}}
>

{user.name}

</div>

))}

</div>

<div
style={{
flex: 1,
padding: "24px",
}}
>

{selectedUser ? (

<>
<h2>
Chat with {selectedUser.name}
</h2>

<p
style={{
color: "#94a3b8",
}}
>
Messaging system coming next...
</p>
</>

) : (

<h2>
Select a conversation
</h2>

)}

</div>

</div>

);

}

export default Messages;
