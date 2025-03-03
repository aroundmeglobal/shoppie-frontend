"use client";

import React, { useState, ChangeEvent } from "react";
import { FAQ } from "../../../types";

interface FaqComponentProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

const FaqComponent: React.FC<FaqComponentProps> = ({ faqs, onChange }) => {
  // State for showing modals
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqDetailsModalOpen, setFaqDetailsModalOpen] = useState(false);
  // When editingIndex is null, we're in "add" mode; otherwise, "edit" mode.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFaq, setNewFaq] = useState<FAQ>({ question: "", answer: "" });

  // --- Modal 1: FAQ List ---
  // Also ensure the FAQ Details modal is closed.
  const openFaqModal = () => {
    setFaqModalOpen(true);
    setFaqDetailsModalOpen(false);
  };
  const closeFaqModal = () => setFaqModalOpen(false);

  // --- Functions to open Modal 2 (FAQ Details) ---
  // For adding a new FAQ:
  const openAddFaqModal = () => {
    setNewFaq({ question: "", answer: "" });
    setEditingIndex(null);
    // Close FAQ List and open FAQ Details.
    setFaqModalOpen(false);
    setFaqDetailsModalOpen(true);
  };

  // For editing an existing FAQ:
  const openEditFaqModal = (index: number) => {
    setEditingIndex(index);
    setNewFaq(faqs[index]);
    // Close FAQ List and open FAQ Details.
    setFaqModalOpen(false);
    setFaqDetailsModalOpen(true);
  };

  // --- Input Handler for Modal 2 ---
  const handleFaqInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFaq((prev) => ({ ...prev, [name]: value }));
  };

  // --- Modal 2 Button Handlers ---
  // Back: discard changes and return to FAQ List.
  const cancelFaqChanges = () => {
    setFaqDetailsModalOpen(false);
    setFaqModalOpen(true);
  };

  // Save: either add a new FAQ or update an existing one.
  const saveFaqChanges = () => {
    if (!newFaq.question || !newFaq.answer) {
      // Both fields are required.
      return;
    }
    if (editingIndex === null) {
      // Add mode: append the new FAQ.
      onChange([...faqs, newFaq]);
    } else {
      // Edit mode: update the FAQ at the given index.
      const updatedFaqs = [...faqs];
      updatedFaqs[editingIndex] = newFaq;
      onChange(updatedFaqs);
    }
    // After saving, close FAQ Details and reopen FAQ List.
    setFaqDetailsModalOpen(false);
    setFaqModalOpen(true);
  };

  // Delete: in edit mode, remove the FAQ.
  // (In add mode, this simply discards the input.)
  const deleteFaq = () => {
    if (editingIndex !== null) {
      const updatedFaqs = faqs.filter((_, index) => index !== editingIndex);
      onChange(updatedFaqs);
    }
    // Close FAQ Details and reopen FAQ List.
    setFaqDetailsModalOpen(false);
    setFaqModalOpen(true);
  };

  // Determine if the Save button should be disabled in add mode.
  const isSaveDisabled =
    editingIndex === null && (!newFaq.question.trim() || !newFaq.answer.trim());

  return (
    <>
      {/* FAQ Section: Clickable Div to open Modal 1 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#FAFAFA]">
          FAQ's :
        </label>
        <div
          className="mt-2 p-3 border border-[#2d2d2d] rounded-xl bg-[#2d2d2d] text-[#5A5A5A] cursor-pointer flex justify-between items-center"
          onClick={openFaqModal}
        >
          Add FAQ
          <div className="bg-[#3d3d3d] w-6 h-6 my-[-10px] flex items-center justify-center rounded-full text-base text-white">
            +
          </div>
        </div>
        <div className="mt-3">
          {faqs.slice(0, 2).map((faq, index) => (
            <div key={index} className="mb-2">
              <div
                className="p-2 bg-[#2d2d2d] text-[#fff]/50 cursor-pointer rounded-xl truncate"
                onClick={openFaqModal} // Open the modal on click
              >
                {faq.question}
              </div>
            </div>
          ))}

          {/* Show More / Show Less Button */}
          {faqs.length > 2 && (
            <div className="mt-2  justify-center flex  ">
              <button
                onClick={openFaqModal}
                className="mt-2 text-[#fff] w-auto justify-center flex text-sm hover:underline "
              >
                {" "}
                Show More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: FAQ List */}
      {faqModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Modal container with 80vw x 80vh and flex layout */}
          <div className="bg-[#1D1D1D] p-6 rounded-xl w-[80vw] h-[80vh] relative flex flex-col">
            {/* Header with title and top-right Add button */}
            <div className="relative flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">Add FAQ's</h2>
              <button
                onClick={openAddFaqModal}
                className="bg-[#2A2A2A] text-white px-3 py-1 rounded"
              >
                Add <span className="ml-1">+</span>
              </button>
            </div>
            {/* Scrollable content area for FAQ list */}
            <div className="flex-grow overflow-y-auto mt-6 px-5 no-scrollbar">
              {faqs.length === 0 ? (
                <button
                  onClick={openAddFaqModal}
                  className="bg-[#2B2B2B]/60 w-full border p-2 rounded-[10px] text-left"
                >
                  <div className="text-[#FFFFFF]/20 pb-2 border-b-[1px] border-[#5A5A5A]/60">
                    Question
                  </div>
                  <div className="text-[#FFFFFF]/20 pt-2 pb-2">Answer</div>
                </button>
              ) : (
                <ul className="space-y-2">
                  {faqs.map((faq, index) => (
                    <div key={index} className="relative pt-[1px]">
                      {/* Pencil Icon positioned relative to this container */}
                      <div className="absolute right-[-10px] top-0 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditFaqModal(index);
                          }}
                          className="bg-[#5A5A5A] rounded-full p-1"
                          aria-label="plus icon"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2">
                        <li
                          key={index}
                          className="bg-[#2B2B2B] border p-2 rounded-[10px] text-left cursor-pointer"
                          onClick={() => openEditFaqModal(index)}
                        >
                          <div className="text-[#FFFFFF] font-semibold pb-1 border-b-[1px] border-[#5A5A5A]/60 capitalize line-clamp-1">
                            {faq.question}
                          </div>
                          <div className="text-[#FFFFFF]/70 pt-2 capitalize leading-[22px] line-clamp-3">
                            {faq.answer}
                          </div>
                        </li>
                      </div>
                    </div>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex items-center justify-between mt-6 gap-5">
              <button
                onClick={closeFaqModal}
                className="bg-[#5A5A5A] text-white px-4 py-2 rounded-xl flex-1"
              >
                Back
              </button>
              <button
                onClick={closeFaqModal}
                className="w-2/4 bg-[#00AFFE] text-white py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: FAQ Details (Add / Edit) */}
      {faqDetailsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#1D1D1D] p-6 rounded-xl w-[80vw] h-[80vh] relative flex flex-col">
            {/* Header with Delete button at top-right */}
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">
                {editingIndex === null ? "Add FAQ" : "Edit FAQ"}
              </h2>
              <button
                onClick={deleteFaq}
                className="bg-[#2A2A2A] text-red-600 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
            <div className="rounded-xl bg-[#2B2B2B] p-2 mt-5 flex flex-col h-full">
              <input
                type="text"
                name="question"
                value={newFaq.question}
                onChange={handleFaqInputChange}
                placeholder="Enter question..."
                className="mt-1 block w-full p-2 bg-inherit text-white font-semibold focus:outline-none border-b-[1px] border-[#5A5A5A]"
              />

              <textarea
                name="answer"
                value={newFaq.answer}
                onChange={handleFaqInputChange}
                placeholder="Enter answer..."
                className="mt-1 block w-full flex-grow p-2 bg-inherit text-white focus:outline-none text-[#fff]/70"
              />
            </div>

            <div className="flex items-center justify-between mt-6 gap-5">
              <button
                onClick={cancelFaqChanges}
                className="bg-[#5A5A5A] text-white px-4 py-2 rounded-xl flex-1"
              >
                Back
              </button>
              <button
                onClick={saveFaqChanges}
                disabled={isSaveDisabled}
                className={`bg-[#00AFFE] text-white px-4 py-2 rounded-xl flex-1 ${
                  isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FaqComponent;
