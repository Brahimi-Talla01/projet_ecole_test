export class AuthTokens {
  constructor(
    public readonly tokenType: 'Bearer',
    public readonly expiresIn: number, // secondes avant expiration de l'access token
  ) {}

  // Retourne la date d'expiration absolue de l'access token.
  getExpiresAt(): Date {
    return new Date(Date.now() + this.expiresIn * 1000);
  }

  // Indique si le token est considéré comme expiré côté client.
  // Utilise un buffer de 60s pour anticiper l'expiration.
  isExpired(bufferSeconds = 60): boolean {
    return Date.now() + bufferSeconds * 1000 >= this.getExpiresAt().getTime();
  }
}