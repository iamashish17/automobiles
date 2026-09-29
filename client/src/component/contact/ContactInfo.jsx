const ContactInfo = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-7 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-slate-900">Our Contact Information</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Reach us directly or visit our workshop in Nepalgunj.</p>

      <div className="mt-7 flex flex-col gap-6">

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-16">

          <div>
            <hr className="border-gray-200 mb-4" />
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <a href="tel:+9779876523104" className="text-sm text-gray-800 transition hover:text-blue-600">+977 9876523104</a>
          </div>

          <div>
            <hr className="border-gray-200 mb-4 w-full" />
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <a href="mailto:info@newpurnagiri.com" className="break-all text-sm text-gray-800 transition hover:text-blue-600">info@newpurnagiri.com</a>
          </div>
        </div>

        <div>
          <hr className="border-gray-200 mb-3" />
          <p className="text-xs text-gray-500 mb-1">Address</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            Rajha Nepalgunj, Banke,<br />
            Nepal
          </p>
        </div>
      </div>
    </section>
  )
}

export default ContactInfo
