

// import React, { useState } from 'react';

// const ImageUploader = () => {
//   const initialLabels = [
//     "Add a photo",
//     "Cover photo",
//     "Front",
//     "Back",
//     "Side",
//     "Label",
//     "Details",
//     "Flaw"
//   ];

//   const [images, setImages] = useState(Array(8).fill([]));
//   const [labels, setLabels] = useState(initialLabels);
//   const [enabledBoxes, setEnabledBoxes] = useState(1); 

//   const handleImageChange = (e, index) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const newImages = [...images];
//       newImages[index] = files.map(file => URL.createObjectURL(file));
//       setImages(newImages);

//       if (index + 1 < initialLabels.length) {
//         const newLabels = [...labels];
//         newLabels[index + 1] = "Add a photo";
//         setLabels(newLabels);
//         setEnabledBoxes(index + 2); 
//       }
//     }
//   };

//   const handleRemoveImage = (index, imgIndex) => {
//     const newImages = [...images];
//     newImages[index] = newImages[index].filter((_, i) => i !== imgIndex);
//     setImages(newImages);

//     if (newImages[index].length === 0 && index + 1 < initialLabels.length) {
//       const newLabels = [...labels];
//       newLabels[index + 1] = initialLabels[index + 1];
//       setLabels(newLabels);
//       setEnabledBoxes(index + 1);
//     }
//   };

//   return (
//     <div className="upload__box">
//       <div className="upload__img-wrap">
//         {images.map((imgArr, index) => (
//           <div key={index} className={`upload__img-box ${index >= enabledBoxes ? 'disabled' : ''}`}>
//             {imgArr.length > 0 ? (
//               imgArr.map((img, imgIndex) => (
//                 <div key={imgIndex} className="img-bg" style={{ backgroundImage: `url(${img})` }}>
//                   <div className="upload__img-close" onClick={() => handleRemoveImage(index, imgIndex)}></div>
//                 </div>
//               ))
//             ) : (
//               <label className="upload__btn">
//                 {labels[index] === "Add a photo" && (
//                   <div className="upload__icon">
//                     <i className="bi bi-camera-fill"></i>
//                   </div>
//                 )}
//                 <p>{labels[index]}</p>
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageChange(e, index)}
//                   className="upload__inputfile"
//                   multiple
//                   disabled={index >= enabledBoxes} 
//                 />
//               </label>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;




// import React, { useState } from 'react';

// const ImageUploader = () => {
//   const initialLabels = [
//     "Add a photo",
//     "Cover photo",
//     "Front",
//     "Back",
//     "Side",
//     "Label",
//     "Details",
//     "Flaw"
//   ];

//   const [images, setImages] = useState(Array(8).fill([]));
//   const [labels, setLabels] = useState(initialLabels);
//   const [enabledBoxes, setEnabledBoxes] = useState(1); 

//   const handleImageChange = (e, index) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const newImages = [...images];

//       // Process each selected file to occupy the next available box
//       files.forEach((file, i) => {
//         const boxIndex = index + i;
//         if (boxIndex < initialLabels.length) {
//           newImages[boxIndex] = [URL.createObjectURL(file)];
          
//           // Update label and enable the next box
//           const newLabels = [...labels];
//           newLabels[boxIndex] = `${i + 1} image${i > 0 ? 's' : ''}`; // Update label to show number of images
//           setLabels(newLabels);

//           if (boxIndex + 1 < initialLabels.length) {
//             newLabels[boxIndex + 1] = "Add a photo"; // Reset label for the next box
//             setLabels(newLabels);
//             setEnabledBoxes(boxIndex + 2); // Enable the next box
//           }
//         }
//       });

//       setImages(newImages);
//     }
//   };

//   const handleRemoveImage = (index, imgIndex) => {
//     const newImages = [...images];
//     newImages[index] = newImages[index].filter((_, i) => i !== imgIndex);
//     setImages(newImages);

//     if (newImages[index].length === 0 && index + 1 < initialLabels.length) {
//       const newLabels = [...labels];
//       newLabels[index + 1] = initialLabels[index + 1];
//       setLabels(newLabels);
//       setEnabledBoxes(index + 1);
//     }
//   };

