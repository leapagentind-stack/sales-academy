import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Star, Users, Clock, BarChart3, Zap, Target, TrendingUp, Award, ChevronDown, ArrowRight, Menu, X, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';


export default function SalesLandingPage() {
  
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);

  const courses = [
    {
      title: "Sales Fundamentals Mastery",
      description: "Learn the core principles of modern sales and build your foundation.",
      level: "Beginner",
      students: "2,340",
      rating: 4.9,
      price: "$99",
      duration: "4 weeks",
      modules: 12,
      lessons: 48,
    },
    {
      title: "Advanced CRM Systems",
      description: "Master Salesforce, HubSpot, and other enterprise CRM platforms.",
      level: "Intermediate",
      students: "1,890",
      rating: 4.8,
      price: "$149",
      duration: "6 weeks",
      modules: 15,
      lessons: 62,
    },
    {
      title: "Sales Leadership & Management",
      description: "Build and manage high-performing sales teams that deliver results.",
      level: "Advanced",
      students: "1,250",
      rating: 4.9,
      price: "$199",
      duration: "8 weeks",
      modules: 18,
      lessons: 72,
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Master data-driven decision making with real-time sales analytics.",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Learn to build lasting relationships and manage customer lifecycles.",
    },
    {
      icon: Zap,
      title: "CRM Automation",
      description: "Streamline your workflow with advanced CRM automation techniques.",
    },
    {
      icon: Target,
      title: "Sales Strategies",
      description: "Develop winning sales strategies from 20+ years of experience.",
    },
    {
      icon: TrendingUp,
      title: "Revenue Growth",
      description: "Learn proven methods to increase revenue and scale operations.",
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Earn industry-recognized certifications upon completion.",
    },
  ];

  const instructors = [
    { name: "Sarah Johnson", title: "VP of Sales at Fortune 500", experience: "20+ years", students: "8,500+" },
    { name: "Michael Chen", title: "CRM Systems Expert", experience: "18+ years", students: "6,200+" },
    { name: "Emma Rodriguez", title: "Sales Performance Coach", experience: "15+ years", students: "5,800+" },
    { name: "David Thompson", title: "Enterprise Sales Director", experience: "22+ years", students: "7,100+" },
  ];

  const testimonials = [
    {
      name: "James Wilson",
      role: "Sales Manager",
      company: "Tech Solutions Inc",
      content: "This academy completely transformed how I approach sales. Within 3 months, my team's revenue increased by 45%.",
      rating: 5,
    },
    {
      name: "Lisa Anderson",
      role: "Sales Director",
      company: "Global Enterprises",
      content: "The CRM automation course saved us 20 hours per week. The practical insights were invaluable.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How long does it take to complete a course?",
      answer: "Most courses take 4-8 weeks to complete at your own pace. You have lifetime access to all materials.",
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer: "Yes! All courses include an industry-recognized certificate of completion.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Absolutely. We offer a 30-day money-back guarantee if you're not satisfied.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              SA
            </div>
            <span className="font-bold text-lg hidden sm:inline">SalesAcademy</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#courses" className="text-sm text-gray-600 hover:text-gray-900 transition">Courses</a>
            <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition">About</a>
            <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
              Sign In
             </button>

              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Get Started</button>
            </div>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-sm hover:text-blue-600">Features</a>
              <a href="#courses" className="block text-sm hover:text-blue-600">Courses</a>
              <a href="#about" className="block text-sm hover:text-blue-600">About</a>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
                  >
                   Sign In
                </button>

                <button className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-md">Get Started</button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-transparent py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">Now Accepting Students</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Master Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">& CRM</span> Today
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your sales strategy with industry-leading experts. Learn proven techniques, advanced CRM systems, and close bigger deals faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                Start Learning Now
                <ArrowRight size={18} />
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>
              <div>
                <div className="text-2xl font-bold">4.9/5</div>
                <p className="text-sm text-gray-600">Course Rating</p>
              </div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Academy</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive curriculum designed to transform your sales career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 rounded-xl border border-gray-200 bg-white hover:border-blue-500 transition-colors group">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <p className="text-blue-100">Expert Instructors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <p className="text-blue-100">Comprehensive Courses</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Graduates Worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">$2.5M+</div>
              <p className="text-blue-100">Revenue Gained</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn from Industry Experts</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our instructors bring decades of real-world sales experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-blue-500 transition-all">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1">{instructor.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{instructor.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>{instructor.experience}</span>
                    <span>{instructor.students}</span>
                  </div>
                  <button className="w-full text-xs py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">Hear from professionals who transformed their careers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Complete Course Catalog</h2>
            <p className="text-lg text-gray-600">Choose from beginner to advanced courses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500 transition-all group flex flex-col">
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {course.level}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{course.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4 pb-4 border-b border-gray-200 text-xs text-gray-600">
                    <div><span className="font-semibold">{course.modules}</span> modules</div>
                    <div><span className="font-semibold">{course.lessons}</span> lessons</div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xl font-bold text-blue-600">{course.price}</span>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? -1 : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-left">{faq.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                      faqOpen === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {faqOpen === idx && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Sales Career?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals already learning with us. Get lifetime access to all courses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold flex items-center justify-center gap-2">
              Enroll Now
              <ArrowRight size={20} />
            </button>
            <button className="px-6 py-3 border-2 border-white rounded-lg hover:bg-white/10">
              Schedule a Consultation
            </button>
          </div>

          <p className="mt-8 text-sm opacity-70">
            ✓ 30-day money-back guarantee • ✓ Lifetime access • ✓ Expert support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SalesAcademy</h3>
              <p className="text-gray-400 text-sm">Transforming careers through world-class sales education.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Fundamentals</a></li>
                <li><a href="#" className="hover:text-white transition">CRM Systems</a></li>
                <li><a href="#" className="hover:text-white transition">Leadership</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">© 2025 SalesAcademy. All rights reserved.</p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition">Privacy</a>
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
