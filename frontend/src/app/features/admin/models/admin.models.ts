/**
 * Estadísticas del dashboard.
 * Endpoint: GET /api/dashboard/stats
 */
export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  loanedBooks: number;
  reservedBooks: number;
  totalUsers: number;
  activeLoans: number;
  overdueLoans: number;
}
