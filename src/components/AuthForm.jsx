import React from "react";
import { motion } from "framer-motion";

export default function AuthForm({ onSubmit, title, buttonText, formData, setFormData }) {
  return (
    <motion.div
      className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          required
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 rounded relative overflow-hidden group"
          style={{ 
            backgroundImage: 'url(/footer.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
          <span className="relative z-10 text-white font-medium">{buttonText}</span>
        </button>
      </form>
    </motion.div>
  );
}
