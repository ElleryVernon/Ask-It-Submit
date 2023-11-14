/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { buildId, dev, isServer, defaultLoader, webpack }) => {
		config.resolve.alias.canvas = false;
		config.resolve.alias.encoding = false;
		return config;
	},
	experimental: {
		webpackBuildWorker: true,
	},
	images: { domains: ["api.dicebear.com"], dangerouslyAllowSVG: true },
};

module.exports = nextConfig;
