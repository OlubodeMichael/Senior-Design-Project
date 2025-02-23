"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled || isMenuOpen ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Updated color to always be blue */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-bold text-blue-600 transition-colors duration-300 group-hover:text-blue-700">
                CollabFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['features', 'pricing', 'about'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)} 
                className={`relative font-medium transition-colors duration-300 ${
                  scrolled ? 'text-gray-600' : 'text-gray-800'
                } hover:text-blue-600 group`}
              >
                <span className="capitalize">{item}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <Link 
              href="/login" 
              className={`font-medium transition-colors duration-300 ${
                scrolled ? 'text-gray-600' : 'text-gray-800'
              } hover:text-blue-600`}
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
                active:scale-95 font-medium"
            >
              Get Start for Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg transition-colors duration-300 text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-3 bg-white">
            {['features', 'pricing', 'about'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)} 
                className="block w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 
                  hover:bg-blue-50 rounded-xl transition-colors duration-300 capitalize font-medium"
              >
                {item}
              </button>
            ))}
            <Link 
              href="/login" 
              className="block w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 
                hover:bg-blue-50 rounded-xl transition-colors duration-300 font-medium"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="block w-full px-4 py-3 bg-blue-600 text-white rounded-xl 
                hover:bg-blue-700 transition-all duration-300 text-center font-medium 
                hover:shadow-lg active:scale-95"
            >
              Get Start for Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-screen pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-12 sm:pb-16 md:pb-20 px-4 bg-gradient-to-b from-gray-50 to-white flex items-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
            The Optimal Solution for Collaborative Tasks Across Diverse Functions.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 sm:px-4">
            Welcome to a smarter way of managing tasks and products. Our comprehensive suite is designed to streamline your 
            workflow, enhance collaboration, and ensure seamless project success.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-all duration-300 font-medium text-sm sm:text-base">
                Get Started
              </button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg 
                hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base">
                Try for Free
              </button>
            </Link>
          </div>
        </div>

        {/* Browser-style frame for dashboard preview */}
        <div className="relative mx-auto max-w-6xl px-2 sm:px-4 md:px-6">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Browser Controls */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#28C840]"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-md px-4 sm:px-20 py-1 text-xs sm:text-sm text-gray-600 flex items-center gap-2 border border-gray-200">
                  <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">collabflow.com</span>
                </div>
              </div>
            </div>
            
            {/* Dashboard Image */}
            <div className="relative bg-white">
              <img 
                src="/dashboard.png" 
                alt="CollabFlow Dashboard"
                className="w-full"
              />
            </div>
          </div>

          {/* Optional decorative elements */}
          <div className="absolute -z-10 inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 blur-3xl opacity-30 transform translate-y-8 scale-95"></div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "Task Management",
      description: "Create, assign, and track tasks with ease. Set priorities, deadlines, and monitor progress in real-time.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      )
    },
    {
      title: "Real-Time Collaboration",
      description: "Chat, comment, and collaborate with your team in real-time. Stay connected and aligned on project goals.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      )
    },
    {
      title: "Analytics & Insights",
      description: "Track team productivity, monitor project progress, and get insights to improve workflow efficiency.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      )
    }
  ];

  return (
    <section id="features" className="py-16 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to manage projects effectively
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for small teams just getting started",
      features: [
        "Up to 5 team members",
        "Basic project management",
        "Task tracking",
        "2GB storage",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: "$29",
      description: "Great for growing teams with more needs",
      features: [
        "Up to 20 team members",
        "Advanced project management",
        "Time tracking",
        "20GB storage",
        "Priority support",
        "Custom workflows",
        "Advanced analytics"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific requirements",
      features: [
        "Unlimited team members",
        "Enterprise-grade security",
        "Custom integrations",
        "Unlimited storage",
        "24/7 dedicated support",
        "SLA guarantee",
        "Custom training"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">{plan.price}</div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Get Started
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full">
              About CollabFlow
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built for Modern Teams Who Value Efficiency
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            CollabFlow was created with a simple mission: to make project management 
            accessible and efficient for teams of all sizes. We understand the challenges 
            that modern teams face in today's fast-paced work environment.
          </p>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: "⚡️",
              title: "User-Centric Design",
              description: "Intuitive interface that requires minimal training, designed with the user's needs in mind."
            },
            {
              icon: "🛡️",
              title: "Secure Platform",
              description: "Built with security in mind, ensuring your project data remains protected and private."
            },
            {
              icon: "🤝",
              title: "Collaborative Focus",
              description: "Enhanced team collaboration tools to keep everyone aligned and productive."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Mission-Driven",
                description: "We're committed to making work easier and more efficient for teams worldwide."
              },
              {
                icon: "💡",
                title: "Innovation First",
                description: "Constantly evolving our platform with cutting-edge features and improvements."
              },
              {
                icon: "🌱",
                title: "Growth Mindset",
                description: "We believe in continuous learning and improvement in everything we do."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Our Vision
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            To revolutionize how teams collaborate and manage projects, making it 
            simpler and more efficient for everyone to achieve their goals together.
          </p>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="py-16 px-4 bg-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to streamline your project management?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of teams already using CollabFlow to manage their projects effectively.
        </p>
        <Link href="/signup">
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
            Get Started for Free
          </button>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Integrations", href: "/integrations" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" }
    ]
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">CollabFlow</h3>
          <p className="text-sm">Streamlined project management for modern teams.</p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.product.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="hover:text-white">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.company.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="hover:text-white">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.support.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="hover:text-white">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
        &copy; {new Date().getFullYear()} CollabFlow. All rights reserved.
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-grow">
        <Hero />
        <About />
        <Features />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
