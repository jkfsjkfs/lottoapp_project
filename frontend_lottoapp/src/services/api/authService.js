import { apiPost } from '../../api/client';

export async function loginUsuario(login, password) {
  const res = await apiPost('/api/auth/login', { login, password });
  const { idusuario, idperfil, nombre } = res || {};
  if (!idusuario) throw new Error('Credenciales inválidas');
  return { idusuario, idperfil, nombre, login };
}
