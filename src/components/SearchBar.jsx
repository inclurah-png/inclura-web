
import { useState } from "react";

function SearchBar({
posts = [],
onResults,
}) {

const [query, setQuery] =
useState("");

function handleSearch(value) {

setQuery(value);

const filtered =
posts.filter((post) => {

const text =
post.text?.toLowerCase() || "";

const user =
post.userName?.toLowerCase() || "";

return (
text.includes(
value.toLowerCase()
) ||
user.includes(
value.toLowerCase()
)
);

});

onResults(filtered);

}

return (

<div
style={{
marginBottom: "24px",
}}
>

<input
type="text"
placeholder="Search posts or users..."
value={query}
onChange={(e) =>
handleSearch(
e.target.value
)
}
style={{
width: "100%",
padding: "16px",
borderRadius: "18px",
border: "1px solid #334155",
background: "#0f172a",
color: "white",
fontSize: "15px",
outline: "none",
boxSizing: "border-box",
}}
/>

</div>

);

}

export default SearchBar;
