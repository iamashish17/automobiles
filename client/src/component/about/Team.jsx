import React from "react";
import RajeshImage from "../../assets/about/RajeshImg.jpg";
import PriyaImage from "../../assets/about/PriyaImg.png";
import GovindaImage from "../../assets/about/GovindaImg.jpg";

const teamMembers = [
  {
    name: "Rajesh Sharma",
    role: "Parts Specialist",
    image: RajeshImage,
  },
  {
    name: "Priya Neupane",
    role: "Service Manager",
    image: PriyaImage,
  },
  {
    name: "Govinda Sharma",
    role: "Lead Mechanic",
    image: GovindaImage,
  },
];

const Team = () => {
  return (
    <section className="max-w-5xl mx-auto mt-10 px-4 sm:px-6">

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Meet Our Team
      </h2>

      <p className="text-sm text-gray-600 mb-8">
        Our team of experienced professionals is dedicated to providing
        top-notch service. From knowledgeable parts specialists to skilled
        mechanics, we ensure your automotive needs are handled with care.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {teamMembers.map((member, index) => (
          <div key={index}>

            <img
              src={member.image}
              alt={member.name}
              className="w-44 h-44 mx-auto object-cover rounded-full sm:h-56 sm:w-56 md:h-60 md:w-60"
            />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {member.name}
            </h3>

            <p className="text-sm text-blue-600">
              {member.role}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default Team;
