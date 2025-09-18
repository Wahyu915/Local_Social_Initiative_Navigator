import React, { useState, useEffect } from "react"

const images = [
  "https://via.placeholder.com/1200x400/0077b6/ffffff?text=Helping+Hands",
  "https://via.placeholder.com/1200x400/0096c7/ffffff?text=Volunteer+Today",
  "https://via.placeholder.com/1200x400/00b4d8/ffffff?text=Support+NGOs",
]

export default function Carousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="carousel">
      <img src={images[index]} alt="carousel" />
    </div>
  )
}
