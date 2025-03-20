'use client';

import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { ChromePicker } from "react-color";
import useWidgitThemeStore from "@/store/useWidgitThemeStore";


export default function PageComponent() {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColorField, setCurrentColorField] = useState(null);
  
  // Use Zustand store for theme management
  const { changedFields, theme, toggleTheme } = useWidgitThemeStore();

  const handleColorFieldClick = (field) => {
    setCurrentColorField(field);
    setColorPickerOpen(true);
  };

  const handleColorChange = (color) => {
    // Update the changedFields in the Zustand store
    useWidgitThemeStore.setState((state) => ({
      changedFields: { ...state.changedFields, [currentColorField]: color.hex }
    }));
  };
  
  // Effect to manage the chat widget script
  useEffect(() => {
    const existingScript = document.getElementById('chat-widget-script');
    const existingWidgetContainer = document.getElementById('anything-llm-embed-chat-container');

    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    if (existingWidgetContainer) {
      existingWidgetContainer.remove();
    }

    const script = document.createElement('script');
    script.id = 'chat-widget-script';
    script.src = 'https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js';
    script.async = true;
    script.dataset.openOnLoad = 'on';

    // Set data attributes based on changedFields from Zustand store
    Object.keys(changedFields).forEach(key => {
      script.dataset[key] = changedFields[key];
    });

    document.body.appendChild(script);

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
      const widgetContainerCleanup = document.getElementById('anything-llm-embed-chat-container');
      if (widgetContainerCleanup) {
        widgetContainerCleanup.remove();
      }
    };
    
  }, [changedFields]);

  return (
    <div className="ml-20 px-5 overflow-y-auto h-screen">
      <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
        Bot Configure
      </h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => toggleTheme("light")}
          className={`px-4 py-2 rounded ${theme === "light" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
        >
          Light Theme
        </button>
        <button
          onClick={() => toggleTheme("dark")}
          className={`px-4 py-2 rounded ${theme === "dark" ? "bg-blue-500 text-white" : "bg-black text-white"}`}
        >
          Dark Theme
        </button>
      </div>

      <div className="w-full h-[80%] gap-5 mt-8 flex no-scrollbar">
        <div className="w-[60%] h-full overflow-y-auto overflow-hidden bg-[#161616] rounded-[12px] p-6 no-scrollbar">
          <Formik
            initialValues={changedFields}
            onSubmit={() => {}}
          >
            {({ handleBlur, setFieldTouched, setFieldValue }) => (
              <Form>
                <div className="space-y-4">
                  {Object.keys(changedFields)
                    .filter(key => key !== "embedId" && key !== "baseApiUrl")
                    .map((key) => (
                      <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="text-white">
                          {key.replace(/([A-Z])/g, " $1")}
                        </label>
                        <div className="flex items-center gap-4 justify-center">
                          {key.includes("Color") ? (
                            <Field
                              type="text"
                              id={key}
                              name={key}
                              value={changedFields[key]}
                              readOnly
                              className="p-2 mt-1 flex-1 rounded-md bg-transparent border border-gray-400 focus:outline-none focus:border-blue-500 text-white"
                              onClick={() => handleColorFieldClick(key)}
                            />
                          ) : (
                            <Field
                              type="text"
                              id={key}
                              name={key}
                              onChange={(e) =>
                                setFieldValue(key, e.target.value)
                              }
                              onBlur={handleBlur}
                              className="p-2 mt-1 flex-1 rounded-md bg-transparent border border-gray-400 focus:outline-none focus:border-blue-500 text-white"
                            />
                          )}
                          <ErrorMessage
                            name={key}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {colorPickerOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-4 rounded-lg">
            <ChromePicker
              color={changedFields[currentColorField]}
              onChangeComplete={handleColorChange}
            />
            <button
              onClick={() => setColorPickerOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




// 'use client';

// import { useState, useEffect } from "react";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import { ChromePicker } from "react-color";

// const lightThemeValues = {
//   userBgColor: "#f0f0f0",
//   assistantBgColor: "#333333",
//   embedId: "b5909a44-7e5b-494b-a9e4-3b29c35e1da2",
//   baseApiUrl: "https://anythingllm.aroundme.global/api/embed",
//   headerColor: "#fff",
//   textHeaderColor: "#000",
//   bgColor: "#fff",
//   inputbarColor: "#fff",
//   cardBgColor: "#fff",
// };

// const darkThemeValues = {
//   userBgColor: "#2563eb",
//   assistantBgColor: "#ff4b5c",
//   embedId: "b5909a44-7e5b-494b-a9e4-3b29c35e1da2",
//   baseApiUrl: "https://anythingllm.aroundme.global/api/embed",
//   headerColor: "#fff",
//   textHeaderColor: "#000",
//   bgColor: "#161616",
//   inputbarColor: "#333333",
//   cardBgColor: "#333333",
// };

// export default function PageComponent() {
//   const [colorPickerOpen, setColorPickerOpen] = useState(false);
//   const [currentColorField, setCurrentColorField] = useState(null);
//   const [changedFields, setChangedFields] = useState(lightThemeValues);
//   const [theme, setTheme] = useState("light");

//   // Toggle between dark and light theme
//   const toggleTheme = (selectedTheme) => {
//     if (selectedTheme === "dark") {
//       setChangedFields(darkThemeValues);
//       setTheme("dark");
//     } else {
//       setChangedFields(lightThemeValues);
//       setTheme("light");
//     }
//   };

//   const handleColorFieldClick = (field) => {
//     setCurrentColorField(field);
//     setColorPickerOpen(true);
//   };

//   const handleColorChange = (color) => {
//     setChangedFields((prev) => ({ ...prev, [currentColorField]: color.hex }));
//   };

//   // Effect to manage the chat widget script
//   useEffect(() => {
//     // Remove existing script and widget container if present
//     const existingScript = document.getElementById('chat-widget-script');
//     const existingWidgetContainer = document.getElementById('anything-llm-embed-chat-container');

//     if (existingScript) {
//       document.body.removeChild(existingScript);
//     }

//     if (existingWidgetContainer) {
//       existingWidgetContainer.remove(); // Remove the old widget container
//     }

//     // Create new script element
//     const script = document.createElement('script');
//     script.id = 'chat-widget-script';
//     script.src = 'https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js';
//     script.async = true;

//     // Set data attributes
//     script.dataset.embedId = changedFields.embedId;
//     script.dataset.baseApiUrl = changedFields.baseApiUrl;
//     script.dataset.assistantBgColor = changedFields.assistantBgColor;
//     script.dataset.openOnLoad = 'on';

//     // Add to document
//     document.body.appendChild(script);

//     // Cleanup function
//     return () => {
//       if (script) {
//         document.body.removeChild(script);
//       }
//       const widgetContainerCleanup = document.getElementById('anything-llm-embed-chat-container');
//       if (widgetContainerCleanup) {
//         widgetContainerCleanup.remove();
//       }
//     };
//   }, [changedFields]); // Re-run when changedFields updates

//   return (
//     <div className="ml-20 px-5 overflow-y-auto h-screen">
//       <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
//         Bot Configure
//       </h1>
      
//       {/* Theme buttons with active styles */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => toggleTheme("light")}
//           className={`px-4 py-2 rounded ${theme === "light" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
//         >
//           Light Theme
//         </button>
//         <button
//           onClick={() => toggleTheme("dark")}
//           className={`px-4 py-2 rounded ${theme === "dark" ? "bg-blue-500 text-white" : "bg-black text-white"}`}
//         >
//           Dark Theme
//         </button>
//       </div>

//       <div className="w-full h-[80%] gap-5 mt-8 flex no-scrollbar">
//         <div className="w-[60%] h-full overflow-y-auto overflow-hidden bg-[#161616] rounded-[12px] p-6 no-scrollbar z-[999]">
//           <Formik
//             initialValues={changedFields}
//             onSubmit={() => {}}
//           >
//             {({ handleBlur, setFieldTouched, setFieldValue }) => (
//               <Form>
//                 <div className="space-y-4">
//                   {Object.keys(changedFields)
//                     .filter(
//                       (key) =>
//                         key !== "embedId" &&
//                         key !== "baseApiUrl"
//                     )
//                     .map((key) => (
//                       <div key={key} className="flex flex-col">
//                         <label htmlFor={key} className="text-white">
//                           {key.replace(/([A-Z])/g, " $1")}
//                         </label>
//                         <div className="flex items-center gap-4 justify-center">
//                           {key.includes("Color") ? (
//                             <Field
//                               type="text"
//                               id={key}
//                               name={key}
//                               value={changedFields[key]}
//                               readOnly
//                               className="p-2 mt-1 flex-1 rounded-md bg-transparent border border-gray-400 focus:outline-none focus:border-blue-500 text-white"
//                               onClick={() => handleColorFieldClick(key)}
//                             />
//                           ) : (
//                             <Field
//                               type="text"
//                               id={key}
//                               name={key}
//                               onChange={(e) =>
//                                 setFieldValue(key, e.target.value)
//                               }
//                               onBlur={handleBlur}
//                               className="p-2 mt-1 flex-1 rounded-md bg-transparent border border-gray-400 focus:outline-none focus:border-blue-500 text-white"
//                             />
//                           )}
//                           <ErrorMessage
//                             name={key}
//                             component="div"
//                             className="text-red-500 text-sm"
//                           />
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>

//       {colorPickerOpen && (
//         <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-[9999]">
//           <div className="bg-white p-4 rounded-lg">
//             <ChromePicker
//               color={changedFields[currentColorField]}
//               onChangeComplete={handleColorChange}
//             />
//             <button
//               onClick={() => setColorPickerOpen(false)}
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



//    // script.setAttribute("data-user-bg-color", changedFields.userBgColor);
//     // script.setAttribute("data-assistant-bg-color", changedFields.assistantBgColor);
//     // script.setAttribute("data-header-color", changedFields.headerColor);
//     // script.setAttribute("data-text-header-color", changedFields.textHeaderColor);
//     // script.setAttribute("data-bg-color", changedFields.bgColor);
//     // script.setAttribute("data-inputbar-color", changedFields.inputbarColor);
//     // script.setAttribute("data-card-bg-color", changedFields.cardBgColor);