const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

// Update image cards with generated images
const updateImageCard = (imgUrls) => {
  imgUrls.forEach((imgUrl, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    imgElement.src = imgUrl;
    imgElement.onload = () => {
      imgCard.classList.remove("loading");

      // Enable actual download functionality
      fetch(imgUrl)
        .then(res => res.blob())
        .then(blob => {
          const imageBlobUrl = URL.createObjectURL(blob);
          downloadBtn.setAttribute("href", imageBlobUrl);
          downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        });
    };
  });
};

// Generate AI images using Pollinations API
const generateAiImages = async (userPrompt, imgQuantity) => {
  try {
    const imgUrls = [];

    for (let i = 0; i < imgQuantity; i++) {
      // Direct Pollinations endpoint (no key needed)
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(userPrompt)}-${i}`;
      imgUrls.push(imgUrl);
    }

    updateImageCard(imgUrls);
  } catch (error) {
    alert("Error generating images. Please try again.");
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
  }
};

// Handle form submission
const handleFormSubmission = (e) => {
  e.preventDefault();
  const userPrompt = e.srcElement[0].value.trim();
  const imgQuantity = parseInt(e.srcElement[1].value) || 1;

  if (!userPrompt) return alert("Please enter a prompt!");

  // Create placeholders while loading
  const imgCardMarkup = Array.from({ length: imgQuantity }, () => `
    <div class="img-card loading">
      <img src="assets/loading icon.png" alt="image">
      <a href="#" class="download-btn">
        <img src="assets/download-icon.png" alt="download icon">
      </a>
    </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;

  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating...";

  generateAiImages(userPrompt, imgQuantity);
};

// Listen for form submission
generateForm.addEventListener("submit", handleFormSubmission);