//   return (
//     <div className="upload__box">
//       <div className="upload__img-wrap">
//         {images.map((imgArr, index) => (
//           <div key={index} className={`upload__img-box ${index >= enabledBoxes ? 'disabled' : ''}`}>
//             {imgArr.length > 0 ? (
//               imgArr.map((img, imgIndex) => (
//                 <div key={imgIndex} className="img-bg" style={{ backgroundImage: `url(${img})` }}>
//                   <div className="upload__img-close" onClick={() => handleRemoveImage(index, imgIndex)}></div>
//                 </div>
//               ))
//             ) : (
//               <label className="upload__btn">
//                 {labels[index] === "Add a photo" && (
//                   <div className="upload__icon">
//                     <i className="bi bi-camera-fill"></i>
//                   </div>
//                 )}
//                 <p>{labels[index]}</p>
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageChange(e, index)}
//                   className="upload__inputfile"
//                   multiple
//                   disabled={index >= enabledBoxes} 
//                 />
//               </label>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;


// import React, { useState } from 'react';

// const ImageUploader = () => {
//   const initialLabels = [
//     "Add a photo",
//     "Cover photo",
//     "Front",
//     "Back",
//     "Side",
//     "Label",
//     "Details",
//     "Flaw"
//   ];

//   const [images, setImages] = useState(Array(8).fill([]));
//   const [labels, setLabels] = useState(initialLabels);
//   const [enabledBoxes, setEnabledBoxes] = useState(1); 

//   const handleImageChange = (e, index) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const newImages = [...images];

//       // Process each selected file to occupy the next available box
//       files.forEach((file, i) => {
//         const boxIndex = index + i;
//         if (boxIndex < initialLabels.length) {
//           newImages[boxIndex] = [URL.createObjectURL(file)];
          
//           // Update label and enable the next box
//           const newLabels = [...labels];
//           newLabels[boxIndex] = `${i + 1} image${i > 0 ? 's' : ''}`; // Update label to show number of images
//           setLabels(newLabels);

//           if (boxIndex + 1 < initialLabels.length) {
//             newLabels[boxIndex + 1] = "Add a photo"; // Reset label for the next box
//             setLabels(newLabels);
//             setEnabledBoxes(boxIndex + 2); // Enable the next box
//           }
//         }
//       });

//       setImages(newImages);
//     }
//   };

//   const handleRemoveImage = (index, imgIndex) => {
//     const newImages = [...images];
//     newImages[index] = newImages[index].filter((_, i) => i !== imgIndex);
//     setImages(newImages);

//     // Shift images left to fill the gap left by removed image
//     for (let i = index + 1; i < newImages.length; i++) {
//       if (newImages[i].length > 0) {
//         newImages[i - 1] = newImages[i];
//         newImages[i] = [];
//       }
//     }

//     // Update labels and enabledBoxes
//     const newLabels = [...labels];
//     const newEnabledBoxes = newImages.findIndex(arr => arr.length === 0);
//     setLabels(newLabels);
//     setEnabledBoxes(newEnabledBoxes === -1 ? newImages.length : newEnabledBoxes + 1);
//     setImages(newImages);
//   };

//   return (
//     <div className="upload__box">
//       <div className="upload__img-wrap">
//         {images.map((imgArr, index) => (
//           <div key={index} className={`upload__img-box ${index >= enabledBoxes ? 'disabled' : ''}`}>
//             {imgArr.length > 0 ? (
//               imgArr.map((img, imgIndex) => (
//                 <div key={imgIndex} className="img-bg" style={{ backgroundImage: `url(${img})` }}>
//                   <div className="upload__img-close" onClick={() => handleRemoveImage(index, imgIndex)}></div>
//                 </div>
//               ))
//             ) : (
//               <label className="upload__btn">
//                 {labels[index] === "Add a photo" && (
//                   <div className="upload__icon">
//                     <i className="bi bi-camera-fill"></i>
//                   </div>
//                 )}
//                 <p>{labels[index]}</p>
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageChange(e, index)}
//                   className="upload__inputfile"
//                   multiple
//                   disabled={index >= enabledBoxes} 
//                 />
//               </label>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;


// import React, { useState } from 'react';

// const ImageUploader = () => {
//   const initialLabels = [
//     "Add a photo",
//     "Cover photo",
//     "Front",
//     "Back",
//     "Side",
//     "Label",
//     "Details",
//     "Flaw"
//   ];

//   const [images, setImages] = useState(Array(8).fill([]));
//   const [labels, setLabels] = useState(initialLabels);
//   const [enabledBoxes, setEnabledBoxes] = useState(1); 

//   const handleImageChange = (e, index) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const newImages = [...images];

//       // Process each selected file to occupy the next available box
//       files.forEach((file, i) => {
//         const boxIndex = index + i;
//         if (boxIndex < initialLabels.length) {
//           newImages[boxIndex] = [URL.createObjectURL(file)];
          
//           // Update label and enable the next box
//           const newLabels = [...labels];
//           newLabels[boxIndex] = `${i + 1} image${i > 0 ? 's' : ''}`; // Update label to show number of images
//           setLabels(newLabels);

