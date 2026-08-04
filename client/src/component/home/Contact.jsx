const ContactItem = ({ icon, title, children }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-blue-100 hover:bg-blue-50 transition-colors">
    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
      {children}
    </div>
  </div>
);

const Contact = () => (
  <section className="py-8 sm:py-12 lg:py-16 bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Contact Us</h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
        Visit our store or contact us for inquiries and assistance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <ContactItem
          title="Address"
          icon={
            <>
              <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
              <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
            </>
          }
        >
          <p className="text-xs text-gray-600">Nepalgunj-16 Rajha, Banke, Nepal</p>
        </ContactItem>

        <ContactItem
          title="Phone"
          icon={
            <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          }
        >
          <a href="tel:5551234567" className="text-xs text-gray-600 hover:text-blue-400 transition-colors">
            +977 9876523104
          </a>
        </ContactItem>

        <ContactItem
          title="Email"
          icon={
            <>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </>
          }
        >
          <a href="mailto:info@newpurnagiri.com" className="text-xs text-gray-600 hover:text-blue-400 transition-colors break-all">
            info@newpurnagiri.com
          </a>
        </ContactItem>

        <ContactItem
          title="Working Hours"
          icon={
            <>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </>
          }
        >
          <p className="text-xs text-gray-600">Sun - Fri: 9am - 6pm<br />Saturday: Closed</p>
        </ContactItem>
      </div>
    </div>
  </section>
);

export default Contact;