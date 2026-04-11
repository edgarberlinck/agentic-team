export interface IPasswordVerifier {
  verify(plain: string, hash: string): Promise<boolean>;
}
