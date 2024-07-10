import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './Layout';

describe('Layout Component', () => {
  it('renders the layout with children', () => {
    render(
      <Layout>
        <div data-testid="child-element">Test Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays the app title in the header', () => {
    render(<Layout>Content</Layout>);
    
    expect(screen.getByText('Mon Application')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<Layout>Content</Layout>);
    
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
  });
}); 