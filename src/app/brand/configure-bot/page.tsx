"use client";

import { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { ChromePicker, ColorResult } from "react-color";
import useWidgitThemeStore from "@/store/useWidgitThemeStore";
import { IoMoonOutline } from "react-icons/io5";
import { CiLight } from "react-icons/ci";
import api from "@/lib/axiosInstance";
import useBrandStore from "@/store/useBrandStore";

interface ColorFieldProps {
  label: string;
  name: string;
}

const colorFields: ColorFieldProps[] = [
  { label: "User Chat Bubble Color", name: "userBgColor" },
  { label: "User Text Color", name: "userTextColor" },
  { label: "Assistant Chat Bubble Color", name: "assistantBgColor" },
  { label: "Bot Text Color", name: "botTextColor" },
  { label: "Header Color", name: "headerColor" },
  { label: "Text Header Color", name: "textHeaderColor" },
  { label: "Background Color", name: "bgColor" },
  { label: "Input Bar Color", name: "inputbarColor" },
  { label: "Card Background Color", name: "cardBgColor" },
  { label: "Card Text Color", name: "cardTextColor" },
  { label: "Card Text Sub Color", name: "cardTextSubColour" },
  // { label: "Prompt Background Color", name: "prompotBgColor" },
  // { label: "Prompt Border Color", name: "promptBorderColor" },
];

export default function PageComponent() {
  const brandId = useBrandStore((state) => state.brandId);
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
  const [currentColorField, setCurrentColorField] = useState<string | null>(
    null
  );
  const [colorFieldSetters, setColorFieldSetters] = useState<
    Record<string, (color: string) => void>
  >({});
  const [initialValues, setInitialValues] = useState<Record<string, string>>(
    {}
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [tempColour, setTempColour] = useState<string | null>(null);

  // Use Zustand store for theme management
  const { changedFields, theme, toggleTheme } = useWidgitThemeStore();

  useEffect(() => {
    setInitialValues(changedFields);
  }, []);

  useEffect(() => {
    const hasChanges = Object.keys(changedFields).some(
      (key) => changedFields[key] !== initialValues[key]
    );
    setIsChanged(hasChanges);
  }, [changedFields, initialValues]);

  const handleColorFieldClick = (fieldName: string) => {
    setCurrentColorField(fieldName);
    setColorPickerOpen(true);
  };

  const handleColorChange = (colorResult: ColorResult) => {
    setTempColour(colorResult.hex);
    if (colorFieldSetters[currentColorField!]) {
      colorFieldSetters[currentColorField!](colorResult.hex);
    }
  };

  const handleSave = () => {
    if (currentColorField && tempColour) {
      useWidgitThemeStore.setState((state) => ({
        changedFields: {
          ...state.changedFields,
          [currentColorField]: tempColour,
        },
      }));
      setTempColour(null);
      setColorPickerOpen(false);
    }
  };

  useEffect(() => {
    const existingScript = document.getElementById("chat-widget-script");
    const existingWidgetContainer = document.getElementById(
      "anything-llm-embed-chat-container"
    );

    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    if (existingWidgetContainer) {
      existingWidgetContainer.remove();
    }

    const script = document.createElement("script");
    script.id = "chat-widget-script";
    script.src =
      "https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js";
    script.async = true;
    script.dataset.openOnLoad = "on";

    Object.keys(changedFields).forEach((key) => {
      script.dataset[key] = changedFields[key];
    });

    document.body.appendChild(script);

    return () => {
      if (script) {
        script.dataset.openOnLoad = "off";

        document.body.removeChild(script);
      }
      const widgetContainerCleanup = document.getElementById(
        "anyhting-all-wrapper"
      );
      if (widgetContainerCleanup) {
        widgetContainerCleanup.remove();
      }
    };
  }, [changedFields]);

  const onSend = async () => {
    console.log("Selected Values:", changedFields);
    const body = {
      theme: {
        userBgColor: changedFields.userBgColor,
        assistantBgColor: changedFields.assistantBgColor,
        headerColor: changedFields.headerColor,
        textHeaderColor: changedFields.textHeaderColor,
        bgColor: changedFields.bgColor,
        inputbarColor: changedFields.inputbarColor,
        cardBgColor: changedFields.cardBgColor,
        userTextColor: changedFields.userTextColor,
        botTextColor: changedFields.botTextColor,
        cardTextColor: changedFields.cardTextColor,
        cardTextSubColour: changedFields.cardTextSubColour,
      },
    };
    const res = await api.post(
      `${process.env.NEXT_PUBLIC_DEVBASEURL}/widget_theme/?brand_id=${brandId}`,
      body
    );
    console.log("res", res.data);
  };
  return (
    <div className="ml-20 px-5 overflow-y-auto h-screen">
      <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
        Widget theme
      </h1>

      <div className=" w-[60%] flex my-6 items-center justify-between">
        <div className="bg-[#161616] rounded-[20px] overflow-hidden">
          <button
            onClick={() => toggleTheme("dark")}
            className={`px-4 py-4 rounded-[20px] ${
              theme === "dark" ? "bg-white text-black" : " text-white"
            }`}
          >
            <div className="flex items-center gap-1">
              <IoMoonOutline /> Dark Theme
            </div>
          </button>
          <button
            onClick={() => toggleTheme("light")}
            className={`px-4 py-4 rounded-[20px] ${
              theme === "light" ? "bg-white text-black" : " text-white"
            }`}
          >
            <div className="flex items-center gap-1">
              <CiLight /> Light Theme
            </div>
          </button>
        </div>

        <button
          onClick={onSend}
          disabled={!isChanged}
          className={`px-4 py-4 rounded-[20px] text-black ${
            isChanged
              ? "bg-white hover:bg-blue-600 active:bg-green-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Publish
        </button>
      </div>

      <div className="w-full h-[80%] gap-5 flex no-scrollbar">
        <div className="w-[60%] h-full overflow-y-auto overflow-hidden bg-[#161616] rounded-[12px] p-6 no-scrollbar">
          <Formik initialValues={changedFields} onSubmit={() => {}}>
            {() => (
              <Form className="space-y-4">
                {colorFields.map(({ label, name }) => (
                  <ColorField
                    key={name}
                    label={label}
                    name={name}
                    value={changedFields[name]}
                    onClick={() => handleColorFieldClick(name)}
                    setSelectedColor={(color) => {
                      setSelectedColorInField(name, color);
                    }}
                  />
                ))}
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {colorPickerOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-[#1d1d1d] p-4 rounded-xl">
            <ChromePicker
              color={tempColour || changedFields[currentColorField!]} // Use tempColour for current color
              onChangeComplete={handleColorChange}
            />
            <div className="flex gap-5">
              <button
                onClick={() => setColorPickerOpen(false)}
                className="mt-4 px-4 py-2 bg-red-500/40 text-white rounded border border-red-500 hover:bg-red-500 hover:border-red-600 active:bg-red-600"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-500/40 text-white rounded border border-blue-500 hover:bg-blue-500 hover:border-blue-600 active:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function setSelectedColorInField(name: string, color: string) {
    setColorFieldSetters((prev) => ({
      ...prev,
      [name]: (c) => setSelectedColorInField(name, c),
    }));
  }
}

interface IndividualColorFieldProps {
  label: string;
  name: string;
  value?: string;
  onClick?: () => void;
  setSelectedColor?: (color: string) => void;
}

const ColorField = ({
  label,
  name,
  value,
  onClick,
}: IndividualColorFieldProps) => {
  const colors = [
    "#7939EE",
    "#434CE6",
    "#165EF1",
    "#2E90FD",
    "#078AB2",
    "#0A9250",
  ];

  const [selectedColor, setSelectedColorLocal] = useState<string | undefined>(
    value
  );

  const handleColorSelect = (color: string) => {
    setSelectedColorLocal(color);
    useWidgitThemeStore.setState((state) => ({
      changedFields: { ...state.changedFields, [name]: color },
    }));
  };

  useEffect(() => {
    setSelectedColorLocal(value);
  }, [value]);

  return (
    <div className="flex justify-between bg-[#1d1d1d] p-3 rounded-[12px]">
      <div>
        <label className="text-white text-[17px] font-semibold">{label}</label>
        <h2 className="text-[15px] text-[#fff]/60 mt-2">
          Customize your color
        </h2>
      </div>
      <div>
        <div className="flex justify-evenly mt-2">
          {colors.map((color) => (
            <div
              key={color}
              className={`w-8 h-8 rounded-full border-2 cursor-pointer transition ${
                selectedColor === color
                  ? "border-white scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
        <div className="flex gap-3 items-center mt-3 bg-[#222222] px-3 py-2 rounded-xl">
          <div>Custom color:</div>
          <Field
            type="text"
            name={name}
            value={value}
            readOnly
            className="mt-1 px-2 py-1 max-w-[90px] w-auto rounded-xl items-center justify-center bg-transparent border border-[#5a5a5a]/50 focus:outline-none focus:border-blue-500 text-white cursor-pointer text-center"
            onClick={onClick}
          />
          <div
            className="w-10 h-10 rounded-xl border-[1px] border-[#5a5a5a]"
            style={{ backgroundColor: value }}
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
};
