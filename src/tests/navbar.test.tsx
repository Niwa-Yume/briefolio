import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from '../components/navbar';

jest.mock('clsx', () => ({
  __esModule: true,
  default: (...args) => args.filter(Boolean).join(' '),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../contexts/AuthContext.tsx', () => ({
  useAuth: () => ({
    user: { email: 'test@email.com' },
    logout: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('class-variance-authority', () => ({
  __esModule: true,
  default: (...args) => args.filter(Boolean).join(' '),
  cva: (...args) => args.filter(Boolean).join(' '),
}));

describe('Navbar', () => {
  it('affiche le bouton de déconnexion quand un utilisateur est connecté', () => {
    render(<Navbar />);
    expect(screen.getByText(/Déconnexion/)).toBeInTheDocument();
  });

  it('appelle logout lors du clic sur le bouton de déconnexion', async () => {
    const { useAuth } = require('../contexts/AuthContext.tsx');
    const logoutMock = useAuth().logout;
    render(<Navbar />);
    const button = screen.getByText(/Déconnexion/);
    fireEvent.click(button);
    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
    });
  });
});
