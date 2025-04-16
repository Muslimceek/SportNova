// ProgressBar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProgressBar = ({ steps, currentStep }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex justify-center items-center mb-8 mt-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform ${
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white scale-110 shadow-lg"
                  : isCompleted
                  ? "bg-green-500 text-white hover:scale-110 transition-transform"
                  : "bg-gray-300 text-gray-700 hover:scale-110 transition-transform"
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(step.route)}
            >
              {isCompleted ? "✈️" : index + 1}
            </motion.div>

            {index < steps.length - 1 && (
              <motion.div
                className={`w-12 h-1 mx-2 rounded-full transition-all ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
                initial={{ width: 0 }}
                animate={{ width: "3rem" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              ></motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

export default ProgressBar;