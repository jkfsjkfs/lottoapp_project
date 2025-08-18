export const PROFILES = {
  ADMIN: { id: 1, name: "Administrador" },
  PROMOTOR: { id: 2, name: "Promotor" },
  VENDEDOR: { id: 3, name: "Vendedor" },
};

// Helper: obtener nombre desde id
export function getProfileName(id) {
  const match = Object.values(PROFILES).find((p) => p.id === id);
  return match ? match.name : "Desconocido";
}
