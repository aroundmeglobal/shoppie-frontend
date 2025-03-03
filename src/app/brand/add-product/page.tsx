"use client";

import React, { useState } from "react";

type Props = {};

const Page = (props: Props) => {
  // Form field states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Change from a single file to an array for multiple media items.
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [tag, setTag] = useState("");
  const [purchaseUrls, setPurchaseUrls] = useState<string[]>([""]);
  const [faviconUrls, setFaviconUrls] = useState<String[]>([""]);

  // Touched states for showing error messages (they auto-clear after 30 seconds)
  const [titleTouched, setTitleTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [mediaTouched, setMediaTouched] = useState(false);
  const [priceTouched, setPriceTouched] = useState(false);
  const [offerPriceTouched, setOfferPriceTouched] = useState(false);
  const [tagTouched, setTagTouched] = useState(false);
  const [purchaseUrlTouched, setPurchaseUrlTouched] = useState(false);

  // Base styling for all input-like elements.
  const baseInputStyle =
    "flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d]";

  const handlePurchaseUrlChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Create copies of the current arrays.
    const newUrls = [...purchaseUrls];
    const newFaviconUrls = [...faviconUrls];

    // Update the URL for the current index.
    newUrls[index] = e.target.value;

    // Try to extract the domain and set the favicon.
    try {
      const domain = new URL(e.target.value).hostname;
      newFaviconUrls[
        index
      ] = `https://www.google.com/s2/favicons?domain=${domain}`;
      console.log(domain);
      
    } catch (err) {
      newFaviconUrls[index] = ""; // Clear favicon if URL is invalid
    }

    // If the last input is filled, add a new empty input.
    if (e.target.value && index === newUrls.length - 1) {
      newUrls.push("");
      newFaviconUrls.push("");
    }

    // Update the state with the new arrays.
    setPurchaseUrls(newUrls);
    setFaviconUrls(newFaviconUrls);
  };

  // Remove a purchase URL input
  const removePurchaseUrlInput = (index: number) => {
    const newUrls = purchaseUrls.filter((_, i) => i !== index);
    setPurchaseUrls(newUrls);

    const newFaviconUrls = faviconUrls.filter((_, i) => i !== index);
    setFaviconUrls(newFaviconUrls);
  };

  // Media upload handlers.
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setMediaFiles((prev) => [...prev, ...files]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const validPurchaseUrls =
  purchaseUrls.length > 1 ? purchaseUrls.slice(0, -1) : purchaseUrls;

  // Compute form validity.
  const isFormValid =
    title.trim() &&
    description.trim() &&
    mediaFiles.length > 0 &&
    price.trim() &&
    offerPrice.trim() &&
    tag.trim() &&
    validPurchaseUrls.every((url) => url.trim());

  // Save handler (only called when form is valid).
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!isFormValid) return;
  
    // Prepare the API payload
    const payload = {
      title,
      description,
      mediaFiles: mediaFiles.map(file => URL.createObjectURL(file)), // Just using the object URLs for media
      prices: {
        price,
        offerPrice,
      },
      tags: tag.split(',').map(tag => tag.trim()), // Split tags by commas
      purchaseUrls: purchaseUrls.filter(url => url.trim() !== ''), // Filter out empty URLs
      faviconUrls: faviconUrls.filter(url => url.trim() !== '') // Filter out empty favicons
    };
  
  
   console.log(payload);
   
  };
  

  // Discard handler: reset all fields and error (touched) states.
  const handleDiscard = () => {
    setTitle("");
    setDescription("");
    setMediaFiles([]);
    setPrice("");
    setOfferPrice("");
    setTag("");
    setPurchaseUrls([""]);
    setFaviconUrls([""]);

    setTitleTouched(false);
    setDescriptionTouched(false);
    setMediaTouched(false);
    setPriceTouched(false);
    setOfferPriceTouched(false);
    setTagTouched(false);
    setPurchaseUrlTouched(false);
  };

  // Utility to mark a field as touched and clear it after 30 seconds.
  const markTouched = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter(true);
    setTimeout(() => {
      setter(false);
    }, 30000);
  };

  return (
    <div>
      {/* Header with Save and Discard Buttons */}
      <div className="ml-20 p-5 flex items-center justify-between border-b-2 border-[#1d1d1d]">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <div className="flex items-center gap-5 pt-2">
          <button
            className={`mt-[-10px] cursor-pointer flex items-center justify-between ${baseInputStyle} hover:bg-[red]/30 hover:border-[red]/60`}
            onClick={handleDiscard}
          >
            Discard
          </button>
          <button
            className={`py-2 px-4 mt-[-10px] rounded-2xl ${
              isFormValid
                ? "cursor-pointer bg-[#00AFFE]"
                : `cursor-not-allowed ${baseInputStyle}`
            }`}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Save
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col px-28 ml-20 mt-10 overflow-y-auto h-[85vh] no-scrollbar">
        <form onSubmit={handleSubmit} className="bg-[#161616] rounded-2xl p-5">
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-[#FAFAFA]"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => markTouched(setTitleTouched)}
              placeholder="Enter product title"
              required
              className={`mt-1 ${baseInputStyle}`}
            />
            {titleTouched && !title.trim() && (
              <p className="text-red-500 text-xs mt-1">* please enter Title</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-[#FAFAFA]"
            >
              Description
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => markTouched(setDescriptionTouched)}
              placeholder="Enter product description"
              required
              className={`mt-1 resize-none ${baseInputStyle}`}
            />
            {descriptionTouched && !description.trim() && (
              <p className="text-red-500 text-xs mt-1">
                * please enter Description
              </p>
            )}
          </div>

          {/* Media Upload */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#FAFAFA]">
              Media Upload
            </label>
            {mediaFiles.length > 0 ? (
              <div className="mt-1 grid grid-cols-5 gap-4">
                {mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`w-40 h-52  rounded-xl ${baseInputStyle}  flex items-center justify-center overflow-hidden`}
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-700">Video</span>
                      </div>
                    )}
                  </div>
                ))}
                {/* Additional card for adding more media */}
                <div
                  onClick={() => document.getElementById("mediaInput")?.click()}
                  className={`w-40 h-52 border border-dashed rounded-xl flex items-center justify-center cursor-pointer border-[#4d4d4d] ${baseInputStyle}`}
                >
                  <span className=" bg-[#161616] mx-auto px-6 py-4 rounded-xl">
                    + Add
                  </span>
                </div>
              </div>
            ) : (
              // If no media files, show default drag & drop container.
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("mediaInput")?.click()}
                onBlur={() => markTouched(setMediaTouched)}
                className={`mt-1 min-h-[15vh] border-2 border-dashed border-[#4d4d4d]  items-center rounded-md p-4 cursor-pointer ${baseInputStyle}`}
                tabIndex={0} // to allow onBlur
              >
                <span className="text-gray-500 w-full text-center">
                  Drag & drop or click to add media
                </span>
              </div>
            )}
            <input
              type="file"
              id="mediaInput"
              accept="image/*,video/*"
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  setMediaFiles((prev) => [...prev, ...files]);
                  // Reset the input value to allow uploading the same file(s) again.
                  e.target.value = "";
                }
              }}
              className="hidden"
              multiple
            />
            {mediaTouched && mediaFiles.length === 0 && (
              <p className="text-red-500 text-xs mt-1">* please add Media</p>
            )}
          </div>

          {/* Price and Offer Price */}
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-[#FAFAFA]"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={() => markTouched(setPriceTouched)}
                placeholder="Enter price"
                required
                className={`mt-1 ${baseInputStyle}`}
              />
              {priceTouched && !price.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  * please enter Price
                </p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="offerPrice"
                className="block text-sm font-semibold text-[#FAFAFA]"
              >
                Offer Price
              </label>
              <input
                type="number"
                id="offerPrice"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                onBlur={() => markTouched(setOfferPriceTouched)}
                placeholder="Enter offer price"
                required
                className={`mt-1 ${baseInputStyle}`}
              />
              {offerPriceTouched && !offerPrice.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  * please enter Offer Price
                </p>
              )}
            </div>
          </div>

          {/* Tags Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-sm font-semibold text-[#FAFAFA]"
            >
              Tags
            </label>
            <select
              id="tags"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onBlur={() => markTouched(setTagTouched)}
              required
              className={`mt-1 ${baseInputStyle}`}
            >
              <option value="">Select a tag</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="books">Books</option>
              <option value="sports">Sports</option>
            </select>
            {tagTouched && !tag.trim() && (
              <p className="text-red-500 text-xs mt-1">* please select a Tag</p>
            )}
          </div>

          {/* Purchase URL */}
          <div className="mb-4">
            <label
              htmlFor="purchaseUrl"
              className="block text-sm font-semibold text-[#FAFAFA]"
            >
              Purchase URL
            </label>
            {purchaseUrls.map((url, index) => (
              <div key={index} className="flex items-center mt-2">
                <div
                  className={`mt-1 py-0 px-0 ${baseInputStyle} min-h-[5vh] flex items-center`}
                  onBlur={() => markTouched(setPurchaseUrlTouched)}
                >
                  
                  {faviconUrls[index] && (
                    <div className="bg-[#4d4d4d] px-4 py-3 rounded-l-xl">
                    <img
                      src={faviconUrls[index]}
                      alt="Favicon"
                      className="h-6 w-6"
                    />
                    </div>
                  )}

                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handlePurchaseUrlChange(index, e)}
                    placeholder="Enter purchase URL"
                    required
                    className="flex-1 ml-2 bg-transparent focus:outline-none"
                  />
                </div>
                {purchaseUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePurchaseUrlInput(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {purchaseUrlTouched && purchaseUrls.length === 0 && (
              <p className="text-red-500 text-xs mt-1">
                * please enter at least one Purchase URL
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
