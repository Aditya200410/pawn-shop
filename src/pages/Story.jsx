import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Story() {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      {/* Hero Card with Image */}
      <div className="flex justify-center px-4 pt-10">
        <motion.div
          className="rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://srejonee.com/wp-content/uploads/2022/08/indian-art-and-craft.jpg"
            alt="Srejonee Handicrafts"
            className="w-full h-[400px] object-cover"
          />
        </motion.div>
      </div>

      {/* Title Section */}
      <div className="text-center mt-10 px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-[#8B4513]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Srejonee: Bangla beyond Bengal
        </motion.h1>
        <motion.p
          className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover the unseen stories behind Bengal’s handmade marvels.
        </motion.p>
      </div>

      {/* Content Section */}
      <motion.div
        className="max-w-4xl mx-auto py-16 px-6 space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="text-lg text-gray-700 leading-relaxed">
          India is a treasure trove of handicrafts and handmade artifacts, wherein every corner
          of this country has its own interpretation of expressions. Bengal, for that matter,
          has one of the richest cultural heritage in numerous art forms, some of which are
          well recognized nationally and internationally but some hidden gems are yet to be
          discovered for the marvels that they are.
        </motion.p>

        <motion.p variants={item} className="text-lg text-gray-700 leading-relaxed">
          Are you looking for a unique collection of handicrafts that showcase the rich cultural
          heritage of ancient Bengal? Look no further than{" "}
          <span className="text-[#8B4513] font-semibold">Srejonee Art & Creations</span>! Our
          collection features an exquisite array of handicrafts that range from traditional
          pottery and textiles to modern home decor items. Each piece is carefully crafted by
          skilled artisans using age-old techniques that have been passed down through generations.
        </motion.p>

        <motion.p variants={item} className="text-lg text-gray-700 leading-relaxed">
          With Srejonee, you can bring the beauty and elegance of Bengal’s handicrafts into your
          home or workspace. Don’t settle for mass-produced decor items when you can have
          something truly special and one-of-a-kind.{" "}
          <span className="text-[#8B4513]font-semibold">Shop with Srejonee Art & Creations today!</span>
        </motion.p>

        <motion.p variants={item} className="text-lg text-gray-700 leading-relaxed">
          Your online shopping experience is always protected by our support team 24×7 by mail
          and phone. Please register yourself at{" "}
         
          for product updates and promotions or write to us at{" "}
          <a href="mailto:srejonee@gmail.com" className="underline text-[#8B4513]">
            srejonee@gmail.com
          </a>{" "}
          and let us know your feedback, suggestions and concerns.
        </motion.p>
      </motion.div>
    </div>
  );
}
