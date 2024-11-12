import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function CardStack() {
  const [cardOrder, setCardOrder] = useState(['card3', 'card2', 'card1'])
  const [isAnimating, setIsAnimating] = useState(false)
  const [shuffleReady, setShuffleReady] = useState(false)

  const getStyles = (index) => {
    const styles = [
      { rotate: -5, left: '0px' },     // Back card
      { rotate: -3, left: '56.6px' },  // Middle card
      { rotate: 0, left: '98.95px' },  // Front card
    ]
    return styles[index]
  }

  const shuffleCards = () => {
    setCardOrder((prevOrder) => [
      prevOrder[1], // Move the middle card to the front
      prevOrder[2], // Move the back card to the middle
      prevOrder[0], // Move the front card to the back
    ])
    setIsAnimating(false) // Reset animation state after shuffle
    setShuffleReady(false) // Reset shuffle readiness
  }

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setShuffleReady(false) // Reset shuffle readiness before starting the move
    }
  }

  return (
    <div className="relative w-full h-[900px] bg-black" onClick={handleClick}>
      {cardOrder.map((card, index) => {
        const styles = getStyles(index) // Get dynamic styles for each card
        const isFrontCard = index === 0 // The first card in the order should animate

        return (
          <motion.img
            key={card}
            src={`/assets/images/${card}.png`}
            alt={`${card} Image`}
            className="absolute w-[320px] rounded-lg shadow-custom"
            initial={{
              rotate: styles.rotate,
              left: styles.left,
            }}
            animate={
              isFrontCard && isAnimating
                ? {
                    x: 245, // Move right
                    y: -32, // Move up
                    rotate: 0, // Reset rotation
                  }
                : {
                    rotate: styles.rotate, 
                    left: styles.left,
                  } // Apply initial styles for other cards
            }
            transition={{ duration: 0.5 }}
            onAnimationComplete={
              isFrontCard && isAnimating
                ? () => {
                    setShuffleReady(true) // Trigger shuffle after animation
                  }
                : undefined
            }
            positionTransition // This ensures smooth transitions for positions
            style={{
              position: 'absolute',
              left: styles.left,
              top: '0px',
              zIndex: 3 - index, // Force visual stacking order based on index
            }}
          />
        )
      })}
      {/* Trigger shuffle only after the front card completes the translation */}
      {shuffleReady && shuffleCards()}
    </div>
  )
}
