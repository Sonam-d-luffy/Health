import React, { useState } from "react";
import axios from "axios";

const Bot = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {
    if (!question.trim() || loading) return;

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setSources([]);

      const response = await axios.post(
        `${VITE_AI_URL}/ask`,
        {
          question: question.trim(),
        }
      );

      setAnswer(response.data.answer);
      setSources(response.data.sources || []);

    } catch (err) {
      console.error("RAG Error:", err);

      setError(
        "Unable to connect to the AI Trainer. Make sure the RAG server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  return (
    <div className="min-h-full text-white px-4 py-6 bg-transparent">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-7">

          {/* AI Icon */}
          <div
            className="
              inline-flex items-center justify-center
              w-14 h-14
              rounded-2xl
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              shadow-[0_8px_30px_rgba(0,0,0,0.25)]
              mb-4
            "
          >
            <span className="text-xl font-bold text-white">
              AI
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white">
            AI Fitness Trainer
          </h1>

          <p className="text-gray-300/80 text-sm mt-2">
            Ask me anything about workouts, training and fitness.
          </p>

        </div>

        {/* Chat Box */}
        <div
          className="
            bg-white/[0.08]
            border border-white/15
            backdrop-blur-2xl
            rounded-2xl
            p-4
            shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          "
        >

          {/* Input + Send */}
          <div
            className="
              flex items-end gap-2
              bg-black/20
              border border-white/10
              rounded-2xl
              p-2
              backdrop-blur-xl
            "
          >

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              rows={1}
              className="
                flex-1
                resize-none
                bg-transparent
                px-3 py-3
                text-white
                placeholder-gray-400
                outline-none
                text-sm
                max-h-28
              "
            />

            {/* WhatsApp Style Send Button */}
            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
              aria-label="Send message"
              className="
                flex-shrink-0
                w-11 h-11
                rounded-full
                flex items-center justify-center
                bg-white
                text-black
                shadow-lg
                transition-all duration-200
                hover:scale-105
                hover:bg-gray-200
                active:scale-95
                disabled:bg-white/20
                disabled:text-gray-500
                disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              {loading ? (
                <div
                  className="
                    w-5 h-5
                    border-2
                    border-gray-400
                    border-t-black
                    rounded-full
                    animate-spin
                  "
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 ml-0.5"
                >
                  <path d="M3.4 20.4 22 12 3.4 3.6 3 10l13 2-13 2 .4 6.4Z" />
                </svg>
              )}
            </button>

          </div>

          <p className="text-[11px] text-gray-400/70 mt-2 px-2">
            Press Enter to send
          </p>

        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mt-5
              bg-red-500/10
              border border-red-400/20
              backdrop-blur-xl
              text-red-300
              rounded-2xl
              p-4
              text-sm
            "
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            className="
              mt-6
              bg-white/[0.06]
              border border-white/10
              backdrop-blur-2xl
              rounded-2xl
              p-5
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  w-5 h-5
                  border-2
                  border-gray-500
                  border-t-white
                  rounded-full
                  animate-spin
                "
              />

              <p className="text-gray-300 text-sm">
                AI Trainer is thinking...
              </p>

            </div>
          </div>
        )}

        {/* Answer */}
        {answer && !loading && (
          <div className="mt-6">

            <div
              className="
                bg-white/[0.09]
                border border-white/15
                backdrop-blur-2xl
                rounded-2xl
                p-5
                shadow-[0_8px_40px_rgba(0,0,0,0.2)]
              "
            >

              {/* AI Header */}
              <div className="flex items-center gap-3 mb-4">

                <div
                  className="
                    w-9 h-9
                    rounded-xl
                    bg-white
                    text-black
                    flex items-center justify-center
                    font-bold
                    text-xs
                    shadow-md
                  "
                >
                  AI
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    AI Trainer
                  </h2>

                  <p className="text-[11px] text-gray-400">
                    Fitness Assistant
                  </p>
                </div>

              </div>

              {/* Answer */}
              <div
                className="
                  text-gray-200
                  leading-7
                  text-sm
                  whitespace-pre-line
                "
              >
                {answer}
              </div>

            </div>

          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && !loading && (
          <div className="mt-6">

            <h2 className="text-lg font-semibold text-white mb-3">
              Sources
            </h2>

            <div className="grid gap-3">

              {sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block
                    bg-white/[0.06]
                    border border-white/10
                    backdrop-blur-xl
                    rounded-xl
                    p-4
                    hover:bg-white/[0.10]
                    hover:border-white/20
                    transition-all duration-200
                  "
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <h3 className="font-medium text-white text-sm truncate">
                        {source.title}
                      </h3>

                      <p className="text-xs text-gray-400 mt-1">
                        {source.channel}
                      </p>

                    </div>

                    <span
                      className="
                        flex-shrink-0
                        text-[10px]
                        bg-white/10
                        border border-white/10
                        text-gray-300
                        px-2 py-1
                        rounded-full
                      "
                    >
                      {source.category}
                    </span>

                  </div>

                </a>
              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Bot;