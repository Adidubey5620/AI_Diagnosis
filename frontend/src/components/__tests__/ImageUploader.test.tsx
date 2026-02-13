import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploader from '../ImageUploader';
import { vi } from 'vitest';

describe('ImageUploader', () => {
    it('renders upload area correctly', () => {
        render(<ImageUploader onUploadComplete={vi.fn()} />); // Correct prop name
        expect(screen.getByText(/Drag & drop DICOM, JPG, PNG/i)).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ImageUploader onUploadComplete={vi.fn()} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
