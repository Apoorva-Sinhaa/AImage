const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

// const B = typeof browser !== 'undefined' ? browser : chrome;
// const B = _((()=>browser), (()=>self.browser))

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};
const generateAiImages = async (userPrompt, imgQuantity) => {
  const { data } = await response.json();
  console.log("AI Image Data:", data);
  try {
    // const response = await fetch("https://api.openai.com/v1/images/generations", {
    //     method:'POST',
    //     headers:{
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${OPENAI_API_KEY}`

    //     },
    const response = await fetch("http://localhost:5000/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt, n: imgQuantity }),

      // body: JSON.stringify({
      //     prompt: userPrompt,
      //     n:parseInt(imgQuantity),
      //     size:"512x512",
      //     response_format: "b64_json"

      // }),
    });
    if (!response.ok)
      throw new Error("Failed to generate images! Please try again.");
    const { data } = await response.json();

    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  const userPrompt = e.srcElement[0].value;
  const imgQuantity = e.srcElement[1].value;

  const imgCardMarkup = Array.from(
    { length: imgQuantity },
    () =>
      `<div class="img-card loading ">
    <img src="assets/loading icon.png" alt="image">
    <a href="#" class="download-btn">
        <img src="assets/download-icon.png" alt="download icon">
    </a>
    </div>`
  ).join("");
  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, imgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
