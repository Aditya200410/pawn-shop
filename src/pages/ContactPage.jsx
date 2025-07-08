import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-[#8B4513]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Let’s Get In Touch!
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-center text-gray-600 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Give us a call or send us an email and we will get back to you as soon as possible!
        </motion.p>

        {/* Info Card */}
        <motion.div
          className="mt-12 bg-gray-100 rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-[#8B4513] mb-4">Contact Info</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Srejonee would like to thank you for showing your interest in us. Don’t hesitate to
            contact us today if you have any questions. You can also get in touch to know about
            our services or to tell us about your needs. Drop an email or call us anytime you want
            our attention. We won’t keep you waiting long!
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Address:</h3>
              <p className="text-gray-700">
                M/S Srejonee Art & Creations<br />
                623 Active Business Park<br />
                54/10 D C Dey Road<br />
                Tangra, Kolkata – 808015<br />
                West Bengal, India
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800">Email:</h3>
              <a
                href="mailto:srejonee@gmail.com"
                className="text-[#8B4513] underline"
              >
                srejonee@gmail.com
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800">Phone no.:</h3>
              <a
                href="tel:+917439906048"
                className="text-[#8B4513] underline"
              >
                +91 74399 06048
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
