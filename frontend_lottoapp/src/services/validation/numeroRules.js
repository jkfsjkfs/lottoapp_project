export const isNumeroValido = (valor) => /^[0-9]{2,4}$/.test(String(valor ?? '').trim());
