/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js traces output from the correct project root when multiple lockfiles exist.
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig