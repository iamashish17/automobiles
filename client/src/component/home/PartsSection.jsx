import EngineImg from "../../assets/home/engine.png";
import BrakeImg from "../../assets/home/brake.png";
import TireImg from "../../assets/home/tire.png";

const PartsSection = () => {
  const parts = [
    {
      title: 'Engine Components',
      description: 'High-performance engine parts for all makes and models.',
      image: EngineImg
    },
    {
      title: 'Brake Systems',
      description: 'Reliable brake systems to ensure your safety on the road.',
      image: BrakeImg
    },
    {
      title: 'Tires and Wheels',
      description: 'A wide range of tires and wheels to suit your vehicle\'s needs.',
      image: TireImg
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Parts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {parts.map((part, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 sm:h-56 lg:h-64 overflow-hidden flex items-center justify-center bg-gray-50">
                <img 
                  src={part.image} 
                  alt={part.title}
                  className="w-full h-full object-contain p-4" 
                />
              </div>
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{part.title}</h3>
                <p className="text-xs sm:text-sm text-blue-300 leading-relaxed">{part.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartsSection;