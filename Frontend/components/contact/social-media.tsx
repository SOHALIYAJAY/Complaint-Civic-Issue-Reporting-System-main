'use client'

import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

export default function SocialMedia() {
  const socialLinks = [
    {
      icon: Facebook,
      name: 'Facebook',
      url: 'https://facebook.com/civictrackgujarat',
      color: 'hover:text-blue-600'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      url: 'https://twitter.com/civictrackguj',
      color: 'hover:text-blue-400'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/civictrack',
      color: 'hover:text-blue-700'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      url: 'https://instagram.com/civictrack_guj',
      color: 'hover:text-pink-600'
    },
    {
      icon: Youtube,
      name: 'YouTube',
      url: 'https://youtube.com/civictrack',
      color: 'hover:text-red-600'
    }
  ]

  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Follow Us</h2>
          <p className="text-lg text-muted-foreground">Stay updated with our latest news and announcements</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3 px-6 py-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 ${social.color}`}
            >
              <social.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{social.name}</span>
            </a>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 p-8 rounded-xl border border-border bg-card">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Subscribe to Updates</h3>
              <p className="text-muted-foreground">
                Get the latest news, updates, and important announcements about CivicTrack delivered to your inbox.
              </p>
            </div>

            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}