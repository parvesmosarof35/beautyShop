'use client';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#171717] text-gray-100">
      
      {/* Hero Section */}
      <div className="bg-[#383838] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light mb-4">Cookie Policy</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Last updated: December 17, 2023
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#d4a674]">1. What Are Cookies</h2>
            <p className="mb-4 leading-relaxed text-gray-300">
              As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#d4a674]">2. How We Use Cookies</h2>
            <p className="mb-4 leading-relaxed text-gray-300">
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#d4a674]">3. Disabling Cookies</h2>
            <p className="mb-4 leading-relaxed text-gray-300">
              You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore, it is recommended that you do not disable cookies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#d4a674]">4. The Cookies We Set</h2>
            <ul className="list-disc pl-6 space-y-4 text-gray-300">
              <li>
                <strong>Account related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.
              </li>
              <li>
                <strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
              </li>
              <li>
                <strong>Orders processing related cookies:</strong> This site offers e-commerce or payment facilities and some cookies are essential to ensure that your order is remembered between pages so that we can process it properly.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#d4a674]">5. Third Party Cookies</h2>
            <p className="mb-4 leading-relaxed text-gray-300">
              In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#d4a674]">6. More Information</h2>
            <p className="mb-4 leading-relaxed text-gray-300">
              Hopefully, that has clarified things for you. As was previously mentioned, if there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
            </p>
            <p className="leading-relaxed text-gray-300">
              However, if you are still looking for more information, you can contact us through one of our preferred contact methods:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Email: privacy@lunelbeauty.com</li>
              <li>By visiting this link: <a href="/contact" className="text-[#d4a674] hover:underline">Contact Page</a></li>
            </ul>
          </section>

        </div>
      </div>

    </div>
  );
}
