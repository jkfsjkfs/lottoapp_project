// app.config.js
export default ({ config }) => ({
  ...config,
  expo: {
    ...(config.expo || {}),
    name: "LottoApp",
    slug: "lottoapp",
    extra: {
      apiURLProd: "https://tu-dominio.com", // cuando publiques
      apiPortDev: 3001,                      // puerto del backend local
      apiKey: "Y2xhdmUtc3VwZXItc2VjcmV0YS1zb2xvLWFwcA" // tu APP_KEY del backend
    }
  }
});
