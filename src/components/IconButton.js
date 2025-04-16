import React from 'react';
import { motion } from 'framer-motion';

const IconButton = ({ icon, onClick, count = 0, label }) => (
  <motion.button
    onClick={onClick}
    aria-label={label}
    className="relative p-2 transition-colors duration-200 text-gray-800 hover:text-black"
  >
    {icon}
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full px-2">
        {count}
      </span>
    )}
  </motion.button>
);

export default IconButton;
