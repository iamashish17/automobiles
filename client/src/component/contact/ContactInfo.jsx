const ContactInfo = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-7 pb-10 sm:px-6">
      <h2 className="text-xl font-semibold mb-6">Our Contact Information</h2>

      <div className="flex flex-col gap-8">

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-16">

          <div className="w-fit">
            <hr className="border-gray-200 mb-4 w-full" />
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="text-sm text-gray-800">+977 9876523104</p>
          </div>

          <div>
            <hr className="border-gray-200 mb-4 w-full" />
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm text-gray-800">info@newpurnagiri.com</p>
          </div>
        </div>

        <div className="w-fit">
          <hr className="border-gray-200 mb-3 w-full" />
          <p className="text-xs text-gray-500 mb-1">Address</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            Rajha Nepalgunj, Banke,<br />
            Nepal
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
