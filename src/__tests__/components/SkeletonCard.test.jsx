import React from 'react';
import { render } from '@testing-library/react';
import SkeletonCard from '../../components/skeleton/SkeletonCard';

describe('SkeletonCard component', () => {
  test('renders skeleton card with all elements', () => {
    const { container } = render(<SkeletonCard />);
    
    // Check if the main container is rendered
    const cardElement = container.querySelector('.skeleton-card');
    expect(cardElement).toBeInTheDocument();
    
    // Check if the skeleton image is rendered
    const imageElement = container.querySelector('.skeleton-image');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveClass('pulse');
    
    // Check if the skeleton content container is rendered
    const contentElement = container.querySelector('.skeleton-content');
    expect(contentElement).toBeInTheDocument();
    
    // Check if all the skeleton text elements are rendered
    const titleElement = container.querySelector('.skeleton-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('pulse');
    
    const textElements = container.querySelectorAll('.skeleton-text');
    expect(textElements.length).toBe(2);
    expect(textElements[0]).toHaveClass('pulse');
    expect(textElements[1]).toHaveClass('pulse');
    expect(textElements[1]).toHaveStyle('width: 70%');
    
    // Check if the skeleton price is rendered
    const priceElement = container.querySelector('.skeleton-price');
    expect(priceElement).toBeInTheDocument();
    expect(priceElement).toHaveClass('pulse');
    
    // Check if the skeleton button is rendered
    const buttonElement = container.querySelector('.skeleton-button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('pulse');
  });
});
