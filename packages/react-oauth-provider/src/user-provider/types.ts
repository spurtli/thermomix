export type User<T> = {
  [P in keyof T]?: T[P];
};

export type UserContextType<T> = User<T>;
