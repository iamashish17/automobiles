const ContactMap = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 sm:px-6">
      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200 sm:h-120">
        <iframe
          src="https://maps.google.com/maps?q=28.093884,81.651941&z=16&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
}

export default ContactMap
