import React from "react";
import { LiaOilCanSolid} from "react-icons/lia";
import { PiTire } from "react-icons/pi";
import { IoCarOutline } from "react-icons/io5";
import { LuBatteryFull } from "react-icons/lu";

const services = [
  {
    title: "Oil Change",
    description: "Regular oil changes to keep your engine running smoothly.",
    icon: LiaOilCanSolid,
  },
  {
    title: "Battery Replacement",
    description: "Battery testing and replacement services.",
    icon: LuBatteryFull,
  },
  {
    title: "Tire Services",
    description: "The rotation, balancing, and replacement.",
    icon: PiTire,
  },
  {
    title: "General Checkup",
    description: "Comprehensive vehicle inspection and maintenance.",
    icon: IoCarOutline,
  },
];

const MaintenanceServices = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-5">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Maintenance Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="p-5 border border-gray-300 rounded-lg hover:shadow-sm transition"
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

export default MaintenanceServices;
