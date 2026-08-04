import repairImg from '../../assets/home/repair.png';
import maintenanceImg from '../../assets/home/maintenance.png';
import diagnosticImg from '../../assets/home/diagnostic.png';

const Services = () => {
  const services = [
    {
      title: 'Repair Services',
      description: 'Expert repair services for all types of vehicles.',
      image: repairImg
    },
    {
      title: 'Maintenance Services',
      description: 'Comprehensive maintenance services to keep your vehicle in top condition.',
      image: maintenanceImg
    },
    {
      title: 'Diagnostic Services',
      description: 'Advanced diagnostic tools to identify and resolve issues quickly.',
      image: diagnosticImg
    }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div key={index} className="rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-44 sm:h-48 lg:h-56 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-5 lg:p-6 bg-white">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-xs sm:text-sm text-blue-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;