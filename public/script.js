document
  .getElementById("generateAndUpload")
  .addEventListener("click", function () {
    const numImages = 1000;
    const imageSize = 500; // Size of the image (500x500 pixels)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const imageInput = document.getElementById("imageInput");

    canvas.width = imageSize;
    canvas.height = imageSize;

    let images = [];

    for (let i = 0; i < numImages; i++) {
      // Generate random image data
      const imageData = ctx.createImageData(imageSize, imageSize);
      const data = imageData.data;

      for (let j = 0; j < data.length; j += 4) {
        data[j] = Math.random() * 255; // Red
        data[j + 1] = Math.random() * 255; // Green
        data[j + 2] = Math.random() * 255; // Blue
        data[j + 3] = 255; // Alpha
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert canvas to Blob
      canvas.toBlob(function (blob) {
        images.push(blob);
        if (images.length === numImages) {
          // Create FormData and append images
          const formData = new FormData();
          images.forEach((blob, index) => {
            formData.append("images", blob, `image_${index + 1}.png`);
          });

          // Send images via AJAX
          fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }, "image/png");
    }
  });
