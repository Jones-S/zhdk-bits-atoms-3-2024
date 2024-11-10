async function fetchData() {
  const url = "./data.json";
  let response = await fetch(url);

  if (response.ok) {
    let json = await response.json();
    console.log("Finally received the response:");
    console.log("Response: ", json);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

fetchData();
