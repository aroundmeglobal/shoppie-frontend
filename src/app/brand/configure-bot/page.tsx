"use client";

import { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { ChromePicker, ColorResult } from "react-color";
import useWidgitThemeStore from "@/store/useWidgitThemeStore";
import { IoMoonOutline } from "react-icons/io5";
import { CiLight } from "react-icons/ci";
import api from "@/lib/axiosInstance";
import useBrandStore from "@/store/useBrandStore";
import toast from "react-hot-toast";
import useCustomWidgetThemeStore from "@/store/useCustomWidgetThemeStore";
import Spinner from "@/component/Spinner";
import Image from "next/image";
import DummyChatBot from "@/component/ChatBot/DummyChatBot";
import { colorCategories } from "@/constants";

export default function PageComponent() {
  const { brandName, logo, brandId, displayMessage } = useBrandStore();
  const { theme: customTheme, setTheme }: any = useCustomWidgetThemeStore();
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
  const { changedFields, theme, toggleTheme, updateCustomTheme } =
    useWidgitThemeStore();

  const [showChatBot, setShowChatBot] = useState(true);

  const [loading, setLoading] = useState(true);

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

  const onSend = async () => {
    try {
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
          startingMessageTheme: changedFields.startingMessageTheme,
          openingMessageTextColor: changedFields.openingMessageTextColor,
          inputTextColor: changedFields.inputTextColor,
        },
      };
      toast.promise(
        api.post(
          `${process.env.NEXT_PUBLIC_DEVBASEURL}/widget_theme/?brand_id=${brandId}`,
          body
        ),
        {
          loading: "Updating theme...",
          success: () => {
            setTheme({
              ...body.theme,
              embedId: "bbc22a75-2033-41a9-8327-6e51caad0c39",
              baseApiUrl: "https://anythingllm.aroundme.global/api/embed",
            });
            setIsChanged(false);
            toggleTheme("custom");
            updateCustomTheme({
              ...body.theme,
              embedId: "bbc22a75-2033-41a9-8327-6e51caad0c39",
              baseApiUrl: "https://anythingllm.aroundme.global/api/embed",
            });
            return <b>Theme updated</b>;
          },

          error: <b>Could not update the theme. Please try again!</b>,
        }
      );
    } catch (error) {
      toast.error(
        "Something went wrong while updating theme. Please try again later!"
      );
    }
  };

  useEffect(() => {
    setInitialValues(changedFields);
  }, []);

  useEffect(() => {
    const hasChanges = Object.keys(changedFields).some(
      (key) => changedFields[key] !== initialValues[key]
    );

    setIsChanged(hasChanges);
  }, [changedFields, initialValues]);

  useEffect(() => {
    const widgetContainerCleanup = document.getElementById(
      "anyhting-all-wrapper"
    );
    if (widgetContainerCleanup) {
      widgetContainerCleanup.remove();
    }
  }, []);

  useEffect(() => {
    if (brandId) {
      setLoading(false);
    }
  }, [brandId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="ml-20 px-5">
      <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
        Widget theme
      </h1>
      <div className="flex justify-between h-full ">
        <div className="flex flex-col w-[60%] ">
          <div className=" flex my-6 items-center justify-between ">
            <div className="bg-[#161616] rounded-[20px] overflow-hidden space-x-2">
              <button
                onClick={() => {
                  toggleTheme("dark");
                }}
                className={`px-4 py-4 rounded-[20px] ${
                  theme === "dark" ? "bg-white text-black" : " text-white"
                }`}
              >
                <div className="flex items-center gap-1">
                  <IoMoonOutline /> Dark Theme
                </div>
              </button>
              <button
                onClick={() => {
                  toggleTheme("light");
                }}
                className={`px-4 py-4 rounded-[20px] ${
                  theme === "light" ? "bg-white text-black" : " text-white"
                }`}
              >
                <div className="flex items-center gap-1">
                  <CiLight /> Light Theme
                </div>
              </button>
              {customTheme.userBgColor && (
                <button
                  onClick={() => toggleTheme("custom")}
                  className={`px-4 py-4 rounded-[20px] ${
                    theme === "custom" ? "bg-white text-black" : " text-white"
                  }`}
                >
                  <div className="flex items-center gap-1">Custom Theme</div>
                </button>
              )}
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

          <div className="flex-grow overflow-y-auto no-scrollbar h-[calc(100vh-200px)] bg-[#161616] rounded-[12px] p-6">
            <Formik initialValues={changedFields} onSubmit={() => {}}>
              {() => (
                <Form className="space-y-4">
                  {colorCategories.map((category) => (
                    <div key={category.category}>
                      <h3 className="text-xl font-semibold text-white pt-2 ">
                        {category.category}
                      </h3>
                      <div className="mt-4  rounded-2xl overflow-hidden ">
                        {category.fields.map((field, index) => (
                          <div key={field.name} className=" bg-[#1d1d1d]">
                            <ColorField
                              label={field.label}
                              name={field.name}
                              value={changedFields[field.name]}
                              onClick={() => handleColorFieldClick(field.name)}
                              setSelectedColor={(color) => {
                                setSelectedColorInField(field.name, color);
                              }}
                            />
                            {index !== category.fields.length - 1 && (
                              <div className="border-[#5A5A5A]/50 border-[0.5px]  bg-[#1d1d1d] mt-2  " />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {!showChatBot && (
          <div className="bottom-10 right-5 fixed cursor-pointer flex flex-col items-center">
            {/* Wrapper to keep the message and logo aligned properly */}
            <div className="relative flex flex-col items-center mr-8">
              {/* Message Box */}
              <div
                className="relative rounded-xl bottom-[80px]  shadow-md max-w-[300px] min-w-[100px] px-4 py-2 mr-auto "
                style={{ backgroundColor: changedFields.startingMessageTheme }}
              >
                <div id="displayMessage" className="rounded-xl text-sm">
                  <span
                    style={{ color: changedFields.openingMessageTextColor }}
                  >
                    {displayMessage || "Hello, how can I help you?"}
                  </span>
                </div>

                {/* Message Tail */}
                <div
                  className="absolute -bottom-4 right-0 -translate-x-1/2 border-t-[20px] border-l-[16px] border-l-transparent border-r-[14px] border-r-transparent"
                  style={{ borderTopColor: changedFields.startingMessageTheme }}
                />
              </div>

              {/* Logo (Now Positioned Independently) */}
              <div className=" bottom-8 right-8 fixed">
                <Image
                  onClick={() => setShowChatBot(true)}
                  src={
                    logo || "https://storage.aroundme.global/avatar_default.png"
                  }
                  alt="Logo"
                  width={65}
                  height={65}
                  className="object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        )}

        <div
          className={`fixed  
          transform transition-all duration-300 origin-bottom-right right-5 
          ${showChatBot ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        `}
        >
          <DummyChatBot
            brandName={brandName}
            logo={logo}
            changedFields={changedFields}
            showBot={showChatBot}
            setShowBot={setShowChatBot}
          />
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
    "#FAFAFA",
    "#161616",
    "#003CC9",
    "#7939EE",
    "#2E90FD",
    "#118A4F",
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
    <div className="flex justify-between bg-[#1d1d1d] p-3 ">
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
