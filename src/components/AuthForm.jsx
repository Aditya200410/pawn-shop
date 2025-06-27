import React from "react";
import { motion } from "framer-motion";

export default function AuthForm({ fields, handleChange, handleSubmit, loading, buttonText }) {
  return (
    <motion.div
      className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <input
            key={index}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={field.value}
            required={field.required}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 rounded relative overflow-hidden group"
          style={{ 
            backgroundImage: 'url(/footer.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
          <span className="relative z-10 text-white font-medium">
            {loading ? 'Loading...' : buttonText}
          </span>
        </button>
      </form>
    </motion.div>
  );
}
