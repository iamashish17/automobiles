const ContactMap = () => {
  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm lg:h-full lg:min-h-[360px]">
        <iframe
          title="New Purnagiri Automobiles location"
          src="https://maps.google.com/maps?q=28.093884,81.651941&z=16&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    </div>
  )
}

export default ContactMap
