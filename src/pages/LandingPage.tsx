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
  Layers,
  AlertTriangle,
  Clock,
  FileText,
  Lightbulb
} from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Debtster
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Design faster by dealing with{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                UX debt smarter
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Debtster helps teams capture, track, and clear UX debt before it derails product quality.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-10 max-w-2xl mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <p className="text-yellow-800 font-semibold text-lg flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                No more sticky notes. No more lost screenshots. No more "we'll fix it later" moments.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              >
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-8 py-4">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
              <div>No credit card required</div>
              <div>Free 14-day trial</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Framing Section - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-8 hover:scale-105 transition-transform duration-300">
              UX debt is invisible—until it's too late.
            </h2>
          </div>

          {/* Visual Problem Illustration */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">The Problem Compounds</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Designers and PMs often postpone minor UX flaws—broken layouts, unclear flows, outdated components—because they aren't showstoppers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Time Becomes the Enemy</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Over time, these issues pile up, clogging user experience and product velocity. You lose users. The design team burns out.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Fixes Become Expensive</h3>
                    <p className="text-gray-700 leading-relaxed">
                      What started as small tweaks now require major overhauls. Technical debt meets design debt in a costly collision.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-12 text-center hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Lightbulb className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  That's where Debtster comes in.
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Transform chaos into clarity with a systematic approach to UX debt management.
                </p>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Introducing Debtster */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-8 hover:scale-105 transition-transform duration-300">
              Your team's command center for UX debt.
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              With Debtster, you can log issues contextually, assign severity, and track them through to resolution.
            </p>
            <p className="text-lg text-gray-600 mb-16 max-w-4xl mx-auto">
              Whether it's a clunky filter interaction, inconsistent button states, or a confusing onboarding step, Debtster helps your team:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">Log UX debt instantly</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Right from design, dev, or feedback sessions</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 shadow-lg">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">Assign owners & severity</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Tags and severity levels for better organization</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 shadow-lg">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">Visualize debt</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Across projects with intuitive dashboards</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">Prioritize smartly</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">What to fix first, and what can wait</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl text-gray-700 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              Think of it as Jira—but made for UX polish.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Video Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300">
            What is UX Debt?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Understanding the hidden costs of postponed design decisions
          </p>
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl border border-gray-300 hover:shadow-purple-500/25 hover:scale-105 transition-all duration-500">
            <div className="aspect-video relative group">
              <iframe 
                width="996" 
                height="560" 
                src="https://www.youtube.com/embed/4MdJXPVvrts" 
                title="UX Debt" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="w-full h-full rounded-3xl"
              ></iframe>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Figma Plugin Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-3xl p-12 md:p-16 text-center shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Figma className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Debtster Plugin for Figma
              </h2>
              <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-1 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200">
                Available Now
              </div>
            </div>
            <p className="text-xl text-gray-700 mb-12">
              Spot a UX flaw while designing? Don't switch tools.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 hover:border-purple-300 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 border border-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Highlight components</h3>
                <p className="text-gray-600 text-sm">Select any component or frame in Figma</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 hover:border-blue-300 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Add UX Debt tags</h3>
                <p className="text-gray-600 text-sm">Tag and comment directly in your design</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:scale-105 hover:border-emerald-300 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">Auto-sync</h3>
                <p className="text-gray-600 text-sm">Automatically syncs to your Debtster dashboard</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xl text-gray-700 font-semibold">
                Designers stay in flow. PMs stay in control.
              </p>
              <p className="text-gray-600">
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300">What teams are saying</h2>
            <p className="text-xl text-gray-600">Join thousands of designers and product teams</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <Quote className="w-8 h-8 text-purple-600 mb-6" />
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                "We log UX friction in real time—during user testing, design reviews, even standups. Debtster keeps it all in one place."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Maya R.</p>
                  <p className="text-sm text-gray-600">Lead Product Designer @ Finlo</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <Quote className="w-8 h-8 text-emerald-600 mb-6" />
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                "Our design debt backlog used to live in post-its and Slack threads. Now it's a dashboard with progress, ownership, and timelines."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold">NV</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Nishant V.</p>
                  <p className="text-sm text-gray-600">UX Manager @ ZapGrid</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-orange-50 border border-orange-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <Quote className="w-8 h-8 text-orange-600 mb-6" />
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                "The Figma plugin is a game-changer. No more losing track of what we spotted in design!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold">DM</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Divya M.</p>
                  <p className="text-sm text-gray-600">Product Owner @ HealthCore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Stop letting UX debt slow you down.
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Build better products—without the clutter.
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2"
          >
            Start Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Debtster</span>
            </div>
            <div className="text-gray-400">
              © 2024 Debtster. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;