import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, CheckCircle, ArrowRight, Activity } from 'lucide-react';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Navigation */}
            <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">MediDiagnose</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hidden md:block">Sign In</button>
                            <button className="text-sm font-medium text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Register</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50/50 to-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                        Professional Medical <br />
                        <span className="text-blue-600">Image Analysis</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        AI-powered diagnostic assistance for healthcare professionals and patients.
                        Upload medical scans, receive detailed analysis, and collaborate securely with medical providers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/dashboard" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors">
                            View Demo
                        </button>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="mt-16 max-w-6xl mx-auto px-4">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 aspect-video bg-gray-100">
                        <img
                            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2600"
                            alt="Medical Analysis Dashboard"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">HIPAA Compliant</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Enterprise-grade security and privacy controls ensure your medical data is always protected and encrypted at rest.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
                            <p className="text-gray-600 leading-relaxed">
                                AI-powered analysis provides detailed diagnostic insights within seconds, helping prioritize critical cases.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Securely share scans and collaborate with healthcare providers in real-time for second opinions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Why Choose MediDiagnose?</h2>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                {[
                                    { title: "Advanced AI Technology", desc: "State-of-the-art machine learning models trained on millions of medical images" },
                                    { title: "Licensed Professionals", desc: "Access verified and licensed healthcare professionals for consultation" },
                                    { title: "Patient-Friendly Interface", desc: "Intuitive design makes it easy for anyone to upload and understand results" },
                                    { title: "Comprehensive Support", desc: "24/7 customer support and educational resources available" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="shrink-0 mt-1">
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto bg-blue-600 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-200">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Transform Your Diagnostics?</h2>
                    <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
                        Join thousands of healthcare professionals and patients using MediDiagnose today.
                    </p>
                    <Link to="/dashboard" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                        Start Free Trial →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">MediDiagnose</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-8">© 2026 MediDiagnose Inc. All rights reserved.</p>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-3xl text-center">
                            <p className="text-xs text-amber-800 font-medium">
                                ⚠️ DISCLAIMER: This tool is for educational and assistive purposes only. All diagnoses must be verified by licensed medical professionals. Not a substitute for professional medical advice.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
