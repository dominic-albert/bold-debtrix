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
  Quote
} from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-yellow-800 font-medium">
                ✨ No more sticky notes. No more lost screenshots. No more "we'll fix it later" moments.
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
          </div>
        </div>
      </section>

      {/* Problem Framing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              UX debt is invisible—until it's too late.
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Designers and PMs often postpone minor UX flaws—broken layouts, unclear flows, outdated components—because they aren't showstoppers.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Over time, these issues pile up, clogging user experience and product velocity. You lose users. The design team burns out. Fixes become expensive.
              </p>
              <div className="bg-purple-100 border border-purple-200 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">That's where Debtster comes in.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introducing Debtster */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your team's command center for UX debt.
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              With Debtster, you can log issues contextually, assign severity, and track them through to resolution.
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto">
              Whether it's a clunky filter interaction, inconsistent button states, or a confusing onboarding step, Debtster helps your team:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Log UX debt instantly</h3>
              <p className="text-gray-600">Right from design, dev, or feedback sessions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assign owners & severity</h3>
              <p className="text-gray-600">Tags and severity levels for better organization</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visualize debt</h3>
              <p className="text-gray-600">Across projects with intuitive dashboards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prioritize smartly</h3>
              <p className="text-gray-600">What to fix first, and what can wait</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-600 font-medium">
              Think of it as Jira—but made for UX polish.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            See Debtster in action (1 min)
          </h2>
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video flex items-center justify-center">
              <a 
                href="https://www.youtube.com/watch?v=4MdJXPVvrts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-purple-300 transition-colors"
              >
                <PlayCircle className="w-16 h-16" />
                <span className="text-xl font-semibold">Watch Demo</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Figma Plugin Teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-purple-100">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Figma className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Coming Soon: Debtster Plugin for Figma
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Spot a UX flaw while designing? Don't switch tools.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Highlight components</h3>
                <p className="text-gray-600 text-sm">Select any component or frame in Figma</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Add UX Debt tags</h3>
                <p className="text-gray-600 text-sm">Tag and comment directly in your design</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Auto-sync</h3>
                <p className="text-gray-600 text-sm">Automatically syncs to your Debtster dashboard</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 font-medium">
              Designers stay in flow. PMs stay in control.
            </p>
            <p className="text-gray-600 mt-2">
              No more back-and-forth screenshots or endless Notion pages.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What teams are saying</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <Quote className="w-8 h-8 text-purple-600 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">
                "We log UX friction in real time—during user testing, design reviews, even standups. Debtster keeps it all in one place."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">MR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maya R.</p>
                  <p className="text-sm text-gray-600">Lead Product Designer @ Finlo</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <Quote className="w-8 h-8 text-purple-600 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Our design debt backlog used to live in post-its and Slack threads. Now it's a dashboard with progress, ownership, and timelines."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">NV</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Nishant V.</p>
                  <p className="text-sm text-gray-600">UX Manager @ ZapGrid</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <Quote className="w-8 h-8 text-purple-600 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The upcoming Figma plugin is a game-changer. No more losing track of what we spotted in design!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">DM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Divya M.</p>
                  <p className="text-sm text-gray-600">Product Owner @ HealthCore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stop letting UX debt slow you down.
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Build better products—without the clutter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup" 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors px-8 py-4">
              <PlayCircle className="w-5 h-5" />
              See Live Demo
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-purple-200">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 rating</span>
            </div>
            <div>No credit card required</div>
            <div>Free 14-day trial</div>
          </div>
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