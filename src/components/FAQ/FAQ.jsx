import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqCategories = [
  {
    title: 'About RIKO CRAFT',
    questions: [
      {
        q: 'Is Riko Craft An Indian Company?',
        a: 'Yes, RIKO CRAFT is a registered proprietorship start-up company in India. Full name of the company is **Riko Craft Art & Creations.**'
      },
     
      {
        q: 'Where Can I Buy Riko Craft Products In India?',
        a: '• You can buy RIKO CRAFT products directly from our Stores: "Riko Craft Gallery" at Jamshedpur,jharkhand.\n• **Alternatively** you can also buy our products **online** from our website: **rikocraft.com**'
      },
      {
        q: 'Are Riko Craft Products Available Internationally?',
        a: 'Yes, we export our products directly to our customers in Europe, USA, Canada, Middle East, Australia and many more other countries.'
      },
      {
        q: 'Are Gift Vouchers / Discount Coupons Available At Riko Craft Gallery / Online?',
        a: '• Yes, walk-in customers normally enjoy a Gift Voucher at our Stores.\n• Registered Customers of RIKO CRAFT enjoy 10% Discount on MRP while buying from our website **rikocraft.com**\n• Furthermore, we run different promotion Schemes / Festive Sale for our registered customers or general public time to time.'
      }
    ]
  },
  {
    title: 'About RIKO CRAFT Products',
    questions: [
      {
        q: 'Where Are Your Manufacturing Facilities Located?',
        a: 'Riko Craft does have a small production unit in Jamshedpur, Jharkhand where few of our products are manufactured but majority of our products are created by village-based artisans across Jharkhand. We identify, develop and nurture age old traditional skills of talented artisans across Bengal and work in close association with them to preserve the Art Form to prevent it from extinction. This commitment has helped preserve many traditional crafts of India and created employment opportunities in deep rural areas.'
      },
      {
        q: 'Are All RIKO CRAFT Products Handmade?',
        a: 'YES almost all of Riko Craft products are purely handmade using age old traditional skills. In some products such as appeal etc, if the cloth is from power loom, the final product is made using hand stitch, hand-woven, hand block-print etc process using vegetable dyes or natural colours as far as possible.'
      },
      {
        q: 'Do RIKO CRAFT Sizes Conform To International Norms?',
        a: 'There are no true international norms for clothing and every company tends to have its own sizing standards. You can refer to our Size Guide where we have suggested basic guidelines of how RIKO CRAFT sizing compares to other international sizing. The best approach is to take your own measurements and compare these to our measurement charts.'
      }
    ]
  },
  {
    title: 'How To Shop',
    questions: [
      {
        q: 'How Do I Shop Online?',
        a: 'It\'s fairly easy. Select products of your choice from 350+ products classified in different broad Category in our website. Place them in your \'Shopping Cart\'. Press \'Check out\' button – Insert Discount Coupon Code, if you have any – tick the \'I Agree\' check box – Make Payment using your Debit/ Credit Card/Net Banking/ Wallet or any other option given. Tick EMI Option if you so desire. Your purchase is complete.'
      },
      {
        q: 'How Will I Know If You Have Received My Order?',
        a: 'During the payment process you will be given a confirmation that your credit /debit card has been successfully processed. **You get a on-screen notification \'Successfully Placed Order\'.** You will also be given an order confirmation number through an email / SMS from Riko Craft.'
      },
      {
        q: 'Is It Safe To Use My Credit Card Online At rikocraft.com?',
        a: 'We do not store credit card information on our website. Your credit card information is safe with our international payment solution providers – Razorpay and PayPal.'
      }
    ]
  },
  {
    title: 'Billing & Payments',
    questions: [
      {
        q: 'What Payment Methods Do You Accept?',
        a: 'We accept all MasterCard, VISA, American Express, and Citibank Maestro Debit or Credit Cards.\n\nIf you have an Indian bank account, you can also transfer your payment directly to us using our payment gateway\'s net banking facility.'
      },
      {
        q: 'When Will My Credit Card Be Charged?',
        a: 'Your credit card will be charged at the time of placing your order through our secured payment gateway. (an online real-time authorisation is done through the Payment Gateway)'
      }
    ]
  },
  {
    title: 'Returns & Exchanges',
    questions: [
      {
        q: 'What Is Your Return Policy?',
        a: '• At Riko Craft, we stand behind the quality of our products and we assure each and every product passes through a strict quality checking process.\n• Please bear in mind that all handmade items are bound to have minor defects in them and any two item of same product will never be exactly same. These inherent quality of handicraft make them unique and add value of it being a genuine and authentic handmade product. These are not acceptable valid reasons for return.\n• However we will provide a full refund for the cost of the product if the product is found faulty or defective or not the one that you selected in your order.\n• Return request must be made on a valid reason within 48 hours of receiving the goods in writing to [email protected] with clearly stating reasons for return.\n• Shipping charges will not be refunded and customers are required to pay for the return shipping costs of the goods.'
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('About RIKO CRAFT');
  const [activeQuestion, setActiveQuestion] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Frequently Asked Questions (FAQs)
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">FAQs</h2>
              <nav className="space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.title}
                    onClick={() => setActiveCategory(category.title)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeCategory === category.title
                        ? 'bg-[#8B4513] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">{activeCategory}</h2>
              <div className="space-y-4">
                {faqCategories
                  .find((cat) => cat.title === activeCategory)
                  ?.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <button
                        onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="font-medium pr-8">{faq.q}</span>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            activeQuestion === index ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {activeQuestion === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pb-4 text-gray-600 whitespace-pre-line"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 