//           if (boxIndex + 1 < initialLabels.length) {
//             newLabels[boxIndex + 1] = "Add a photo"; // Reset label for the next box
//             setLabels(newLabels);
//             setEnabledBoxes(boxIndex + 2); // Enable the next box
//           }
//         }
//       });

//       setImages(newImages);
//     }
//   };

//   const handleRemoveImage = (index, imgIndex) => {
//     const newImages = [...images];
//     newImages[index] = newImages[index].filter((_, i) => i !== imgIndex);
//     setImages(newImages);

//     // Shift images left to fill the gap left by removed image
//     for (let i = index + 1; i < newImages.length; i++) {
//       if (newImages[i].length > 0) {
//         newImages[i - 1] = newImages[i];
//         newImages[i] = [];
//       }
//     }

//     // Update labels and enabledBoxes
//     const newLabels = [...labels];
//     for (let i = index; i < initialLabels.length; i++) {
//       if (newImages[i].length === 0) {
//         newLabels[i] = initialLabels[i];
//         if (i + 1 < initialLabels.length) {
//           newLabels[i + 1] = "Add a photo";
//         }
//       }
//     }

//     setLabels(newLabels);

//     // Find the new enabledBoxes index
//     const newEnabledBoxes = newImages.findIndex(arr => arr.length === 0);
//     setEnabledBoxes(newEnabledBoxes === -1 ? newImages.length : newEnabledBoxes + 1);
//     setImages(newImages);
//   };

//   return (
//     <div className="upload__box">
//       <div className="upload__img-wrap">
//         {images.map((imgArr, index) => (
//           <div key={index} className={`upload__img-box ${index >= enabledBoxes ? 'disabled' : ''}`}>
//             {imgArr.length > 0 ? (
//               imgArr.map((img, imgIndex) => (
//                 <div key={imgIndex} className="img-bg" style={{ backgroundImage: `url(${img})` }}>
//                   <div className="upload__img-close" onClick={() => handleRemoveImage(index, imgIndex)}></div>
//                 </div>
//               ))
//             ) : (
//               <label className="upload__btn">
//                 <div className="upload__icon">
//                   <i className="bi bi-camera-fill"></i>
//                 </div>
//                 <p>{labels[index]}</p>
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageChange(e, index)}
//                   className="upload__inputfile"
//                   multiple
//                   disabled={index >= enabledBoxes} 
//                 />
//               </label>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;


// import React, { useState } from 'react';

// const ImageUploader = () => {
//   const initialLabels = [
//     "Add a photo",
//     "Cover photo",
//     "Front",
//     "Back",
//     "Side",
//     "Label",
//     "Details",
//     "Flaw"
//   ];

//   const [images, setImages] = useState(Array(8).fill([]));
//   const [labels, setLabels] = useState(initialLabels);
//   const [enabledBoxes, setEnabledBoxes] = useState(1); 

//   const handleImageChange = (e, index) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const newImages = [...images];

//       // Process each selected file to occupy the next available box
//       files.forEach((file, i) => {
//         const boxIndex = index + i;
//         if (boxIndex < initialLabels.length) {
//           newImages[boxIndex] = [URL.createObjectURL(file)];
          
//           // Update label and enable the next box
//           const newLabels = [...labels];
//           newLabels[boxIndex] = `${i + 1} image${i > 0 ? 's' : ''}`; // Update label to show number of images
//           setLabels(newLabels);

//           if (boxIndex + 1 < initialLabels.length) {
//             newLabels[boxIndex + 1] = "Add a photo"; // Reset label for the next box
//             setLabels(newLabels);
//             setEnabledBoxes(boxIndex + 2); // Enable the next box
//           }
//         }
//       });

//       setImages(newImages);
//     }
//   };

//   const handleRemoveImage = (index, imgIndex) => {
//     const newImages = [...images];
//     newImages[index] = newImages[index].filter((_, i) => i !== imgIndex);
//     setImages(newImages);

//     // Shift images left to fill the gap left by removed image
//     for (let i = index + 1; i < newImages.length; i++) {
//       if (newImages[i].length > 0) {
//         newImages[i - 1] = newImages[i];
//         newImages[i] = [];
//       }
//     }

//     // Update labels and enabledBoxes
//     const newLabels = [...labels];
//     for (let i = index; i < initialLabels.length; i++) {
//       if (newImages[i].length === 0) {
//         newLabels[i] = initialLabels[i];
//         if (i + 1 < initialLabels.length) {
//           newLabels[i + 1] = "Add a photo";
//         }
//       }
//     }

