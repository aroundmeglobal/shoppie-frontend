"use client";

// import { useEffect } from "react";

// export default function RedirectHandler() {
//   useEffect(() => {
//     // Function to get query parameters from the URL
//     function getQueryParams() {
//       const params: { [key: string]: string } = {};
//       const queryString = window.location.search.substring(1);
//       const queryArray = queryString.split("&");
//       queryArray.forEach((param) => {
//         const [key, value] = param.split("=");
//         params[key] = decodeURIComponent(value);
//       });
//       return params;
//     }

//     // Function to detect the device type
//     function getDeviceType() {
//       const userAgent = navigator.userAgent || navigator.vendor || window.opera;
//       if (/android/i.test(userAgent)) {
//         return "android";
//       }
//       if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
//         return "ios";
//       }
//       return "web";
//     }

//     const copyToClipboard = async (text: string) => {
//       if (navigator.clipboard && navigator.clipboard.writeText) {
//         try {
//           await navigator.clipboard.writeText(text);
//           console.log("Copied to clipboard!");
//         } catch (err) {
//           console.error("Error copying text: ", err);
//         }
//       } else {
//         console.error("Clipboard API not supported");
//         // Fallback logic if Clipboard API is not supported
//         const textArea = document.createElement("textarea");
//         textArea.value = text;
//         document.body.appendChild(textArea);
//         textArea.focus();
//         textArea.select();
//         try {
//           document.execCommand("copy");
//           console.log("Copied to clipboard using fallback method!");
//         } catch (err) {
//           console.error("Fallback: Oops, unable to copy", err);
//         }
//         document.body.removeChild(textArea);
//       }
//     };

//     // Check if the URL contains the specific query parameters
//     const params = getQueryParams();

//     if (params.page || params.amsh) {
//       const deviceType = getDeviceType();
//       // const appUrl = `aroundme://?page=${params.page}&id=${params.id}`;
//       // const appUrlForIos = `aroundme://aroundme.global/?page=${params.page}&id=${params.id}`;
//       const appUrl = `aroundme://?amsh=${params.amsh}`;
//       const appUrlForIos = `aroundme://aroundme.global/?amsh=${params.amsh}`;
//       copyToClipboard("hello");

//       if (deviceType === "ios") {
//         window.location.href = appUrlForIos;
//       } else {
//         window.location.href = appUrl;
//       }

//       // Fallback to store if the app is not installed
//       const timeout = setTimeout(() => {
//         if (document.hasFocus()) {
//           if (deviceType === "ios") {
//             window.location.href =
//               "https://apps.apple.com/in/app/around-me-socializing/id6636550873";
//           } else if (deviceType === "android") {
//             window.location.href =
//               "https://play.google.com/store/apps/details?id=com.mrdots.aroundme";
//           }
//         }
//       }, 0);

//       // Clear the timeout if the page is hidden (app opened successfully)
//       const clearFallback = () => clearTimeout(timeout);
//       window.addEventListener("pagehide", clearFallback);
//       window.addEventListener("visibilitychange", () => {
//         if (document.visibilityState === "hidden") {
//           clearFallback();
//         }
//       });
//     }
//   }, []);

//   return null;
// }

import { useEffect } from "react";
import ClipboardJS from "clipboard";

const RedirectHandler = () => {
  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: params.get("page"),
      id: params.get("id"),
      amsh: params.get("amsh"),
    };
  };

  const getDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return "android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "ios";
    }
    return "web";
  };

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        console.log("Copied to clipboard!");
      } catch (err) {
        console.error("Error copying text: ", err);
      }
    } else {
      console.error("Clipboard API not supported");
      // Fallback logic if Clipboard API is not supported
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        console.log("Copied to clipboard using fallback method!");
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };
  // const copyToClipboard = async (text: string) => {
  //   const clipboard = new ClipboardJS(".btn", {
  //     text: () => text,
  //   });

  //   clipboard.on("success", (e) => {
  //     console.log("Copied to clipboard!", e.text);
  //     e.clearSelection();
  //     clipboard.destroy();
  //     console.log("Copied to clipboard!123", e.text);
  //   });

  //   try {
  //     const clipboardText = await navigator.clipboard.writeText(text);
  //     console.log(clipboardText, "clipboardText");
  //     // if (clipboardText == text) {
  //     //   console.log("Text is in the clipboard!");
  //     // } else {
  //     //   console.error("Text is not in the clipboard!");
  //     // }
  //   } catch (err) {
  //     console.error("Error reading clipboard content: ", err);
  //   }

  //   clipboard.on("error", (e) => {
  //     console.error("Error copying text: ", e);
  //     clipboard.destroy();
  //   });

  //   // Trigger the copy action
  //   const button = document.createElement("button");
  //   button.className = "btn";
  //   document.body.appendChild(button);
  //   button.click();
  //   document.body.removeChild(button);
  // };

  useEffect(() => {
    const handleRedirect = async () => {
      const params = getQueryParams();

      if (params.page || params.amsh) {
        const deviceType = getDeviceType();
        const appUrl = `aroundme://?amsh=${params.amsh}`;
        const appUrlForIos = `aroundme://aroundme.global/?amsh=${params.amsh}`;
        const decodedAmsh = atob(params.amsh);
        // console.log(params.amsh);

        const referral_code = new URLSearchParams(decodedAmsh);
        const value = referral_code.get("referrel_code");
        // console.log(value, "value");
        if (value) {
          const text = params.amsh ?? "";
          await copyToClipboard(text);
        }
        if (deviceType === "ios") {
          window.location.href = appUrlForIos;
        } else {
          window.location.href = appUrl;
        }

        // Fallback to store if the app is not installed
        const timeout = setTimeout(() => {
          if (document.hasFocus()) {
            if (deviceType === "ios") {
              window.location.href =
                "https://apps.apple.com/in/app/around-me-socializing/id6636550873";
            } else if (deviceType === "android") {
              window.location.href =
                "https://play.google.com/store/apps/details?id=com.mrdots.aroundme";
            }
          }
        }, 0);

        // Clear the timeout if the page is hidden (app opened successfully)
        const clearFallback = () => clearTimeout(timeout);
        window.addEventListener("pagehide", clearFallback);
        window.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            clearFallback();
          }
        });
      }
    };

    handleRedirect();
  }, []);

  return null;
};

