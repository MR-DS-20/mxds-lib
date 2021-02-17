export interface AsyncUIState {
  id: number;
  loading: boolean;
  error: boolean;
  complete: boolean;
  errMessage?: string;
  successMessage?: string;
}
