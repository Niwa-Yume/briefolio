import { render, screen } from '@testing-library/react';

import UnicornStudioEmbed from '../components/UnicornStudioEmbed';

describe('UnicornStudioEmbed', () => {
  it('rend le conteneur avec l\'attribut data-us-project', () => {
    render(<UnicornStudioEmbed />);
    const container = screen.getByTestId('unicorn-embed');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-us-project', 'EtMztKQLYrjjPU6lz8VB');
  });
});