//     setLabels(newLabels);

//     // Find the new enabledBoxes index
//     const newEnabledBoxes = newImages.findIndex(arr => arr.length === 0);
//     setEnabledBoxes(newEnabledBoxes === -1 ? newImages.length : newEnabledBoxes + 1);
//     setImages(newImages);
//   };

//   return (
//     <div className="upload__box">
//       <div className="upload__img-wrap">
//         {images.map((imgArr, index) => (
//           <div key={index} className={`upload__img-box ${index >= enabledBoxes ? 'disabled' : ''}`}>
//             {imgArr.length > 0 ? (
//               imgArr.map((img, imgIndex) => (
//                 <div key={imgIndex} className="img-bg" style={{ backgroundImage: `url(${img})` }}>
//                   <div className="upload__img-close" onClick={() => handleRemoveImage(index, imgIndex)}></div>
//                 </div>
//               ))
//             ) : (
//               <label className="upload__btn">
//                 {index === enabledBoxes - 1 && ( // Render camera icon only for the active box
//                   <div className="upload__icon">
//                     <i className="bi bi-camera-fill"></i>
//                   </div>
//                 )}
//                 <p>{labels[index]}</p>
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageChange(e, index)}
//                   className="upload__inputfile"
//                   multiple
//                   disabled={index >= enabledBoxes} 
//                 />
//               </label>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;


import React, { useState } from 'react';

const ImageUploader = () => {
  const initialLabels = [
    "Add a photo",
    "Cover photo",
    "Front",
    "Back",
    "Side",
    "Label",
    "Details",
    "Flaw"
  ];

  const [images, setImages] = useState(Array(8).fill([]));
  const [labels, setLabels] = useState(initialLabels);
  const [enabledBoxes, setEnabledBoxes] = useState(1); 

  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...images];

      // Process each selected file to occupy the next available box
      files.forEach((file, i) => {
        const boxIndex = index + i;
        if (boxIndex < initialLabels.length) {
          newImages[boxIndex] = [URL.createObjectURL(file)];
          
          // Update label and enable the next box
          const newLabels = [...labels];
          newLabels[boxIndex] = `${i + 1} image${i > 0 ? 's' : ''}`; // Update label to show number of images
          setLabels(newLabels);

          if (boxIndex + 1 < initialLabels.length) {
            newLabels[boxIndex + 1] = "Add a photo"; // Reset label for the next box
            setLabels(newLabels);
            setEnabledBoxes(boxIndex + 2); // Enable the next box
          }
        }
      });

      setImages(newImages);
    }
  };

  const handleRemoveImage = (index, imgIndex) => {
    const newImages = [...images];
    newImages[index] = newImages[index].filter((_, i) => i !== imgIndex);
    setImages(newImages);

    // Shift images left to fill the gap left by removed image
    for (let i = index + 1; i < newImages.length; i++) {
      if (newImages[i].length > 0) {
        newImages[i - 1] = newImages[i];
        newImages[i] = [];
      }
    }

    // Update labels and enabledBoxes
    const newLabels = [...labels];
    newLabels[index] = "Add a photo"; // Set the current box label to "Add a photo" after image removal

    // Set subsequent disabled boxes to their original labels
    for (let i = index + 1; i < initialLabels.length; i++) {
      if (newImages[i].length === 0) {
        newLabels[i] = initialLabels[i];
      }
    }

    setLabels(newLabels);

    // Find the new enabledBoxes index
    const newEnabledBoxes = newImages.findIndex(arr => arr.length === 0);
    setEnabledBoxes(newEnabledBoxes === -1 ? newImages.length : newEnabledBoxes + 1);
    setImages(newImages);
  };

  return (
    <div className="upload__box">
      <div className="upload__img-wrap">
        {images.map((imgArr, index) => (
          <div key={index} className={`upload__img-box ${index >= enabledBoxes ? 'disabled' : ''}`}>
            {imgArr.length > 0 ? (
              imgArr.map((img, imgIndex) => (
                <div key={imgIndex} className="img-bg" style={{ backgroundImage: `url(${img})` }}>
                  <div className="upload__img-close" onClick={() => handleRemoveImage(index, imgIndex)}></div>
                </div>
              ))
            ) : (
              <label className="upload__btn">
                {index === enabledBoxes - 1 && ( // Render camera icon only for the active box
                  <div className="upload__icon">
                    <i className="bi bi-camera-fill"></i>
                  </div>
                )}
                <p>{labels[index]}</p>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, index)}
                  className="upload__inputfile"
                  multiple
                  disabled={index >= enabledBoxes} 
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
