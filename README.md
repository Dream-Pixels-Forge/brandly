# Brandly MVP

This is the Minimum Viable Product (MVP) for the Brandly application. It provides a basic framework for generating brand identities, including names, taglines, mission/vision statements, color palettes, typography, and logo descriptions, powered by the Gemini API.

## Technologies Used

-   **Frontend:** React, Vite, Tailwind CSS
-   **Backend:** Node.js (Express.js)
-   **Package Manager:** pnpm
-   **AI Integration:** Gemini API

## Features

-   Brand identity generation based on user input.
-   Configuration for API key management via `.env` file.
-   Development server setup for local testing.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Dream-Pixels-Forge/brandly.git
    cd brandly
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```
4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Development

The project is structured with source code in the `src/` directory. Key components and services are located in `src/components/`, `src/context/`, `src/lib/`, `src/pages/`, and `src/services/`.

## Contributing

Please refer to the project's contribution guidelines (if available). For this MVP, standard Git practices apply.

## License

This project is licensed under the Apache 2.0 License.
