import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../client";
import { env } from "@/core/config/env";

/**
 * Tests pour l'instance Axios (client.ts)
 */
describe("API Client", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Créer un mock adapter pour intercepter les requêtes
    mock = new MockAdapter(apiClient);

    // Clear localStorage avant chaque test
    localStorage.clear();
  });

  afterEach(() => {
    // Restaurer l'état original
    mock.restore();
  });

  describe("Configuration de base", () => {
    it("devrait avoir la baseURL correcte", () => {
      expect(apiClient.defaults.baseURL).toBe(env.apiUrl);
    });

    it("devrait avoir un timeout de 10 secondes", () => {
      expect(apiClient.defaults.timeout).toBe(10000);
    });

    it("devrait avoir le header Content-Type: application/json", () => {
      expect(apiClient.defaults.headers["Content-Type"]).toBe(
        "application/json",
      );
    });

    it("devrait avoir withCredentials: true", () => {
      expect(apiClient.defaults.withCredentials).toBe(true);
    });
  });

  describe("Requêtes HTTP de base", () => {
    it("devrait effectuer une requête GET avec succès", async () => {
      const responseData = { data: { message: "success" } };
      mock.onGet("/test").reply(200, responseData);

      const response = await apiClient.get("/test");

      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
    });

    it("devrait effectuer une requête POST avec succès", async () => {
      const postData = { email: "test@example.com" };
      const responseData = { data: { id: 1 } };

      mock.onPost("/test", postData).reply(201, responseData);

      const response = await apiClient.post("/test", postData);

      expect(response.status).toBe(201);
      expect(response.data).toEqual(responseData);
    });

    it("devrait effectuer une requête PUT avec succès", async () => {
      const putData = { name: "Updated" };
      const responseData = { data: { success: true } };

      mock.onPut("/test/1", putData).reply(200, responseData);

      const response = await apiClient.put("/test/1", putData);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
    });

    it("devrait effectuer une requête DELETE avec succès", async () => {
      mock.onDelete("/test/1").reply(204);

      const response = await apiClient.delete("/test/1");

      expect(response.status).toBe(204);
    });
  });

  describe("Intercepteurs - Gestion des erreurs", () => {
    it("devrait intercepter une erreur 400 (Bad Request)", async () => {
      const errorData = {
        success: false,
        message: "Bad Request",
      };

      mock.onGet("/test").reply(400, errorData);

      await expect(apiClient.get("/test")).rejects.toMatchObject({
        message: "Bad Request",
      });
    });

    it("devrait intercepter une erreur 401 (Unauthorized)", async () => {
      const errorData = {
        success: false,
        message: "Unauthorized",
      };

      mock.onGet("/test").reply(401, errorData);

      await expect(apiClient.get("/test")).rejects.toBeDefined();
    });

    it("devrait intercepter une erreur 404 (Not Found)", async () => {
      const errorData = {
        success: false,
        message: "Not Found",
      };

      mock.onGet("/test").reply(404, errorData);

      await expect(apiClient.get("/test")).rejects.toMatchObject({
        message: "Not Found",
      });
    });

    it("devrait intercepter une erreur 500 (Server Error)", async () => {
      const errorData = {
        success: false,
        message: "Server Error",
      };

      mock.onGet("/test").reply(500, errorData);

      await expect(apiClient.get("/test")).rejects.toMatchObject({
        message: "Server Error",
      });
    });

    it("devrait gérer une erreur réseau (pas de réponse)", async () => {
      mock.onGet("/test").networkError();

      await expect(apiClient.get("/test")).rejects.toThrow();
    });

    it("devrait gérer une erreur de timeout", async () => {
      mock.onGet("/test").timeout();

      await expect(apiClient.get("/test")).rejects.toThrow();
    });
  });

  describe("Intercepteurs - Retry Logic", () => {
    it("devrait réessayer automatiquement après une erreur 500", async () => {
      let attemptCount = 0;

      // Simuler 2 échecs puis 1 succès
      mock.onGet("/test").reply(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return [500, { message: "Server Error" }];
        }
        return [200, { data: "success" }];
      });

      const response = await apiClient.get("/test");

      expect(response.status).toBe(200);
      expect(attemptCount).toBeGreaterThan(1); // A réessayé au moins une fois
    });

    it("devrait réessayer automatiquement après une erreur 503", async () => {
      let attemptCount = 0;

      mock.onGet("/test").reply(() => {
        attemptCount++;
        if (attemptCount < 2) {
          return [503, { message: "Service Unavailable" }];
        }
        return [200, { data: "success" }];
      });

      const response = await apiClient.get("/test");

      expect(response.status).toBe(200);
      expect(attemptCount).toBe(2);
    });

    it("ne devrait PAS réessayer après une erreur 400", async () => {
      let attemptCount = 0;

      mock.onGet("/test").reply(() => {
        attemptCount++;
        return [400, { message: "Bad Request" }];
      });

      await expect(apiClient.get("/test")).rejects.toBeDefined();
      expect(attemptCount).toBe(1); // Une seule tentative
    });
  });

  describe("Intercepteurs - Refresh Token (401)", () => {
    it("devrait appeler /auth/refresh après une erreur 401", async () => {
      // Mock de la requête initiale qui échoue avec 401
      mock.onGet("/protected").replyOnce(401, { message: "Unauthorized" });

      // Mock du refresh qui réussit
      mock.onPost("/auth/refresh").replyOnce(200, {
        accessToken: "new-token",
      });

      // Mock de la requête réessayée qui réussit
      mock.onGet("/protected").replyOnce(200, { data: "success" });

      const response = await apiClient.get("/protected");

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ data: "success" });
    });

    it("devrait rediriger vers /login si le refresh échoue", async () => {
      // Mock window.location.href
      const originalLocation = window.location.href;
      delete (window as any).location;
      window.location = { href: "" } as any;

      // Mock de la requête initiale qui échoue avec 401
      mock.onGet("/protected").reply(401, { message: "Unauthorized" });

      // Mock du refresh qui échoue
      mock.onPost("/auth/refresh").reply(401, { message: "Refresh failed" });

      await expect(apiClient.get("/protected")).rejects.toBeDefined();

      // Vérifier la redirection
      expect(window.location.href).toBe("/login");

      // Restaurer
      window.location.href = originalLocation;
    });

    it("ne devrait PAS boucler infiniment sur /auth/refresh", async () => {
      let refreshCallCount = 0;

      mock.onPost("/auth/refresh").reply(() => {
        refreshCallCount++;
        return [401, { message: "Invalid refresh token" }];
      });

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: "" } as any;

      await expect(apiClient.post("/auth/refresh")).rejects.toBeDefined();

      // Ne devrait appeler /auth/refresh qu'une seule fois (pas de boucle)
      expect(refreshCallCount).toBe(1);
    });
  });

  describe("Headers et Cookies", () => {
    it("devrait envoyer les cookies httpOnly automatiquement", async () => {
      mock.onGet("/test").reply((config) => {
        // Vérifier que withCredentials est true
        expect(config.withCredentials).toBe(true);
        return [200, { data: "success" }];
      });

      await apiClient.get("/test");
    });

    it("devrait inclure des headers personnalisés", async () => {
      const customHeaders = {
        "X-Custom-Header": "custom-value",
      };

      mock.onGet("/test").reply((config) => {
        expect(config.headers?.["X-Custom-Header"]).toBe("custom-value");
        return [200, { data: "success" }];
      });

      await apiClient.get("/test", { headers: customHeaders });
    });
  });

  describe("Gestion des erreurs de validation (422)", () => {
    it("devrait retourner les erreurs de validation", async () => {
      const validationErrors = {
        success: false,
        message: "Validation Error",
        errors: {
          email: ["Email invalide"],
          password: ["Mot de passe trop court"],
        },
      };

      mock.onPost("/test").reply(422, validationErrors);

      await expect(apiClient.post("/test", {})).rejects.toMatchObject({
        message: "Validation Error",
        errors: validationErrors.errors,
      });
    });
  });

  describe("Rate Limiting (429)", () => {
    it("devrait gérer une erreur 429 (Too Many Requests)", async () => {
      const errorData = {
        success: false,
        message: "Too Many Requests",
      };

      mock.onGet("/test").reply(429, errorData);

      await expect(apiClient.get("/test")).rejects.toMatchObject({
        message: "Too Many Requests",
      });
    });
  });

  describe("Requêtes concurrentes", () => {
    it("devrait gérer plusieurs requêtes simultanées", async () => {
      mock.onGet("/test1").reply(200, { data: "test1" });
      mock.onGet("/test2").reply(200, { data: "test2" });
      mock.onGet("/test3").reply(200, { data: "test3" });

      const [res1, res2, res3] = await Promise.all([
        apiClient.get("/test1"),
        apiClient.get("/test2"),
        apiClient.get("/test3"),
      ]);

      expect(res1.data).toEqual({ data: "test1" });
      expect(res2.data).toEqual({ data: "test2" });
      expect(res3.data).toEqual({ data: "test3" });
    });

    it("devrait gérer une requête qui échoue dans un groupe de requêtes concurrentes", async () => {
      mock.onGet("/test1").reply(200, { data: "test1" });
      mock.onGet("/test2").reply(500, { message: "Error" });
      mock.onGet("/test3").reply(200, { data: "test3" });

      const results = await Promise.allSettled([
        apiClient.get("/test1"),
        apiClient.get("/test2"),
        apiClient.get("/test3"),
      ]);

      expect(results[0].status).toBe("fulfilled");
      expect(results[1].status).toBe("rejected");
      expect(results[2].status).toBe("fulfilled");
    });
  });
});
