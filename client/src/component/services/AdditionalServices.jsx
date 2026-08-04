import React from "react";
import { IoCarOutline } from "react-icons/io5";

const services = [
  {
    title: "AC Repair",
    description: "Air conditioning system diagnostics and repair",
    icon: IoCarOutline,
  },
  {
    title: "Electrical System Repair",
    description: "Electrical system troubleshooting and repair.",
    icon: IoCarOutline,
  },
  {
    title: "Body Work",
    description: "Minor body work and paint touch-ups.",
    icon: IoCarOutline,
  },
];

const AdditionalServices = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Additional Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="p-3 border border-gray-300 rounded-lg min-h-38 flex flex-col hover:shadow-sm transition"
              >
                <div className="text-3xl">
                  <Icon />
                </div>

                <div className="mt-4">
                  <h3 className="text-bold text-base">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdditionalServices;
