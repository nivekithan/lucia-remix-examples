const { flatRoutes } = require("remix-flat-routes");
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverModuleFormat: "cjs",
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  tailwind: true,
  ignoredRouteFiles: ["**/*"],
  serverDependenciesToBundle: [/lucia-auth/, "@lucia-auth/adapter-sqlite"],
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
};
