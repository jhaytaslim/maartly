export {};

type Mocked<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? jest.Mock : T[P];
};

declare global {
  var configMock: Mocked<ConfigService>;
}
