import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'
import useFetch from '@/app/hooks/useFetch';
 
jest.mock("../src/app/hooks/useFetch", () => jest.fn());


const mockData = [
  {
    name: { common: "France" },
    cca3: "FRA",
    flags: { png: "https://flagcdn.com/w320/fr.png" },
    population: 67081000,
    currencies: { EUR: { name: "Euro" } },
    languages: { fra: "French" },
  },
  {
    name: { common: "Germany" },
    cca3: "DEU",
    flags: { png: "https://flagcdn.com/w320/de.png" },
    population: 83149300,
    currencies: { EUR: { name: "Euro" } },
    languages: { deu: "German" },
  },
];

describe('Page', () => {
  it('renders a heading', () => {

    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<Home />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  });

  it("renders loading state", () => {
    // Mock loading state
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<Home />);

    // Check if loading is rendered
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    // Mock error state
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: new Error("Failed to fetch countries"),
    });

    render(<Home />);

    // Check if error message is rendered
    expect(screen.getByText("Error: Failed to fetch countries")).toBeInTheDocument();
  });
})