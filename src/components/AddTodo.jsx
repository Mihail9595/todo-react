import { useEffect, useRef, useState } from "react";
import DeadlineBlock from "./DeadlineBlock";
import PlusIcon from "./PlusIcon";
import MicrophoneIcon from "../assets/microphone.png";

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const finalTextRef = useRef("");
  const inputRef = useRef(null); // Добавляем ref для input

  // Функция для перемещения курсора в конец input
  const moveCursorToEnd = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);

      // Прокручиваем input до конца, если текст не помещается
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setText(finalTextRef.current);
      moveCursorToEnd(); // Перемещаем курсор в конец при остановке записи
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.lang = "ru-RU";
        recognitionInstance.interimResults = true;
        recognitionInstance.onresult = (event) => {
          let finalTranscript = "";
          let interimScript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimScript += transcript;
            }

            if (finalTranscript) {
              finalTextRef.current =
                finalTextRef.current + " " + finalTranscript;
              setText(finalTextRef.current);
            } else if (interimScript) {
              setText(finalTextRef.current + " " + interimScript);
            }
          }
          moveCursorToEnd(); // Перемещаем курсор в конец при каждом обновлении текста
        };
        recognitionInstance.onerror = (event) => {
          console.error("Ошибка распознования:", event.error);
          stopListening();
        };

        recognitionInstance.onend = () => {
          if (isListening) {
            recognitionInstance.start();
          }
        };

        setRecognition(recognitionInstance);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text, deadline);
      setText("");
      setDeadline("");
      setShowDeadlineInput(false);
      finalTextRef.current = "";
    } else {
      alert("ВВедите текст задачи!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div
        className="flex flex-col min-[375px]:flex-row items-center bg-white rounded-lg shadow-sm overflow-hidden 
      border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500  dark:bg-page-dark"
      >
        <input
          ref={inputRef} // Добавляем ref к input
          type="text"
          placeholder="Добавить задачу"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-3 text-gray-700
          outline-none placeholder-gray-400  dark:text-txt-dark"
        />
        <div className="flex items-center justify-end w-full max-[374px]:justify-center border-t-1 border-gray-100 min-[375px]:border-0 ">
          <button
            type="button"
            onClick={toggleListening}
            className={`cursor-pointer p-3 ${
              isListening
                ? "bg-red-500 hover:bg-red-700"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700"
            } hover:bg-gray-300 transition-colors duration-300 
          flex items-center justify-center`}
            title={isListening ? "Остановить запись" : "Начать запись голоса"}
          >
            <img
              src={MicrophoneIcon}
              alt="Микрофон"
              className={`w-6 h-6 ${
                isListening ? "filter brightness-0 invert" : ""
              }`}
            />
          </button>
          <button
            type="submit"
            className={`p-3 ${
              isListening
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-btn-light hover:bg-btn-light-hv cursor-pointer hover:dark:bg-btn-dark-hv"
            } bg-btn-light  text-white
           dark:bg-btn-dark 
        transition-colors duration-300`}
            disabled={isListening}
          >
            <PlusIcon />
          </button>
        </div>
      </div>
      <DeadlineBlock
        showDeadlineInput={showDeadlineInput}
        deadline={deadline}
        setDeadline={setDeadline}
        setShowDeadlineInput={setShowDeadlineInput}
      />
      {isListening && (
        <div className="mt-2 text-sm text-blue-500 flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
          <span>Идет запись... Нажмите микрофон для остановки</span>
        </div>
      )}
    </form>
  );
};

export default AddTodo;
