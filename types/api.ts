export type ActionResponse<T = {}> = 
  | ({ success: true; status: number } & T)
  | { success: false; error: string; status: number };
