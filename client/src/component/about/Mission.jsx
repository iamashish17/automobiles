import React from "react";
import MissionImage from "/src/assets/about/mission.png";

const Mission = () => {
  return (
    <section className="max-w-5xl mx-auto mt-8 px-4 sm:px-6">
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Our Mission
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          At New Purnagiri Automobiles, our mission is to provide customers 
          with the best automobile experience. We aim to offer a wide 
          selection of genuine parts, reliable repair services, and 
          exceptional customer support. Our goal is to keep your vehicle 
          running smoothly and safely on the road.
        </p>
      </div>

      <div className="w-full h-80 sm:h-100 md:h-150 overflow-hidden">
        <img
          src={MissionImage}
          alt="Our Mission"
          className="w-full h-full object-cover"
        />
      </div>

    </section>
  );
};

export default Mission;
