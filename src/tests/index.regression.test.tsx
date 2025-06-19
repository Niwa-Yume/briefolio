import { render } from "@testing-library/react";
import HomePage from "../pages";

describe("Test de régression pour la page d'accueil", () => {
  it("devrait se rendre sans erreur", () => {
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });
});
