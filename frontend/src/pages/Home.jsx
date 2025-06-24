import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  ArrowRight, 
  Building, 
  Shield, 
  Zap,
  CheckCircle,
  PlayCircle,
  Menu,
  X,
  Wifi,
  Monitor,
  Coffee,
  Car,
  Camera,
  Headphones
} from 'lucide-react';
import salle1 from '../assets/images/salle.jpg';
import salle2 from '../assets/images/salle2.jpeg';
import salle3 from '../assets/images/salle3.jpeg';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: salle1,
      title: "Réservez vos salles en toute simplicité",
      subtitle: "Gérez efficacement vos espaces de réunion avec notre plateforme intelligente",
    },
    {
      image: salle2,
      title: "Optimisez l'utilisation de vos espaces",
      subtitle: "Analysez les données d'occupation et maximisez votre retour sur investissement",
    },
    {
      image: salle3,
      title: "Collaboration sans limites",
      subtitle: "Des salles équipées des dernières technologies pour vos réunions",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Réservation intelligente",
      description: "IA intégrée pour suggérer les meilleures créneaux selon vos besoins",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-400 to-green-500"
    },
    {
      title: "Gestion centralisée",
      description: "Tableau de bord unique pour gérer toutes vos salles et réservations",
      icon: <Building className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Intégrations avancées",
      description: "Synchronisation avec Outlook, Google Calendar, Teams et Zoom",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-600 to-green-700"
    },
    {
      title: "Analytics en temps réel",
      description: "Rapports détaillés sur l'utilisation et l'optimisation des espaces",
      icon: <Users className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-500 to-green-600"
    }
  ];

  const roomTypes = [
    {
      name: "Salle de réunion",
      capacity: "4-8 personnes",
      equipment: [<Monitor className="w-4 h-4" />, <Wifi className="w-4 h-4" />, <Camera className="w-4 h-4" />],
      price: "25€/h",
      image: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      name: "Salle de conférence",
      capacity: "20-50 personnes",
      equipment: [<Monitor className="w-4 h-4" />, <Wifi className="w-4 h-4" />, <Headphones className="w-4 h-4" />],
      price: "75€/h",
      image: "bg-gradient-to-br from-green-50 to-white"
    },
    {
      name: "Espace coworking",
      capacity: "10-15 personnes",
      equipment: [<Wifi className="w-4 h-4" />, <Coffee className="w-4 h-4" />, <Car className="w-4 h-4" />],
      price: "15€/h",
      image: "bg-gradient-to-br from-white to-green-50"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice RH, TechCorp",
      content: "LiqaaSpace a révolutionné notre gestion des salles. Gain de temps énorme !",
      rating: 5
    },
    {
      name: "Ahmed Ben Ali",
      role: "Chef de projet, InnovTech",
      content: "Interface intuitive et fonctionnalités avancées. Exactement ce qu'il nous fallait.",
      rating: 5
    },
    {
      name: "Sophie Martin",
      role: "Office Manager, StartupXYZ",
      content: "Le support client est exceptionnel. Plateforme fiable et performante.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-600 to-green-700 w-10 h-10 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                LiqaaSpace
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-700 hover:text-green-600 transition-colors">Tarifs</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">À propos</a>
              <a href="/auth" className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                Connexion
              </a>
            </div>
            
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 overflow-hidden">
        <img
          src={heroSlides[currentSlide].image}
          alt="Salle de réunion"
          className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
          style={{ minHeight: 400, maxHeight: 700 }}
        />
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-20">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center">
                <PlayCircle className="w-5 h-5 mr-2" />
                Voir la démo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                Essai gratuit 14 jours
              </button>
            </div>
            
            {/* Slide indicators */}
            <div className="flex justify-center space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-8">Plus de 500 entreprises nous font confiance</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
              {['Microsoft', 'Google', 'Amazon', 'Meta', 'Apple'].map((company) => (
                <div key={company} className="text-2xl font-bold text-gray-400">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fonctionnalités puissantes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour gérer efficacement vos espaces de travail
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Types Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nos espaces
            </h2>
            <p className="text-xl text-gray-600">
              Des salles adaptées à tous vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {roomTypes.map((room, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`h-48 ${room.image} flex items-center justify-center`}>
                  <Building className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-4">{room.capacity}</p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    {room.equipment.map((icon, i) => (
                      <div key={i} className="text-gray-400">
                        {icon}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">{room.price}</span>
                    <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ce que disent nos clients
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-green-400">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à transformer votre gestion d'espaces ?
          </h2>
          <p className="text-xl text-green-100 mb-12">
            Rejoignez des milliers d'entreprises qui optimisent leurs espaces avec LiqaaSpace
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <p className="text-white">Installation en 24h</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <p className="text-white">Support 24/7</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <p className="text-white">Garantie 30 jours</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-300 transform hover:scale-105 text-lg">
              Démarrer l'essai gratuit
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 text-lg">
              Planifier une démo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-600 to-green-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LiqaaSpace</span>
              </div>
              <p className="text-gray-400">
                La plateforme de gestion d'espaces la plus avancée du marché.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LiqaaSpace. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;