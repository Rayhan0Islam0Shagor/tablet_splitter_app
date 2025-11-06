# Tablet Splitter

A React Native application for creating, manipulating, and splitting tablet-shaped objects on a touch screen. Users can draw tablets by dragging, move them around, and split them along horizontal and vertical lines with a single tap.

## 📱 Features

### Core Functionality

- **Draw Tablets**: Press and drag on empty screen areas to create new tablets with rounded corners
- **Random Colors**: Each tablet automatically gets a unique, perceptually distinct light color
- **Minimum Size Enforcement**: New tablets must be at least 40x20 dpi; split parts must be at least 20x10 dpi
- **Tablet Splitting**: Single tap/press anywhere on screen splits all tablets intersecting the split lines
  - Vertical split: Splits tablets along a vertical line
  - Horizontal split: Splits tablets along a horizontal line
  - Combined split: Splits tablets along both axes simultaneously
- **Visual Gap**: Split tablet parts are separated by a small visual gap for clarity
- **Move Tablets**: Drag any tablet or tablet part to reposition it
- **Smooth Animations**: Tablet movements are animated smoothly using React Native's Animated API
- **Split Part Preservation**: Split parts retain the original tablet's color and corner radius
- **Smart Splitting**: If a split would create parts smaller than the minimum size, the tablet remains unchanged
- **Z-Index Management**: Dragged tablets automatically move to the top layer
- **Clear All**: Remove all tablets with a single button tap

### User Interface

- **Visual Feedback**:
  - Preview tablet shown while drawing (semi-transparent blue)
  - Split lines displayed as dashed lines during touch/drag
  - Dragging indicator (blue border) on tablets being moved
- **Bottom Action Bar**: Fixed action bar with "Clear All" button
- **Responsive Design**: Works on various screen sizes with safe area insets

## 🛠️ Tech Stack

- **React Native** 0.82.1 - Cross-platform mobile framework
- **TypeScript** 5.8.3 - Type-safe JavaScript
- **React Native Gesture Handler** 2.29.1 - Advanced touch gesture handling
- **React Native Safe Area Context** 5.5.2 - Safe area handling for notched devices
- **React Context API** - Global state management for tablets
- **React Native Animated API** - Smooth position animations

## 📁 Project Structure

