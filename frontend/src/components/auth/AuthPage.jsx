import React, { useState } from 'react';
import { ArrowRight, User, UserPlus, CheckCircle, Shield, Clock } from 'lucide-react';
import Login from './Login';
import Register from './Register';

// Simuler l'image de la salle de réunion
const meetingImageUrl = "https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Effets de fond décoratifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full blur-3xl opacity-20 transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-200 to-emerald-300 rounded-full blur-3xl opacity-20 transform -translate-x-20 translate-y-20"></div>
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Section Image */}
          <div className="lg:flex-1 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${meetingImageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-green-500/85 to-emerald-700/90"></div>
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full"></div>
              <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-white/20 rounded-full"></div>
              <div className="absolute top-1/3 right-20 w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-1/3 left-20 w-3 h-3 bg-white/30 rounded-full"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 text-white">
              <div className="max-w-md">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                    {isLogin ? <User className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
                  </div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {isLogin ? 'Content de vous revoir !' : 'Rejoignez-nous'}
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  {isLogin 
                    ? 'Connectez-vous pour accéder à votre espace personnel et gérer vos réservations' 
                    : 'Créez un compte pour réserver des salles de réunion et collaborer efficacement'}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-white/90">Réservation en temps réel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-white/90">Sécurisé et fiable</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-white/90">Disponible 24h/24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Section Formulaire */}
          <div className="lg:flex-1 relative p-8 lg:p-12 flex flex-col justify-center">
            {/* Bouton de basculement */}
            <button
              onClick={toggleForm}
              className="absolute top-6 right-6 px-6 py-2 border-2 border-emerald-500 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-all duration-300 flex items-center gap-2 group"
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl mb-4">
                  {isLogin ? <User className="w-8 h-8 text-emerald-600" /> : <UserPlus className="w-8 h-8 text-emerald-600" />}
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Entrez vos identifiants pour vous connecter' 
                  : 'Créez votre compte en quelques secondes'}
              </p>
            </div>
            {/* Zone de formulaire avec animation */}
            <div className="relative">
              <div 
                className={`transition-all duration-300 ${
                  isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                }`}
              >
                {isLogin ? <Login /> : <Register />}
              </div>
            </div>
            {/* Lien alternatif */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                <button
                  onClick={toggleForm}
                  className="ml-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </p>
            </div>
            
            {/* Décoration */}
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Vague décorative en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"></div>
      </div>
    </div>
  );
};

export default AuthPage;