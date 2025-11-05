import { useState, useRef, useMemo, useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useTablets } from '../context/TabletContext';
import {
  findTabletAtPoint,
  calculateTabletDimensions,
} from '../utils/tablet.utils';
import {
  MIN_TABLET_WIDTH,
  MIN_TABLET_HEIGHT,
  DEFAULT_BORDER_RADIUS,
} from '../constants/tablet.constants';

export interface PreviewTabletState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SplitLinesState {
  x?: number;
  y?: number;
}

export const useTabletDrawing = () => {
  const { tablets, addTablet, updateTablet, bringToTop } = useTablets();

  const [splitLines, setSplitLines] = useState<SplitLinesState | null>(null);
  const [previewTablet, setPreviewTablet] = useState<PreviewTabletState | null>(
    null,
  );
  const [draggedTabletId, setDraggedTabletId] = useState<string | null>(null);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragEndRef = useRef<{ x: number; y: number } | null>(null);
  const isDrawingTabletRef = useRef<boolean>(false);
  const draggedTabletRef = useRef<{
    id: string;
    startX: number;
    startY: number;
  } | null>(null);
  const tabletsRef = useRef(tablets);
  const addTabletRef = useRef(addTablet);
  const updateTabletRef = useRef(updateTablet);
  const bringToTopRef = useRef(bringToTop);

  // Update refs when values change
  tabletsRef.current = tablets;
  addTabletRef.current = addTablet;
  updateTabletRef.current = updateTablet;
  bringToTopRef.current = bringToTop;

  // Helper function to handle touch start
  const handleTouchStart = useCallback((touchX: number, touchY: number) => {
    // Find tablet at touch point
    const tabletAtPoint = findTabletAtPoint(touchX, touchY, tabletsRef.current);

    if (tabletAtPoint) {
      // Start dragging an existing tablet - show indicator immediately
      draggedTabletRef.current = {
        id: tabletAtPoint.id,
        startX: tabletAtPoint.x,
        startY: tabletAtPoint.y,
      };
      setDraggedTabletId(tabletAtPoint.id);
      dragStartRef.current = { x: touchX, y: touchY };
    } else {
      // Start drawing a new tablet
      isDrawingTabletRef.current = true;
      dragStartRef.current = { x: touchX, y: touchY };
      dragEndRef.current = { x: touchX, y: touchY };
      setPreviewTablet({
        x: touchX,
        y: touchY,
        width: MIN_TABLET_WIDTH,
        height: MIN_TABLET_HEIGHT,
      });
    }

    // Always show split lines
    setSplitLines({
      x: touchX,
      y: touchY,
    });
  }, []);

  // Tap gesture for immediate press detection
  const tapGesture = useMemo(
    () =>
      Gesture.Tap().onTouchesDown(event => {
        const touchX = event.allTouches[0].x;
        const touchY = event.allTouches[0].y;
        handleTouchStart(touchX, touchY);
      }),
    [handleTouchStart],
  );

  // Pan gesture for dragging
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0) // Activate immediately on touch
        .onStart(event => {
          handleTouchStart(event.x, event.y);
        })
        .onUpdate(event => {
          const currentX = event.x;
          const currentY = event.y;

          // Update split lines position during drag
          setSplitLines({
            x: currentX,
            y: currentY,
          });

          // Handle tablet dragging
          if (draggedTabletRef.current && dragStartRef.current) {
            const tablet = tabletsRef.current.find(
              t => t.id === draggedTabletRef.current?.id,
            );

            if (tablet) {
              // Calculate the offset from the initial touch point
              const deltaX = currentX - dragStartRef.current.x;
              const deltaY = currentY - dragStartRef.current.y;

              // Calculate new position
              const newX = draggedTabletRef.current.startX + deltaX;
              const newY = draggedTabletRef.current.startY + deltaY;

              // Update tablet position in real-time
              updateTabletRef.current(draggedTabletRef.current.id, {
                x: Math.max(0, newX), // Prevent negative X
                y: Math.max(0, newY), // Prevent negative Y
              });
            }
          }

          // Update preview tablet if we're drawing a new one
          if (isDrawingTabletRef.current && dragStartRef.current) {
            dragEndRef.current = { x: currentX, y: currentY };
            const dimensions = calculateTabletDimensions(
              dragStartRef.current.x,
              dragStartRef.current.y,
              currentX,
              currentY,
            );
            setPreviewTablet(dimensions);
          }
        })
        .onEnd(() => {
          // Create tablet if we were drawing one
          if (
            isDrawingTabletRef.current &&
            dragStartRef.current &&
            dragEndRef.current
          ) {
            const startX = dragStartRef.current.x;
            const startY = dragStartRef.current.y;
            const endX = dragEndRef.current.x;
            const endY = dragEndRef.current.y;

            // Calculate final dimensions
            const finalDimensions = calculateTabletDimensions(
              startX,
              startY,
              endX,
              endY,
            );

            // Ensure we have minimum size
            if (
              finalDimensions.width >= MIN_TABLET_WIDTH &&
              finalDimensions.height >= MIN_TABLET_HEIGHT
            ) {
              // Add the tablet to context using ref
              addTabletRef.current({
                x: finalDimensions.x,
                y: finalDimensions.y,
                width: finalDimensions.width,
                height: finalDimensions.height,
                borderRadius: DEFAULT_BORDER_RADIUS,
              });
            }
          }

          // Bring dragged tablet to top if it was dragged
          if (draggedTabletRef.current) {
            bringToTopRef.current(draggedTabletRef.current.id);
          }

          // Reset drawing state
          isDrawingTabletRef.current = false;
          setPreviewTablet(null);
          setDraggedTabletId(null);
          dragStartRef.current = null;
          dragEndRef.current = null;
          draggedTabletRef.current = null;

          // Hide split lines after a short delay
          setTimeout(() => {
            setSplitLines(null);
          }, 300);
        })
        .onFinalize(() => {
          // Reset drawing state on gesture finalize
          isDrawingTabletRef.current = false;
          setPreviewTablet(null);
          setDraggedTabletId(null);
          dragStartRef.current = null;
          dragEndRef.current = null;
          draggedTabletRef.current = null;

          // Ensure lines are hidden when gesture ends
          setTimeout(() => {
            setSplitLines(null);
          }, 300);
        }),
    [handleTouchStart],
  );

  // Combine tap and pan gestures - tap shows indicator immediately, pan handles dragging
  const gesture = useMemo(
    () => Gesture.Simultaneous(tapGesture, panGesture),
    [tapGesture, panGesture],
  );

  return {
    gesture,
    splitLines,
    previewTablet,
    draggedTabletId,
  };
};
