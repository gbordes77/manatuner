export const useScrollAnimation = () => {
  const scrollVariants = {
    hidden: {
      opacity: 0,
      transform: 'translateY(50px)',
    },
    visible: {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  }

  return { scrollVariants }
}
