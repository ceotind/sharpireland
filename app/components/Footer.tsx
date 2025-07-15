"use client";

import Link from 'next/link';

export default function Footer() {
  const quickLinks = [
    { name: 'Technologies', href: '#technologies' },
    { name: 'Projects', href: '#projects' },
    { name: 'Process', href: '#our-process' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Web Development',
    'React Development',
    'Next.js Development',
    'Full-Stack Development',
    'UI/UX Design'
  ];

  const socialLinks = [
    {
      name: 'Reddit',
      href: 'https://reddit.com/r/sharpdigital',
      icon: (
        <svg width="24" height="24" fill="#ffffff" viewBox="0 0 256 256">
          <path d="M248,104a32,32,0,0,0-52.94-24.19C185.29,77.54,171.47,76,152,76c-28.84,0-56.45,2.38-80.08,6.91A32,32,0,0,0,24,104a31.1,31.1,0,0,0,5.31,17.11C28.74,125.3,28,129.6,28,134c0,42.66,54.24,78,124,78s124-35.34,124-78c0-4.4-.74-8.7-1.31-12.89A31.1,31.1,0,0,0,248,104ZM72,132a12,12,0,1,1,12,12A12,12,0,0,1,72,132Zm81,51.43c-10.29,5.15-23.88,7.57-41,7.57s-30.71-2.42-41-7.57a8,8,0,0,1,7.16-14.32c16.12,8.06,45.72,8.06,67.68,0a8,8,0,1,1,7.16,14.32ZM184,144a12,12,0,1,1,12-12A12,12,0,0,1,184,144Z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/sharpdigital',
      icon: (
        <svg width="24" height="24" fill="#ffffff" viewBox="0 0 256 256">
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"/>
        </svg>
      )
    },
    {
      name: 'Website',
      href: 'https://sharpdigital.ie',
      icon: (
        <svg width="24" height="24" fill="#ffffff" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM101.63,168h52.74C149,186.34,140,202.87,128,215.89,116,202.87,107,186.34,101.63,168ZM98,152a145.72,145.72,0,0,1,0-48h60a145.72,145.72,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.79a161.79,161.79,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154.37,88H101.63C107,69.66,116,53.13,128,40.11,140,53.13,149,69.66,154.37,88Zm19.84,16h38.46a88.15,88.15,0,0,1,0,48H174.21a161.79,161.79,0,0,0,0-48Zm32.16-16H170.94a142.39,142.39,0,0,0-20.26-45A88.37,88.37,0,0,1,206.37,88ZM105.32,43A142.39,142.39,0,0,0,85.06,88H49.63A88.37,88.37,0,0,1,105.32,43ZM49.63,168H85.06a142.39,142.39,0,0,0,20.26,45A88.37,88.37,0,0,1,49.63,168Zm101.05,45a142.39,142.39,0,0,0,20.26-45h35.43A88.37,88.37,0,0,1,150.68,213Z"/>
        </svg>
      )
    }
  ];

  return (
    <footer style={{ backgroundColor: '#171717', color: '#ffffff' }} className="relative">
      {/* Main Footer Content */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 style={{ color: '#ffffff' }} className="text-2xl font-bold mb-4">Sharp Digital</h3>
              <p style={{ color: '#d1d5db' }} className="mb-6 max-w-md">
                Premier web development agency delivering effective digital solutions.
                We craft custom web applications with cutting-edge technologies.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    style={{ backgroundColor: '#6b7280' }}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: '#ffffff' }} className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      style={{ color: '#d1d5db' }}
                      className="hover:opacity-80 transition-opacity duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 style={{ color: '#ffffff' }} className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service} style={{ color: '#d1d5db' }} className="text-sm">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ borderTopColor: '#6b7280' }} className="border-t pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 style={{ color: '#ffffff' }} className="font-semibold mb-2">Email</h5>
                <a
                  href="mailto:dilshad@sharpdigital.in"
                  style={{ color: '#d1d5db' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  dilshad@sharpdigital.in
                </a>
              </div>
              <div>
                <h5 style={{ color: '#ffffff' }} className="font-semibold mb-2">Locations</h5>
                <p style={{ color: '#d1d5db' }}>Ireland & India</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{ borderTopColor: '#6b7280' }} className="border-t pt-6 text-center">
            <p style={{ color: '#9ca3af' }} className="text-sm">
              © {new Date().getFullYear()} Sharp Digital. All rights reserved. |
              <span className="ml-1">Crafting digital experiences with precision.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
