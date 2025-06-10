import { motion } from 'framer-motion';

export default function MissionVision() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Mission Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-48">
              <img
                src="https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg"
                alt="Handicraft Heritage of Bengal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Mission Srejonee</h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>Srejonee</strong> is poised to bring the fascinating Handicraft heritage of Bengal and Eastern India to you. 
                Hidden treasures of handmade Home Décor, Wall Décor, Eco-friendly Cutlery or Kitchenware, handmade jewellery, 
                exquisite Kantha stich Saris or Dupatta are scattered all over Bengal and Eastern India. Be it Terracotta, 
                Bamboo, Wood or even coconut shell is also used. These artifacts in their vibrancy and exquisiteness have a 
                defining purpose and identity to elevate themselves from just pieces of utility to finest form of traditional 
                art which is our cultural heritage.
              </p>
            </div>
          </motion.div>

          {/* Vision Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-48">
              <img
                src="https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg"
                alt="Untold Stories Behind Every Handicraft"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Vision Srejonee</h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>Srejonee</strong> opens the door to countless untold stories behind every handicraft you buy, 
                which are purely handmade, authentic and curated with love by talented artisans and our in-house experts. 
                All of our products are innovated to suit modern day living while celebrating the elegance & beauty of their legacy. 
                When you buy from us, you not only help preserve century old traditions, but you indulge into a love story ecosystem 
                built on fundamentals of Handmade, Eco-friendly, Made in India, No Chemical Hazards, Environment conscious, 
                Sustainable, No Cruelty, Women Empowerment and Fair Trade.
              </p>
            </div>
          </motion.div>

          {/* Heritage Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-48">
              <img
                src="https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg"
                alt="Our Heritage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Heritage</h2>
              <p className="text-gray-600 leading-relaxed">
                We take pride in reintroducing the huge treasure trove of Bengal Handicraft to Indians in every corner 
                of the country and the larger audience worldwide. Our commitment to preserving and promoting traditional 
                craftsmanship while adapting to contemporary needs makes each piece we offer a bridge between heritage 
                and modern living.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Showroom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src="https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg"
                alt="Srejonee Showroom 1"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src="https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg"
                alt="Srejonee Showroom 2"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-900">Srejonee's Showroom</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            Visit our Showroom for a journey through handcrafted wonders, each with its unique story—Experience Srejonee's authenticity and passion in every piece.
          </p>

          <motion.a
            href="https://www.google.com/maps/place/Srejonee+Art+%26+Creations/@22.5545665,88.3884223,15z/data=!4m6!3m5!1s0x3a027746c80c1b7f:0xe6ce6792b537654f!8m2!3d22.5555539!4d88.388783!16s%2Fg%2F11q_43sx49?entry=ttu&g_ep=EgoyMDI1MDYwNC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors duration-300"
          >
            Get Direction
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 