"use client"

import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { motion } from "framer-motion"

const Footer = () => {
  const footerLinks = {
    "Quick Links": ["Home", "Find Lawyers", "Submit Case", "Resources", "About Us"],
    "Legal Services": ["Family Law", "Property Law", "Immigration", "Criminal Defense", "Civil Rights"],
    Resources: ["Legal Documents", "FAQ", "Blog", "Case Studies", "Legal Guides"],
    Support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Accessibility"],
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-8 h-8 text-cyan-600" />
              <span className="text-xl font-bold text-slate-800">LegalAid</span>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Connecting underserved communities with qualified volunteer lawyers to ensure access to justice for
              everyone. Our platform makes legal help accessible, transparent, and effective.
            </p>
            <div className="space-y-2">
              <motion.div
                className="flex items-center gap-2 text-slate-600"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail className="w-4 h-4 text-cyan-600" />
                <span>support@legalaid.com</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-slate-600"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Phone className="w-4 h-4 text-cyan-600" />
                <span>+1 (555) 123-4567</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-slate-600"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>123 Justice Street, Legal City, LC 12345</span>
              </motion.div>
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants}>
              <h3 className="font-semibold text-slate-800 mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <motion.button
                      className="text-slate-600 hover:text-cyan-600 transition-colors text-left"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {link}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-slate-600 text-sm mb-4 md:mb-0">
            © 2024 LegalAid Platform. All rights reserved. | Making justice accessible to everyone.
          </div>
          <div className="flex items-center space-x-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
              <motion.button
                key={index}
                className="text-slate-600 hover:text-cyan-600 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
