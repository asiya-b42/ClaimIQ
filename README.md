# HackRxV2

A modern web application built with React, TypeScript, and Vite for document processing and LLM-based analysis.

## Features

- 🔐 User Authentication
- 📊 Interactive Dashboard
- 📄 Document Processing
- 🤖 LLM Integration
- 📈 Accuracy Evaluation
- 🎯 Query Processing
- 📋 Results Display

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Context API for state management

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── LoginForm
│   ├── Dashboard/
│   │   ├── AccuracyEvaluation
│   │   ├── Dashboard
│   │   ├── DocumentsPanel
│   │   ├── FileUpload
│   │   ├── LLMSettings
│   │   ├── ProcessingStages
│   │   ├── QueryInput
│   │   └── ResultsDisplay
│   └── Layout/
│       └── Header
├── contexts/
│   └── AuthContext
├── types/
├── utils/
│   ├── documentProcessor
│   ├── llmProcessor
│   ├── llmService
│   └── mockData
└── App.tsx
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/[your-username]/HackRxV2.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
