# Happy Study 3D

**Free educational PWA for CXC, CAPE, and Software Engineering**

Happy Study 3D is an interactive educational application designed to help students prepare for **CXC/CSEC, CAPE, and beginner-to-intermediate software engineering** through an engaging 3D study environment.

## Table of Contents

* [Features](#features)
* [Learning Philosophy](#learning-philosophy)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Deployment](#deployment)
* [Curriculum Data](#curriculum-data)
* [License](#license)
* [Disclaimer](#disclaimer)
* [Support](#support)

## Features

* 📚 **CXC/CSEC Curriculum** — 15 subjects with structured study paths
* 🎓 **CAPE Curriculum** — 12 subjects covering Unit 1 and Unit 2
* 💻 **Software Engineering** — Learn HTML, CSS, JavaScript, Python, TypeScript, and Rust
* 🎮 **3D Interactive Interface** — Three.js-powered study environment
* 📊 **Progress Tracking** — Track progress and identify areas that need improvement
* 🎙️ **Audio Studio** — Record and manage study notes
* 📱 **PWA Support** — Installable on supported devices
* 🪟 **Windows App** — Designed for packaging and distribution through the Microsoft Store
* 🔄 **Offline Ready** — Study without an internet connection using local-first storage

## Learning Philosophy

The **Minimum-Pass System** helps students focus on the knowledge and skills they need most.

### Must Know

Essential concepts students should understand to build a strong foundation and prepare for examinations.

### Practice

Activities and exercises designed to reinforce understanding.

### Exam Ready

Exam-style questions designed to help students apply what they have learned.

### Going Further

Advanced concepts for students who want to go beyond the core material.

### Research More

Additional external resources for deeper exploration and independent learning.

## Tech Stack

| Technology                   | Purpose                                  |
| ---------------------------- | ---------------------------------------- |
| **SvelteKit 5**              | Frontend application framework           |
| **TypeScript**               | Type-safe application development        |
| **Three.js**                 | 3D graphics and interactive environments |
| **IndexedDB**                | Local-first data storage                 |
| **vite-plugin-pwa**          | Progressive Web App functionality        |
| **Vercel**                   | Web deployment                           |
| **PWABuilder**               | Windows app packaging                    |
| **Microsoft Partner Center** | Microsoft Store distribution             |

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/aldanedev-create/happy-study-3d.git
cd happy-study-3d
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## Project Structure

```text
happy-study-3d/
├── src/
│   ├── lib/
│   │   ├── components/    # Svelte components
│   │   ├── data/          # Curriculum JSON files
│   │   ├── services/      # Application and business logic
│   │   ├── stores/        # State management
│   │   └── types/         # TypeScript types
│   └── routes/            # SvelteKit pages
├── static/
│   ├── icons/             # PWA icons
│   └── sounds/            # Audio files
└── tests/                 # Unit and end-to-end tests
```

## Deployment

Happy Study 3D can be deployed as a web application and packaged as a Windows application.

### Web Deployment

1. Push the project to GitHub.
2. Connect the repository to Vercel.
3. Configure the production build.
4. Deploy the application.

### Windows Deployment

1. Build the production PWA.
2. Use **PWABuilder** to generate the Windows package.
3. Test the generated MSIX package.
4. Submit the application through Microsoft Partner Center.

## Curriculum Data

Curriculum content is stored as JSON files inside:

```text
src/lib/data/
```

A typical curriculum topic follows this structure:

```json
{
  "topic": "Algebra",
  "curriculum_area": "mathematics",
  "must_know": [],
  "summary": "",
  "practice": [],
  "exam_questions": []
}
```

Keeping curriculum content separate from application logic makes it easier to update subjects, topics, questions, summaries, and learning materials without hard-coding the content directly into Svelte components.

## License

MIT License — see the [LICENSE](LICENSE) file for details.

## Disclaimer

Happy Study 3D is an independent study tool and is **not affiliated with, endorsed by, or sponsored by the Caribbean Examinations Council (CXC)**.

CXC/CAPE syllabuses, requirements, and examination information may change. Students should verify curriculum information and examination requirements against the appropriate official CXC materials.

## Support

For questions, bug reports, or support:

* **GitHub Issues:** [Create an Issue](https://github.com/aldanedev-create/happy-study-3d/issues)
* **Email:** [aldanehutchinson5@gmail.com](mailto:aldanehutchinson5@gmail.com)