```
tablet_splitter/
├── src/
│   ├── components/          # React components
│   │   ├── Tablet.tsx       # Individual tablet component with animations
│   │   ├── PreviewTablet.tsx # Preview tablet shown while drawing
│   │   ├── DashedLine.tsx   # Split line visualization
│   │   ├── DrawArea.tsx     # Main drawing surface component
│   │   └── BottomActionBar.tsx # Action buttons bar
│   ├── context/
│   │   └── TabletContext.tsx # Global state management (Context API)
│   ├── hooks/
│   │   └── useTabletDrawing.ts # Custom hook for drawing/dragging/splitting logic
│   ├── utils/
│   │   ├── tablet.utils.ts  # Tablet manipulation utilities (splitting, intersection)
│   │   └── color.utils.ts   # Color generation and uniqueness checking
│   ├── constants/
│   │   └── tablet.constants.ts # Size constraints and configuration
│   └── types/
│       └── tablet.types.ts  # TypeScript type definitions
├── android/                 # Android native code and resources
├── ios/                     # iOS native code and resources
├── App.tsx                  # Root component
└── package.json            # Dependencies and scripts
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rayhan0Islam0Shagor/tablet_splitter_app.git
   cd tablet_splitter_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Running the App

1. **Start Metro bundler**

   ```bash
   npm start
   ```

2. **Run on Android**

   ```bash
   npm run android
   ```

## 📖 Usage Guide

### Creating Tablets

1. **Draw a new tablet**:
   - Press and drag on an empty area of the screen
   - A semi-transparent preview will show the tablet size
   - Release to create the tablet (must be at least 40x20 dpi)

### Moving Tablets

1. **Reposition a tablet**:
   - Press and drag any existing tablet
   - The tablet will follow your finger with a blue border indicator
   - Release to place it in the new position
   - The tablet moves to the top layer automatically

### Splitting Tablets

1. **Split tablets**:

   - Tap anywhere on the screen
   - Dashed lines appear showing the split position
   - All tablets intersecting the split lines will be split
   - Split parts retain the original color and corner radius
   - Parts smaller than 20x10 dpi won't be created (tablet remains whole)

2. **Split types**:
   - **Vertical split**: Tap creates a vertical split line
   - **Horizontal split**: Tap creates a horizontal split line
   - **Combined split**: Position determines which axes are used

### Managing Tablets

- **Clear All**: Tap the "Clear All" button at the bottom to remove all tablets
- **Split parts**: Split tablet parts can be moved and split again just like original tablets

## 🔧 Key Implementation Details

### State Management

The app uses React Context API for global state management. The `TabletContext` provides:

- `tablets`: Array of all tablets
- `addTablet()`: Create a new tablet
- `updateTablet()`: Update tablet properties
- `removeTablet()`: Delete a tablet
- `splitTablets()`: Split tablets along split lines
- `clearAllTablets()`: Remove all tablets
- `bringToTop()`: Move tablet to top z-index

### Gesture Handling

The app uses `react-native-gesture-handler` for advanced touch handling:

- **Pan Gesture**: Handles tablet drawing and dragging
- **Tap Gesture**: Detects single taps for splitting
- **Simultaneous Gestures**: Combines tap and pan for immediate feedback

### Tablet Splitting Algorithm

1. **Intersection Detection**: Determines which tablets intersect split lines
2. **Size Validation**: Checks if split parts meet minimum size requirements
3. **Split Creation**: Creates new tablet parts with:
   - Unique IDs (timestamp + random + counter)
   - Preserved color and border radius
   - Correct position and dimensions
   - Visual gap between parts
4. **State Update**: Replaces original tablets with split parts

### Color Generation

The app generates perceptually distinct colors using HSL color space:

- Light colors (70-90% lightness) for better visibility
- Moderate saturation (40-80%) for vibrant but not overwhelming colors
- Similarity checking to avoid similar colors
- Fallback to best color found if perfect match isn't possible

### Animation

Tablet movements use React Native's `Animated.spring()`:

- Smooth spring physics for natural movement
- Immediate updates during dragging (no animation delay)
- Animated transitions when tablets are repositioned programmatically

## 📐 Constants and Configuration

Located in `src/constants/tablet.constants.ts`:

- `MIN_TABLET_WIDTH`: 40 dpi - Minimum width for new tablets
- `MIN_TABLET_HEIGHT`: 20 dpi - Minimum height for new tablets
- `MIN_PART_WIDTH`: 20 dpi - Minimum width for split parts
- `MIN_PART_HEIGHT`: 10 dpi - Minimum height for split parts
- `DEFAULT_BORDER_RADIUS`: 12 - Default corner radius
- `TAP_THRESHOLD`: 10 pixels - Distance threshold for tap vs drag
- `SPLIT_GAP`: 4 pixels - Visual gap between split parts

## 🏗️ Building APK

### Debug APK

```bash
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📝 Code Quality

- **TypeScript**: Full type safety throughout the codebase
- **ESLint**: Code linting configured
- **Prettier**: Code formatting configured
- **Modular Architecture**: Separated concerns (components, hooks, utils, context)

## 👨‍💻 Development Notes

- The app uses React Native's built-in Animated API (not react-native-reanimated) for simplicity
- All tablet operations are handled through the Context API for centralized state management
- Gesture handling is optimized for immediate visual feedback
- Color generation uses HSL color space for perceptually accurate similarity checking
- Unique IDs for split parts use timestamp + counter + random string to prevent collisions
