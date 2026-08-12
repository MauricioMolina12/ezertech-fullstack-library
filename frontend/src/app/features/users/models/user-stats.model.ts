/** Estadísticas de actividad de un usuario (GET /api/users/{id}/stats). */
export interface UserStats {
  totalLoans: number;
  activeLoans: number;
  returnedLoans: number;
  overdueLoans: number;
}
