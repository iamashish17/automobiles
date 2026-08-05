import Navbar from '../component/layout/Navbar';
import Footer from '../component/layout/Footer';

const content = {
  privacy: {
    title: 'Privacy Policy',
    paragraphs: [
      'New Purnagiri Automobiles uses the information you provide to manage service bookings, parts orders, customer support, and account access.',
      'We do not sell customer information. Order and contact details are used only for business operations, payment confirmation, and customer communication.',
      'For privacy questions or correction requests, contact us through the contact page.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    paragraphs: [
      'Service bookings and parts orders are subject to availability, confirmation, and accurate customer information.',
      'Parts orders paid through Khalti are fulfilled only after the payment lookup status is Completed.',
      'Prices, stock, and service availability may change before confirmation.',
    ],
  },
};

export default function LegalPage({ type }) {
  const page = content[type] || content.privacy;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.24em] text-blue-600">New Purnagiri Automobiles</p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900">{page.title}</h1>
        <div className="mt-8 space-y-4 text-sm leading-7 text-gray-600">
          {page.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
