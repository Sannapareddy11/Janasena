import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default PageLayout;
