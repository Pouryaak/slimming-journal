export type ActionState<T> =
  | {
      status: 'success';
      message: string;
      data?: T;
    }
  | {
      status: 'error';
      error: string | { [key: string]: string[] | undefined };
    }
  | null;
