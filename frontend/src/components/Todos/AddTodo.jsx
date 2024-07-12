import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { Form, FormItem } from "@/components/ui/form";

const speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new speechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

export const AddTodo = ({ handleAddTodo, defaultTask }) => {
  const [title, setTitle] = useState(defaultTask?.title || "");
  const [body, setBody] = useState(defaultTask?.body || "");
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("");
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("Continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stop..");
      };
    }

    mic.onstart = () => {
      console.log("Mics On");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setNote(transcript);

      if (activeField === "title") {
        setTitle(transcript);
      } else if (activeField === "body") {
        setBody(transcript);
      }
    };

    mic.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };

    return () => {
      mic.stop();
      mic.onend = null;
      mic.onresult = null;
      mic.onerror = null;
    };
  }, [isListening]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && body) {
      handleAddTodo({ title, body });
      setTitle("");
      setBody("");
    }
  };

  const handleMicClick = (field) => {
    if (isListening) {
      mic.stop();
      setIsListening(false);
    } else {
      setActiveField(field);
      setIsListening(true);
    }
  };

  return (
    <Form>
      <form
        onSubmit={handleSubmit}
        className="AddTodo p-4 bg-white shadow-md rounded-lg"
      >
        <FormItem className="mb-4">
          <div className="flex items-center">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="todo-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
            />
            <FontAwesomeIcon
              icon={faMicrophone}
              className={`text-gray-600 cursor-pointer hover:text-blue-500 ml-2 ${
                isListening && activeField === "title" ? "text-blue-500" : ""
              }`}
              onClick={() => handleMicClick("title")}
            />
          </div>
        </FormItem>

        <FormItem className="mb-4">
          <div className="flex items-center">
            <Input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="todo-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Body"
            />
            <FontAwesomeIcon
              icon={faMicrophone}
              className={`text-gray-600 cursor-pointer hover:text-blue-500 ml-2 ${
                isListening && activeField === "body" ? "text-blue-500" : ""
              }`}
              onClick={() => handleMicClick("body")}
            />
          </div>
        </FormItem>

        <Button
          variant="ghost"
          type="submit"
          className="py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Task
        </Button>
      </form>
    </Form>
  );
};
