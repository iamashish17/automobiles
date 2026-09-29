import React from "react";
import { IoCarSportOutline } from "react-icons/io5";
import { LiaCogSolid } from "react-icons/lia";
import { GoTools } from "react-icons/go";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

const services = [
  {
    title: "Engine Repair",
    description: "Comprehensive engine diagnostics and repair.",
    icon: IoCarSportOutline,
  },
  {
    title: "Transmission Repair",
    description: "Expert transmission repair and maintenance.",
    icon: LiaCogSolid,
  },
  {
    title: "Brake Service",
    description: "Complete brake system inspection and repair.",
    icon: GoTools,
  },
  {
    title: "Suspension Service",
    description: "Suspension system repair and upgrades.",
    icon: HiOutlineWrenchScrewdriver,
  },
];

const RepairServices = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Repair Services
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

export default RepairServices;
