import ThreeScene from "./Threescene";
import "./App.css";
import { useState, useRef } from "react";
const correctAnswers = {
  b1: "c6",
  b2: "c5",
  b3: "c1",
  b4: "c2",
  b5: "c4",
  b6: "c3",
};

const items = [
  { id: "c1", text: "ALUMINUM CHASIS" },
  { id: "c2", text: "UNIHENDRON DATALOGGER" },
  { id: "c3", text: "4-WHEEL DRIVE AND STEERING" },
  { id: "c4", text: "UHF DATA LINK" },
  { id: "c5", text: "PIXHAWK AUTOPILOT" },
  { id: "c6", text: "UBLOX GPS + COMPASS" },
];

function App() {
  const [count, setCount] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showresult, setShowResult] = useState(false);
  const boxSizes = useRef({});

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, boxId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(itemId);

    if (draggedElement) {
      const { offsetWidth, offsetHeight } = draggedElement;
      boxSizes.current[boxId] = { width: offsetWidth, height: offsetHeight };

      setAnswers((prev) => ({ ...prev, [boxId]: itemId }));
    }
  };

  const checkAnswer = () => {
    setShowResult(true);
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 w-screen h-screen absolute left-0 top-0">
        <div className=" relative h-[100%] w-[100%]">
          <ThreeScene />
        </div>
        <div className="col-span-1 row-span-2 bg-amber-400">
          <h2>Answer Box</h2>
          <div className="border-2 border-gray-500 p-4 w-[90%] flex flex-col gap-4 place-self-center">
            {["b1", "b2", "b3", "b4", "b5", "b6"].map((boxId) => (
              <div
                key={boxId}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, boxId)}
                className="border-2 flex items-center justify-center transition-all text-[10px] sm:text-base md:text-lg"
                style={{
                  backgroundColor: showresult
                    ? answers[boxId] === correctAnswers[boxId]
                      ? "lightgreen"
                      : "red"
                    : "white",
                }}
              >
                {answers[boxId] ? (
                  <div className="flex items-center gap-2">
                    <span>
                      {boxId.replace("b", "")}
                      {"."}
                      {items.find((i) => i.id === answers[boxId])?.text ||
                        "Unknown"}
                    </span>
                    <button
                      onClick={() => {
                        setAnswers((prev) => {
                          const updatedAnswers = { ...prev };
                          delete updatedAnswers[boxId]; // Remove answer
                          return updatedAnswers;
                        });
                      }}
                      className="bg-red-500 text-white  rounded cursor-pointer "
                    >
                      ❌
                    </button>
                  </div>
                ) : (
                  <span>{boxId.replace("b", "")}.</span>
                )}
              </div>
            ))}

            <button
              onClick={checkAnswer}
              className="bg-green-500 text-white p-2 rounded"
            >
              Check Answers
            </button>
          </div>
        </div>
        <div className="col-span-1 col-start-3 row-start-1 row-span-2 bg-amber-900">
          <div className="flex flex-col border-2 space-y-6 items-center bg-white">
            <h1 className="text-4xl">Parts</h1>
            {items.map((item) => {
              return (
                <div
                  key={item.id}
                  id={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className="bg-blue-500 text-white p-2 cursor-grab sm:text-1xl text-xs lg:text-2xl"
                >
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-start-1 row-start-2 bg-amber-600 flex items-center justify-center">
          <h1 className="text-3xl sm:text-5xl">Robotics Activity 1</h1>
        </div>
      </div>
    </>
  );
}

export default App;
