// chatWidgetUtils.js
export const ChatWidget = (embed_id: string, openingMessage: string) => {
  const existingScript = document.getElementById("chat-widget-script");
  const existingWidgetContainer = document.getElementById(
    "anyhting-all-wrapper"
  );

  // Remove existing script and widget container if they exist
  if (existingScript) {
    document.body.removeChild(existingScript);
  }

  if (existingWidgetContainer) {
    existingWidgetContainer.remove();
  }

  // If no embed ID is found, return
  if (!embed_id) return;

  // Create new script element with necessary attributes
  const script = document.createElement("script");
  script.id = "chat-widget-script";
  script.dataset.embedId = embed_id;
  script.src =
    "https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js";
  script.async = true;
  script.dataset.baseApiUrl = "https://anythingllm.aroundme.global/api/embed";
  script.dataset.openOnLoad = "on";
  script.dataset.openingMessage =
    openingMessage ?? "Hello, how can I help you?";

  // Append the new script to the body
  document.body.appendChild(script);
};
