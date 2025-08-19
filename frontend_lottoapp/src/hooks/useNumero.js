import { useState } from 'react';
import { isNumeroValido } from '../services/validation/numeroRules';

export default function useNumero(initial='') {
  const [numero, setNumero] = useState(initial);
  const valido = isNumeroValido(numero);
  return { numero, setNumero, valido };
}
