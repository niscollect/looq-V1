// const imageUploaded = document.getElementById('imageUploaded');

const dlt = document.getElementById("testing");

dlt.addEventListener("click", async () => {
  await fetch("/dlt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ triggeredBy: "frontend" }), // optional
  })
    .then((response) => response.json())
    .then((data) => console.log("Backend says:", data.message))
    .catch((error) => console.error("Error:", error));
});

const uplaod = document
  .getElementById("imageUpload")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    console.log("----------");

    const uploadResponse = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    console.log("Upload done:", uploadData);

    // ✅ Now fetch /urlData only after upload is done
    const urlResponse = await fetch("/urlData");
    const urlData = await urlResponse.json();
    console.log("Fetched urlData after upload:", urlData);

    //* add the images now
    await addItems(urlData);
  });

async function addItems(imageURLArray) {
  const container = document.getElementById("products_grid");
  container.innerHTML = ""; // Clear any existing content

  imageURLArray.forEach((imgURL) => {
    // Create the outer card
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.setAttribute("onclick", `viewProduct("${imgURL}")`);

    // Image wrapper
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("product-image");

    const img = document.createElement("img");
    img.src = imgURL;
    img.alt = "Product image";

    imgWrapper.appendChild(img);

    // Price section (dummy for now)
    const priceDiv = document.createElement("div");
    priceDiv.classList.add("product-price");
    priceDiv.textContent = "₹499"; // static price

    // Assemble the card
    card.appendChild(imgWrapper);
    card.appendChild(priceDiv);

    container.appendChild(card);
  });
}

// async function addTags(tagData)
// {

// }

// Product view functionality
function viewProduct(productURL) {
  console.log("Product clicked:", productURL);
  window.open(productURL, "_blank");
  // Add your product view logic here
}
