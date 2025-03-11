"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaMicrophone, FaPaperPlane, FaTrash } from "react-icons/fa";
import { IoMdArrowUp } from "react-icons/io";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

interface VoiceInputbarProps {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  onSend: (transcript: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setTempVoiceId: (id: string) => void;
  tempVoiceId: string | null;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
}

export default function VoiceInputbar({
  setMessages,
  onSend,
  setIsRecording,
  setTempVoiceId,
  tempVoiceId,
  setInputValue,
  inputValue,
}: VoiceInputbarProps) {
  const [isRecording, setIsInternalRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [error, setError] = useState("");
  const recorderControls = useVoiceVisualizer();
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { recordingTime } = recorderControls;
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const createRecognitionInstance = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return null;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = (event: SpeechRecognitionEvent) => {
      let newFinal = "";
      let newInterim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          newFinal += result[0].transcript;
        } else {
          newInterim += result[0].transcript;
        }
      }
      setFinalTranscript((prev) => prev + newFinal);
      setInterimTranscript(newInterim);
    };

    recog.onerror = (event: any) => {
      setError("Recognition error: " + event.error);
    };

    recog.onstart = () => {
      console.log("Speech recognition started");
      setIsInternalRecording(true);
      setIsRecording(true);
      setIsTyping(false);
      setInputValue(""); // Clear text input when recording starts
    };

    recog.onend = () => {
      console.log("Speech recognition ended");
      setIsInternalRecording(false);
      setIsRecording(false);
    };

    return recog;
  }, [setIsRecording, setInputValue]);

  const handleRecord = () => {
    if (!isRecording) {
      const newTempId = crypto.randomUUID();
      setTempVoiceId(newTempId);
      setMessages((prev) => [
        ...prev,
        { id: newTempId, sender: "You", text: "", isTemp: true },
      ]);

      setFinalTranscript("");
      setInterimTranscript("");
      const recog = createRecognitionInstance();

      if (recog) {
        setRecognition(recog);
        try {
          recog.start();
          recorderControls.startRecording();
        } catch (err: any) {
          console.error("Error starting recognition:", err);
          setError("Error starting recognition: " + err.message);
        }
      }
    }
  };

  const handleSend = () => {
    if (isRecording && recognition) {
      recognition.stop();
      recorderControls.stopRecording();
    }

    const fullTranscript = finalTranscript + interimTranscript;
    if (fullTranscript) {
      onSend(fullTranscript);
    } else if (inputValue.trim()) {
      onSend(inputValue.trim()); // Send text input if voice is empty
    }

    setFinalTranscript("");
    setInterimTranscript("");
    setInputValue(""); // Clear text input after sending
    setIsTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsTyping(e.target.value.trim() !== ""); // Enable send button if typing
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      handleSend();
    }
  };

  useEffect(() => {
    if (isRecording && tempVoiceId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempVoiceId
            ? { ...msg, text: finalTranscript + interimTranscript }
            : msg
        )
      );
    }
  }, [
    finalTranscript,
    interimTranscript,
    isRecording,
    tempVoiceId,
    setMessages,
  ]);

  return (
    <>
      {error}
      <div className="flex items-center bg-[#1d1d1d] border-t gap-[10px] m-2 rounded-[12px] px-3 py-1">
        {isRecording && (
          <FaTrash
            size={18}
            className=" cursor-pointer"
            onClick={() => {
              if (recognition) {
                recognition.stop();
              }
              recorderControls.stopRecording();
              setIsInternalRecording(false);
              setIsRecording(false);
              setFinalTranscript(""); // Clear transcribed speech
              setInterimTranscript(""); // Clear interim speech
              setTempVoiceId(null); // Reset temp voice ID
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== tempVoiceId)
              ); // Remove temp message from UI
            }}
          />
        )}
        {isRecording ? (
          <div className="p-2 flex-1 flex items-center px-2 justify-start rounded-3xl border border-[#5e5e5e] gap-2">
            {/* Recording Time */}
            <p className="text-xs text-whitepx-2 py-1 rounded-md flex items-center">
              {formatTime(recordingTime)}
            </p>

            {/* Voice Visualizer */}
            <div className="flex-grow">
              <VoiceVisualizer
                controls={recorderControls}
                height={20}
                mainBarColor="#fff"
                secondaryBarColor="#5e5e5e"
                barWidth={4}
                gap={1}
                isControlPanelShown={false}
                isDefaultUIShown={false}
                onlyRecording={true}
              />
            </div>
          </div>
        ) : (
          <input
            ref={inputRef}
            className="flex-grow px-2 py-1 rounded-[8px] outline-none bg-[#1d1d1d] placeholder:text-[#fff]/20 text-white"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
          />
        )}
        {isTyping || isRecording ? (
          <button
            className="cursor-pointer p-1 rounded-full  bg-blue-500"
            onClick={handleSend}
          >
            <IoMdArrowUp size={18} />
          </button>
        ) : (
          <FaMicrophone size={18} onClick={handleRecord} />
        )}
      </div>
    </>
  );
}