// import { useEffect } from "react";
// import ClipboardJS from "clipboard";

// const RedirectHandler = () => {
//   const getQueryParams = () => {
//     const params = new URLSearchParams(window.location.search);
//     return {
//       page: params.get("page"),
//       id: params.get("id"),
//       amsh: params.get("amsh"),
//     };
//   };

//   const getDeviceType = () => {
//     const userAgent = navigator.userAgent || navigator.vendor || window.opera;
//     if (/android/i.test(userAgent)) {
//       return "android";
//     }
//     if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
//       return "ios";
//     }
//     return "web";
//   };

//   const handleClipboardCopy = (text: string) => {
//     // Create a temporary button that will trigger the clipboard copy
//     const button = document.createElement("button");
//     button.className = "btn";
//     button.textContent = "Copy"; // Optional, in case you want the button to be visible during debugging

//     document.body.appendChild(button);

//     // Initialize ClipboardJS
//     const clipboard = new ClipboardJS(button, {
//       text: () => text,
//     });

//     clipboard.on("success", (e) => {
//       console.log("Copied to clipboard:", e.text);
//       e.clearSelection(); // Clean up
//       clipboard.destroy(); // Destroy ClipboardJS instance after success
//       document.body.removeChild(button); // Clean up
//     });

//     clipboard.on("error", (e) => {
//       console.error("ClipboardJS Error:", e);
//       clipboard.destroy(); // Clean up
//       document.body.removeChild(button); // Clean up
//     });

//     // Simulate a user click to trigger the clipboard copy
//     button.click();
//   };

//   useEffect(() => {
//     const handleRedirect = async () => {
//       const params = getQueryParams();

//       if (params.page || params.amsh) {
//         const deviceType = getDeviceType();
//         const appUrl = `aroundme://?amsh=${params.amsh}`;
//         const appUrlForIos = `aroundme://aroundme.global/?amsh=${params.amsh}`;
//         const decodedAmsh = atob(params.amsh);

//         const referral_code = new URLSearchParams(decodedAmsh);
//         const value = referral_code.get("referrel_code");

//         if (value) {
//           // Copy the referral code to clipboard via ClipboardJS
//           handleClipboardCopy(value);
//         }

//         // Redirect to the app if possible
//         if (deviceType === "ios") {
//           window.location.href = appUrlForIos;
//         } else {
//           window.location.href = appUrl;
//         }

//         // Fallback to store if the app is not installed
//         const timeout = setTimeout(() => {
//           if (document.hasFocus()) {
//             if (deviceType === "ios") {
//               window.location.href =
//                 "https://apps.apple.com/in/app/around-me-socializing/id6636550873";
//             } else if (deviceType === "android") {
//               window.location.href =
//                 "https://play.google.com/store/apps/details?id=com.mrdots.aroundme";
//             }
//           }
//         }, 0);

//         // Clear the timeout if the page is hidden (app opened successfully)
//         const clearFallback = () => clearTimeout(timeout);
//         window.addEventListener("pagehide", clearFallback);
//         window.addEventListener("visibilitychange", () => {
//           if (document.visibilityState === "hidden") {
//             clearFallback();
//           }
//         });
//       }
//     };

//     handleRedirect();
//   }, []);

//   return null;
// };

export default RedirectHandler;
