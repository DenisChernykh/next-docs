/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/": ["./templates/**/*"],
    "/blocks/*": ["./templates/**/*"],
    "/components/*": ["./templates/**/*"],
    "/preview/*": [
      "./templates/**/*",
      "./node_modules/modules-vg-reels/dist/modules-vg-reels.css",
      "./node_modules/swiper/swiper.css",
      "./node_modules/swiper/modules/free-mode.css",
      "./node_modules/swiper/modules/grid.css",
    ],
    "/api/template-assets/*": ["./templates/**/*"],
    "/api/vendor-assets/*": [
      "./node_modules/modules-vg-reels/**/*",
      "./node_modules/swiper/**/*",
    ],
  },
};

export default nextConfig;
