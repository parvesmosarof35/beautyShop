import ContactContent from './ContactContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | LUNEL Beauty',
  description: 'Get in touch with the LUNEL Beauty team for support, inquiries, or feedback. We are here to help.',
};

export default function ContactPage() {
  return <ContactContent />;
}
