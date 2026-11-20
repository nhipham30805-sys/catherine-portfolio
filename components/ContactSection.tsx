import ContactForm from "./ContactForm";
import ContactLinks from "./ContactLinks";

// The contact block. Ends the homepage and is the whole /contact page (where the heading is the page's h1).
// Layout ("Portrait column", chosen by Catherine Nov 2026): her photo and the form side by side at the same
// height, the heading set over the photo's darkened foot; the intro, email, LinkedIn and CV sit underneath.
export default function ContactSection({ page = false }: { page?: boolean }) {
  const Heading = page ? "h1" : "h2";
  return (
    <section id="contact" className="ct wrap pb-24 pt-32 md:pb-32 md:pt-44">
      <div className="ct-top">
        <div className="ct-photo">
          <img
            src="/images/catherine-park.jpg"
            alt="Catherine crouched on the grass in a park, pulling a playful face under a clear blue sky"
            width={1000}
            height={1500}
            loading={page ? "eager" : "lazy"}
            decoding="async"
          />
          <p className="ct-status">
            <i aria-hidden />
            Ready to start now
          </p>
          <Heading className="ct-title display">The view&apos;s better with company.</Heading>
        </div>
        <div id="contact-form" className="ct-formcol scroll-mt-28">
          <ContactForm />
        </div>
      </div>
      <div className="ct-under">
        <div>
          <p className="ct-body">
            Building something ambitious and looking for a marketer who works hard and smart? Let&apos;s talk. I reply within 24 hours.
          </p>
        </div>
        <ContactLinks />
      </div>
    </section>
  );
}
