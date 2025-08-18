
import { useContext } from 'react';
import { AuthContext } from '../app/AppProvider'; // ajusta la ruta si es necesario

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Si ves este error, el Provider no está montado arriba de este componente
    throw new Error('AuthContext no está disponible. ¿AppProvider envuelve tu navegación?');
  }
  return ctx;
}
