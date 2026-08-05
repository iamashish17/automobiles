import HeroImg from "../../assets/home/home.png";

const Hero = () => (
  <section className="bg-white py-4 sm:py-6 lg:py-8 mt-6">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative min-h-[26rem] overflow-hidden rounded-xl shadow-lg sm:h-96 lg:h-122">
        <div className="absolute inset-0">
          <img 
            src={HeroImg} 
            alt="Automobile parts and services"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative flex h-full min-h-[26rem] flex-col items-center justify-center px-4 pb-20 text-center text-white sm:px-8 lg:pb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight">
            Your Trusted Source for Automobile Parts<br className="hidden sm:block" />and Services
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-200 mb-4 sm:mb-5 lg:mb-6 max-w-2xl px-4">
            New Purnagiri Automobiles offers a wide selection of quality parts and expert repair services to keep your vehicle running smoothly.
          </p>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 lg:bottom-10 lg:right-10">
          <button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded transition-colors duration-200 shadow-lg">
            Shop Parts
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
