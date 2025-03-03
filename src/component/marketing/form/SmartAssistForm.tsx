"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

const CheckboxList: React.FC = () => {
  const options = [
    "IOS App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
    "IOS App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
    "IOS App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
    "IOS App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
    "Android App download | 06 Feb 25",
  ];

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedOptions((prev) => [...prev, idx]);
    } else {
      setSelectedOptions((prev) => prev.filter((option) => option !== idx));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedValues = selectedOptions.map((i) => options[i]);
    console.log("Selected Options:", selectedValues);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto h-full flex flex-col"
    >
      <h1 className="text-white text-xl font-bold">Campaigns :</h1>
      <div className="flex-1 overflow-y-auto my-5 no-scrollbar">
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-5 gap-2">
            <input
              type="checkbox"
              id={`option-${index}`}
              name={`option-${index}`}
              checked={selectedOptions.includes(index)}
              onChange={(e) => handleCheckboxChange(e, index)}
              className={`appearance-none mr-2 w-4 h-4 border rounded focus:ring-0 focus:outline-none border-[#3d3d3d] ${
                selectedOptions.includes(index)
                  ? "bg-[blue]"
                  : "bg-transparent"
              }`}
            />
            <label
              htmlFor={`option-${index}`}
              className="text-white p-2 rounded-xl bg-[#2d2d2d] w-full border-2 border-[#3d3d3d]"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-[#2d2d2d] text-white py-2 rounded-xl"
      >
        Run
      </button>
    </form>
  );
};

export default CheckboxList;
