import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, GitBranch, Share2, Star, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 z-50"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 hover:rotate-90 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 hover:rotate-90 transition-transform duration-500" />
      )}
    </button>
  );
};

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <DarkModeToggle />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/3 w-64 h-64 bg-pink-100 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-24 max-w-6xl">
          <div className="text-center mb-24 space-y-8">
            <div className="flex justify-center mb-4">
              <a
                href="https://github.com/Om-Alve/Sketchify"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 hover:from-gray-900 hover:to-black dark:hover:from-gray-600 dark:hover:to-gray-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="relative">
                  <Star className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  <div className="absolute inset-0 animate-ping opacity-0 group-hover:opacity-20">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <span className="font-medium">Star on GitHub</span>
              </a>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              Sketchify
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into beautiful hand-drawn diagrams instantly. Perfect for presentations, documentation, and sharing your thoughts visually.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/draw"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-medium py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Start Drawing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Just describe what you want, and watch as AI transforms your words into beautiful diagrams.",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                icon: GitBranch,
                title: "Multiple Diagrams",
                description: "Generate multiple variations and perspectives of your diagrams instantly.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Share2,
                title: "Easy Sharing",
                description: "Copy and share your diagrams instantly with your team or audience.",
                gradient: "from-pink-500 to-red-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group hover:scale-105 transition-transform duration-300">
                <div className="h-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
                  <div className="mb-6 inline-block p-4 rounded-xl bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity">
                    <feature.icon className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} text-transparent fill-white`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
