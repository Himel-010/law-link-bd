"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  BadgeDollarSign,
  Briefcase,
  FileText,
  Newspaper,
} from "lucide-react";
import { motion } from "framer-motion";

const Post = () => {
  const API_URL = "http://localhost:5000/api/posts";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedUrgency, setSelectedUrgency] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("open");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams();
        if (selectedStatus !== "All") {
          queryParams.append("status", selectedStatus);
        }

        const response = await fetch(`${API_URL}?${queryParams.toString()}`);
        const data = await response.json();

        if (data?.success) {
          setPosts(data.data || []);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedStatus]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(posts.map((post) => post.category).filter(Boolean)),
    ];
    return ["All", ...uniqueCategories];
  }, [posts]);

  const locations = useMemo(() => {
    const uniqueLocations = [
      ...new Set(
        posts
          .map((post) =>
            [post.division, post.district].filter(Boolean).join(", ")
          )
          .filter(Boolean)
      ),
    ];
    return ["All", ...uniqueLocations];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const locationText = [post.division, post.district]
        .filter(Boolean)
        .join(", ")
        .toLowerCase();

      const matchesSearch =
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locationText.includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      const matchesUrgency =
        selectedUrgency === "All" || post.urgency === selectedUrgency;

      const selectedLocationText = selectedLocation.toLowerCase();
      const matchesLocation =
        selectedLocation === "All" || locationText === selectedLocationText;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesUrgency &&
        matchesLocation
      );
    });
  }, [posts, searchTerm, selectedCategory, selectedUrgency, selectedLocation]);

  const formatBudget = (min, max) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) return `৳${min} - ৳${max}`;
    if (!min && max) return `Up to ৳${max}`;
    return `From ৳${min}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently posted";

    return new Date(dateString).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getUrgencyClasses = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-50 text-red-700 border border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "low":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "open":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "closed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedUrgency("All");
    setSelectedLocation("All");
    setSelectedStatus("open");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Browse Legal Service Requests
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find verified client legal posts, explore case details, and review
            opportunities in a clean, professional, premium workspace.
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts, client, category, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white text-slate-800"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white text-slate-800"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All"
                    ? "All Categories"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white text-slate-800"
            >
              <option value="All">All Urgency</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="low">Low Urgency</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white text-slate-800"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === "All" ? "All Locations" : location}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white text-slate-800"
            >
              <option value="open">Open Posts</option>
              <option value="All">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <motion.button
              onClick={resetFilters}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4" />
              Reset Filters
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="mb-6 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            Showing {filteredPosts.length} of {posts.length} posts
          </span>

          <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm capitalize">
            Status: {selectedStatus === "All" ? "all" : selectedStatus.replace("_", " ")}
          </span>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-pulse"
              >
                <div className="h-44 rounded-xl bg-slate-200 mb-5"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <motion.div
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPosts.map((post) => {
              const location = [post.division, post.district]
                .filter(Boolean)
                .join(", ");

              return (
                <motion.div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 overflow-hidden"
                  variants={cardVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <div className="h-44 bg-slate-100 border-b border-slate-200 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="w-16 h-16 rounded-full bg-white border border-slate-300 flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Briefcase className="w-7 h-7 text-slate-700" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1">
                        {post.category || "Legal Post"}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Client Case Requirement
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClasses(
                          post.status
                        )}`}
                      >
                        {post.status?.replace("_", " ")}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getUrgencyClasses(
                          post.urgency
                        )}`}
                      >
                        {post.urgency || "medium"} urgency
                      </span>

                      {post.isPriority === 1 && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          Priority
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2 min-h-[56px]">
                      {post.title}
                    </h2>

                    <p className="text-sm text-slate-600 leading-6 line-clamp-3 mb-5 min-h-[72px]">
                      {post.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500 flex items-center gap-2 text-sm">
                          <User className="w-4 h-4" />
                          Client
                        </span>
                        <span className="font-medium text-slate-800 text-sm text-right">
                          {post.client?.name || "Unknown Client"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500 flex items-center gap-2 text-sm">
                          <BadgeDollarSign className="w-4 h-4" />
                          Budget
                        </span>
                        <span className="font-medium text-slate-800 text-sm text-right">
                          {formatBudget(post.budgetMin, post.budgetMax)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500 flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" />
                          Location
                        </span>
                        <span className="font-medium text-slate-800 text-sm text-right">
                          {location || "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500 flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          Posted
                        </span>
                        <span className="font-medium text-slate-800 text-sm text-right">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-700" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {post.client?.name || "Client User"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {post.client?.email || "No email available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          View Details
                        </motion.button>

                        <motion.button
                          className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <FileText className="w-4 h-4 text-slate-700" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-7 h-7 text-slate-500" />
            </div>
            <p className="text-slate-700 text-lg font-semibold mb-2">
              No posts found
            </p>
            <p className="text-slate-500">
              Try adjusting your search keyword or filter options.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Post;