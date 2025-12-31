"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Scale, Globe, ChevronDown, User, LogIn } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { toggleLanguage } from "../../Redux/LanguageSlice/LanguageSlice"
import navbarData from "../../json/navbar.json" // your JSON file

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const currentLanguage = useSelector((state) => state.language.currentLanguage)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { id: "home", path: "/" },
    { id: "lawyers", path: "/lawyers" },
    { id: "resources", path: "/resources" },
    { id: "contact", path: "/contact-us" },
  ]

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" }
  ]

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  const handleLanguageChange = (code) => {
    dispatch(toggleLanguage(code))
    setIsLanguageOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-cyan-500/5"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-200/30"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl blur-sm opacity-20"></div>
              <div className="relative bg-gradient-to-br from-cyan-600 to-cyan-700 p-2.5 rounded-xl">
                <Scale className="w-7 h-7 text-white" />
              </div>
            </div>
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">
                LawLinkBD
              </span>
              <span className="text-xs text-gray-500 -mt-1 font-medium">Legal Aid Platform</span>
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl group ${
                    isActive(item.path)
                      ? "text-white bg-gradient-to-r from-cyan-600 to-cyan-700 shadow-lg shadow-cyan-500/25"
                      : "text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="relative z-10">{navbarData.navItems[item.id][currentLanguage]}</span>
                  {!isActive(item.path) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      layoutId="navbar-hover"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-cyan-600 transition-all duration-300 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-cyan-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.toUpperCase()}</span>
                <motion.div animate={{ rotate: isLanguageOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-3 h-3" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-500/10 py-2 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languages.map((lang, index) => (
                      <motion.button
                        key={lang.code}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50/50 transition-all duration-200"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/sign-in"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-cyan-600 transition-all duration-300 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-cyan-200"
              >
                <LogIn className="w-4 h-4" />
                <span>{navbarData.authButtons.signIn[currentLanguage]}</span>
              </Link>
              <Link
                to="/sign-up"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>{navbarData.authButtons.getStarted[currentLanguage]}</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu & everything else stays the same */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-3 text-gray-700 hover:text-cyan-600 transition-colors duration-300 rounded-xl hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-base font-semibold transition-all duration-300 rounded-xl ${
                        isActive(item.path)
                          ? "text-white bg-gradient-to-r from-cyan-600 to-cyan-700 shadow-lg shadow-cyan-500/25"
                          : "text-gray-700 hover:text-cyan-600 hover:bg-cyan-50"
                      }`}
                    >
                      {navbarData.navItems[item.id][currentLanguage]}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  className="border-t border-gray-200/50 pt-4 mt-4 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-gray-700 hover:text-cyan-600 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    {navbarData.authButtons.signIn[currentLanguage]}
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    {navbarData.authButtons.getStarted[currentLanguage]}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
