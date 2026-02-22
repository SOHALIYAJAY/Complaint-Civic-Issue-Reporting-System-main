import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-4">About CivicTrack</h4>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Empowering citizens to report, track, and resolve civic issues with transparent governance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Raise Complaint', 'Track Status', 'Departments', 'FAQ'].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              {['User Guide', 'Video Tutorials', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">1800-233-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">support@civictrack.gov.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">Gandhinagar, Gujarat, India</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <p className="text-primary-foreground/80 text-sm">
              © 2024 Gujarat CivicTrack. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                Privacy Policy
              </Link>
              <span className="text-primary-foreground/40">•</span>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                Terms of Service
              </Link>
              <span className="text-primary-foreground/40">•</span>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                Accessibility
              </Link>
            </div>
          </div>

          <div className="bg-primary-foreground/5 rounded-lg p-4">
            <p className="text-primary-foreground/70 text-xs leading-relaxed">
              <span className="font-semibold">Disclaimer:</span> This is a demonstration portal for showcasing Smart Governance initiatives. For actual complaint registration, please visit the official Gujarat government portal.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
