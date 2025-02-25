"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FadeInSection from '@/app/_components/FadeInSection';

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
      scrolled || isMenuOpen ? 'bg-white shadow-lg' : 'bg-white'
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
            {['features', 'about'].map((item) => (
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
              Get Started for Free
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
            {['features', 'about'].map((item) => (
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
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 bg-gradient-to-b from-gray-50 to-white flex items-center">
      <div className="max-w-7xl mx-auto">
        <FadeInSection duration={800} delay={200}>
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
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg 
                  hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base">
                  Try for Free
                </button>
              </Link>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection duration={1000} delay={500}>
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
        </FadeInSection>
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
        <FadeInSection>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything you need to manage projects effectively
          </h2>
        </FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeInSection key={index} delay={index * 200}>
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 select-none">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-20">
            <div className="inline-block mb-4 transform hover:scale-105 transition-transform duration-300">
              <span className="bg-blue-50 text-blue-600 text-sm font-medium px-6 py-2 rounded-full cursor-default">
                About CollabFlow
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight select-text">
              Streamlined Project<br />Management for Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed select-text">
              An affordable, user-friendly platform designed specifically for startups, small companies, 
              and student teams who need structured collaboration without complexity.
            </p>
          </div>
        </FadeInSection>

        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="space-y-24">
              {/* Improve Collaboration */}
              <div className="group transform hover:translate-x-1 transition-transform duration-300">
                <div className="flex flex-col space-y-6">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-[#40A9FF] to-[#9333EA] text-transparent bg-clip-text 
                    group-hover:scale-[1.02] transition-transform duration-300 select-text">
                    Improve collaboration
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl select-text">
                    Consolidate tasks, deadlines, and team communication in one place. 
                    Our platform helps small teams avoid the complexity of enterprise solutions 
                    while maintaining professional project management standards.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {['Task Management', 'Team Communication', 'Progress Tracking'].map((tag, index) => (
                      <span key={index} 
                        className="px-5 py-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-gray-700
                        hover:border-blue-200 hover:bg-blue-50 transition-colors duration-300 cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhance Visibility */}
              <div className="group transform hover:translate-x-1 transition-transform duration-300">
                <div className="flex flex-col space-y-6">
                  <h3 className="text-4xl font-bold text-[#B8A8E3] group-hover:scale-[1.02] transition-transform duration-300 select-text">
                    Enhance visibility
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl select-text">
                    Give managers clear insights into workflows and resource allocation without heavy 
                    administrative overhead. Track progress, identify bottlenecks, and make data-driven 
                    decisions with essential reporting functions.
                  </p>
                </div>
              </div>

              {/* Real-time Updates */}
              <div className="group transform hover:translate-x-1 transition-transform duration-300">
                <div className="flex flex-col space-y-6">
                  <h3 className="text-4xl font-bold text-[#D8CCF6] group-hover:scale-[1.02] transition-transform duration-300 select-text">
                    Real-time updates
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl select-text">
                    Keep everyone aligned with role-based access and real-time notifications. 
                    Avoid miscommunication and duplicated work by centralizing project information 
                    and updates in a single, accessible platform.
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <div className="px-4 py-16">
      <section className="max-w-6xl mx-auto bg-black relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 py-16 px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Transform Your Team's<br />
            Workflow Today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of teams already using CollabFlow to streamline their projects, 
            enhance collaboration, and boost productivity across all departments.
          </p>
          <Link href="/signup">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300">
              Start Your Free Trial
            </button>
          </Link>
        </div>
      </section>
    </div>
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
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      <main className="flex-grow pt-[72px]">
        <Hero />
        <FadeInSection>
          <About />
        </FadeInSection>
        <FadeInSection>
          <Features />
        </FadeInSection>
        <FadeInSection>
          <CallToAction />
        </FadeInSection>
      </main>
      <FadeInSection>
        <Footer />
      </FadeInSection>
    </div>
  );
}
