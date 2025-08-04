# Reaction Time Trainer

A mobile-first Progressive Web App (PWA) for scientific reaction time testing, built with evidence-based protocols from volleyball sports science research.

## 🚀 Features

- **Scientific Testing Protocols**: Evidence-based reaction time measurement following volleyball research methodology
- **Multi-Modal Testing**: Visual and auditory reaction time tests with choice reaction support
- **Outlier Exclusion**: Automatic statistical outlier removal for accurate performance measurement
- **Performance Analytics**: Evidence-based performance ratings (Elite/Competitive/Recreational/Training)
- **PWA Ready**: Full Progressive Web App with offline capabilities and native install
- **Data Export**: CSV export and Web Share API integration
- **Local Storage**: Persistent data storage with personal best tracking
- **Warm-up Protocol**: Scientific 4-stage warm-up sequence for optimal performance

## 📱 Mobile-First Design

Built specifically for smartphone-based testing with:
- Touch-optimized interface
- Haptic feedback support
- Safe area handling for notched devices
- Prevents accidental zoom and scrolling
- Dark theme optimized for reaction testing

## 🔬 Scientific Foundation

Based on research from:
- Volleyball reaction time studies (female setters avg 236ms visual, 200ms auditory)
- Sports science protocols for outlier exclusion
- Evidence-based performance thresholds
- 10-15 trial blocks for statistical reliability

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Wouter** for routing
- **TanStack React Query** for state management

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL support
- **Neon Database** for cloud storage
- **Session management** with PostgreSQL store

### PWA Features
- Service Worker for offline functionality
- Web App Manifest with proper metadata
- Install prompt for native app experience
- Optimized caching strategies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (optional - uses in-memory storage by default)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd reaction-time-trainer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

### Environment Variables

For database functionality (optional):
```env
DATABASE_URL=your_postgresql_connection_string
```

## 📊 Usage

1. **Choose Test Type**: Select visual or auditory reaction time test
2. **Configure Settings**: Set trial count (5-20), volume, and haptic feedback
3. **Warm-up (Optional)**: Complete the 4-stage scientific warm-up protocol
4. **Take Test**: Follow on-screen prompts and react as quickly as possible
5. **View Results**: See your performance with statistical analysis and ratings
6. **Track Progress**: Monitor personal bests and session history
7. **Export Data**: Share results via Web Share API or export as CSV

## 🏐 Performance Thresholds

Based on volleyball research data:

### Simple Reaction Time
- **Visual**: Elite <220ms, Competitive <250ms, Recreational <300ms
- **Auditory**: Elite <180ms, Competitive <220ms, Recreational <280ms

### Choice Reaction Time
- **Visual**: Elite <280ms, Competitive <330ms, Recreational <400ms
- **Auditory**: Elite <250ms, Competitive <300ms, Recreational <380ms

## 📱 PWA Installation

### Mobile (iOS/Android)
1. Open the app in Safari/Chrome
2. Tap the install prompt or "Add to Home Screen"
3. Enjoy the native app experience

### Desktop
1. Look for the install icon in your browser address bar
2. Click to install as a desktop app
3. Access from your applications menu

## 👨‍🔬 About the Developer

**Alioui Salah Dine**  
*Ph.D. in Sport Sciences – Elite Sports Training (2025)*  
*Researcher | Sports Technologist | Developer*

From El Bayadh, Algeria, specializing in elite athletic training with focus on volleyball and youth development. This application bridges the gap between scientific research and practical sports training through accessible, evidence-based technology.

**Mission**: *Every athlete deserves access to valid, affordable performance tools—regardless of geography or funding.*

### Contact
- **Email**: salahallioui01@gmail.com
- **GitHub**: Salahalioui
- **Google Scholar**: Alioui Salah Dine

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Volleyball research community for evidence-based thresholds
- Sports science methodology for testing protocols
- Open source community for excellent tooling and libraries

---

**Built with scientific rigor for accessible sports performance testing**