import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ArrowRight,
  Star,
  PlayCircle,
  Zap,
  Target,
  BarChart3,
  Users,
  Figma,
  Quote,
  Sparkles,
  TrendingUp,
  Shield,
  Layers
} from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Debtster
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 transform duration-200">
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-8 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4" />
              Now with Figma Plugin Integration
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Design faster by dealing with{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient hover:scale-105 transition-transform duration-300 inline-block">
                UX debt smarter
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Debtster helps teams capture, track, and clear UX debt before it derails product quality.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 mb-10 max-w-2xl mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <p className="text-yellow-300 font-semibold text-lg flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                No more sticky notes. No more lost screenshots. No more "we'll fix it later" moments.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg group"
              >
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <button className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors px-10 py-4 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300">
                <PlayCircle className="w-6 h-6" />
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9/5 rating</span>
              </div>
              <div className="font-medium hover:text-gray-300 transition-colors duration-200">No credit card required</div>
              <div className="font-medium hover:text-gray-300 transition-colors duration-200">Free 14-day trial</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Framing Section */}
      <section className="py-24 bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-8 hover:scale-105 transition-transform duration-300">
              UX debt is invisible—until it's too late.
            </h2>
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-xl text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
                Designers and PMs often postpone minor UX flaws—broken layouts, unclear flows, outdated components—because they aren't showstoppers.
              </p>
              <p className="text-xl text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
                Over time, these issues pile up, clogging user experience and product velocity. You lose users. The design team burns out. Fixes become expensive.
              </p>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-10 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h3 className="text-3xl font-bold text-purple-300 mb-4 flex items-center justify-center gap-3">
                  <TrendingUp className="w-8 h-8" />
                  That's where Debtster comes in.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introducing Debtster */}
      <section className="py-24 bg-gradient-to-br from-slate-900/80 to-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-8 hover:scale-105 transition-transform duration-300">
              Your team's command center for UX debt.
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              With Debtster, you can log issues contextually, assign severity, and track them through to resolution.
            </p>
            <p className="text-lg text-gray-400 mb-16 max-w-4xl mx-auto">
              Whether it's a clunky filter interaction, inconsistent button states, or a confusing onboarding step, Debtster helps your team:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/30 backdrop-blur-sm border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 shadow-lg">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">Log UX debt instantly</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Right from design, dev, or feedback sessions</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-sm border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 shadow-lg">
                <Target className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">Assign owners & severity</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Tags and severity levels for better organization</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 shadow-lg">
                <BarChart3 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">Visualize debt</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Across projects with intuitive dashboards</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/30 backdrop-blur-sm border border-orange-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-300 transition-colors duration-300">Prioritize smartly</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">What to fix first, and what can wait</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl text-gray-300 font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              Think of it as Jira—but made for UX polish.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Video Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900/30 to-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">
            What is UX Debt?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Understanding the hidden costs of postponed design decisions
          </p>
          <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:shadow-purple-500/25 hover:scale-105 transition-all duration-500">
            <div className="aspect-video relative group">
              <iframe
                src="https://www.youtube.com/embed/4MdJXPVvrts"
                title="What is UX Debt?"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Figma Plugin Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900/80 to-purple-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30 rounded-3xl p-12 md:p-16 text-center shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Figma className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white">
                Debtster Plugin for Figma
              </h2>
              <div className="bg-green-500/20 border border-green-400/30 text-green-300 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                Available Now
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-12">
              Spot a UX flaw while designing? Don't switch tools.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Layers className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-3">Highlight components</h3>
                <p className="text-gray-400 text-sm">Select any component or frame in Figma</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-3">Add UX Debt tags</h3>
                <p className="text-gray-400 text-sm">Tag and comment directly in your design</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white mb-3">Auto-sync</h3>
                <p className="text-gray-400 text-sm">Automatically syncs to your Debtster dashboard</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xl text-gray-300 font-semibold">
                Designers stay in flow. PMs stay in control.
              </p>
              <p className="text-gray-400">
                No more back-and-forth screenshots or endless Notion pages.
              </p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 mt-6 group"
              >
                Try Plugin Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900/30 to-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4 hover:scale-105 transition-transform duration-300">What teams are saying</h2>
            <p className="text-xl text-gray-300">Join thousands of designers and product teams</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <Quote className="w-8 h-8 text-purple-400 mb-6" />
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                "We log UX friction in real time—during user testing, design reviews, even standups. Debtster keeps it all in one place."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <p className="font-bold text-white">Maya R.</p>
                  <p className="text-sm text-gray-400">Lead Product Designer @ Finlo</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <Quote className="w-8 h-8 text-purple-400 mb-6" />
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                "Our design debt backlog used to live in post-its and Slack threads. Now it's a dashboard with progress, ownership, and timelines."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold">NV</span>
                </div>
                <div>
                  <p className="font-bold text-white">Nishant V.</p>
                  <p className="text-sm text-gray-400">UX Manager @ ZapGrid</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <Quote className="w-8 h-8 text-purple-400 mb-6" />
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                "The Figma plugin is a game-changer. No more losing track of what we spotted in design!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold">DM</span>
                </div>
                <div>
                  <p className="font-bold text-white">Divya M.</p>
                  <p className="text-sm text-gray-400">Product Owner @ HealthCore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold text-white mb-8 hover:scale-105 transition-transform duration-300">
            Stop letting UX debt slow you down.
          </h2>
          <p className="text-2xl text-purple-100 mb-12">
            Build better products—without the clutter.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link 
              to="/signup" 
              className="bg-white text-purple-600 px-10 py-4 rounded-xl text-lg font-bold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg group"
            >
              Start Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <button className="flex items-center gap-3 text-purple-100 hover:text-white transition-colors px-10 py-4 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300">
              <PlayCircle className="w-6 h-6" />
              <span className="font-semibold">See Live Demo</span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-purple-200">
            <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.9/5 rating</span>
            </div>
            <div className="font-medium hover:text-white transition-colors duration-200">No credit card required</div>
            <div className="font-medium hover:text-white transition-colors duration-200">Free 14-day trial</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Debtster</span>
            </div>
            <div className="text-gray-400 hover:text-gray-300 transition-colors duration-200">
              © 2024 Debtster. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;