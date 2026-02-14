export const metadata = {
  title: 'Contact | CDLS',
  description: 'Get in touch with the Center for Developing Leadership in Science.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-charcoal text-ivory py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            We&apos;d love to hear from you. Reach out to learn more about our work or explore partnership opportunities.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-charcoal mb-2 normal-case">Email</h3>
                  <a
                    href="mailto:cdls@ucla.edu"
                    className="text-tree-leaf hover:underline"
                  >
                    cdls@ucla.edu
                  </a>
                </div>

                <div>
                  <h3 className="font-bold text-charcoal mb-2 normal-case">Location</h3>
                  <p className="text-gray-600">
                    UCLA Institute of the Environment and Sustainability<br />
                    La Kretz Hall, Suite 300<br />
                    Los Angeles, CA 90095
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-charcoal mb-2 normal-case">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="text-gray-600 hover:text-tree-leaf transition-colors">
                      Twitter
                    </a>
                    <a href="#" className="text-gray-600 hover:text-tree-leaf transition-colors">
                      Instagram
                    </a>
                    <a href="#" className="text-gray-600 hover:text-tree-leaf transition-colors">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-6">Send a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tree-leaf focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tree-leaf focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tree-leaf focus:border-transparent"
                  >
                    <option value="">Select a topic...</option>
                    <option value="general">General Inquiry</option>
                    <option value="fellowship">Fellowship Information</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="media">Media/Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tree-leaf focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-tree-leaf text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Send Message
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-500">
                We typically respond within 2-3 business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
