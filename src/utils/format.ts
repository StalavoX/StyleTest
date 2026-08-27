/**
 * Utilidades de formato para la aplicación Luna Azul.
 */

/**
 * Formatea un número como Pesos Colombianos (COP).
 * Ejemplo: 25000 -> "$ 25.000"
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$ 0';
  }
  return `$ ${Math.round(amount).toLocaleString('es-CO')}`;
}
