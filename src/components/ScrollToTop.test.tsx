import { waitFor } from '@testing-library/react';
import { Link, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ScrollToTop } from '@/components/ScrollToTop.js';
import { renderWithProviders, screen, userEvent } from '@/test/test-utils.js';

describe('ScrollToTop', () => {
  it('scrolls to the top after the pathname changes', async () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });

    renderWithProviders(
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Link to="/next">Open next route</Link>} />
          <Route path="/next" element={<span>Next route</span>} />
        </Routes>
      </>,
      { route: '/', withAuth: false },
    );

    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, 0));
    await userEvent.click(screen.getByRole('link', { name: 'Open next route' }));
    await waitFor(() => expect(scrollTo).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Next route')).toBeInTheDocument();
  });
});
