import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Mental Health Companion title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Mental Health Companion/i);
  expect(titleElement).toBeInTheDocument();
});